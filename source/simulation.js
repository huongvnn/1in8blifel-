import { rnd, chance, pick, clamp, randomInt } from './random.js';
import { DECISIONS } from './decisions.js';
import REFLECTIONS from '../data/reflections.json' with { type: 'json' };
import eventsData from '../data/events.json' with { type: 'json' };

// Realistic causes of death cataloged by age group and risk factor
const CAUSES_INFANT = [
  { id: 'neonatal', vi: 'Bệnh lý sơ sinh (sinh non, ngạt sơ sinh)', en: 'Neonatal conditions (preterm birth, complications)', ko: '신생아 질환 (조산·출생 합병증)' },
  { id: 'congenital', vi: 'Dị tật bẩm sinh', en: 'Congenital anomalies', ko: '선천성 기형' },
  { id: 'infection', vi: 'Nhiễm trùng huyết sơ sinh', en: 'Neonatal sepsis', ko: '신생아 패혈증' },
  { id: 'pneumonia', vi: 'Viêm phổi cấp tính', en: 'Acute pneumonia', ko: '급성 폐렴' }
];

const CAUSES_CHILD = [
  { id: 'pneumonia', vi: 'Viêm phổi (nhiễm trùng hô hấp dưới)', en: 'Pneumonia (lower respiratory infection)', ko: '폐렴 (하기도 감염)' },
  { id: 'diarrhea', vi: 'Bệnh tiêu chảy cấp và mất nước', en: 'Diarrheal disease and severe dehydration', ko: '설사병' },
  { id: 'malaria', vi: 'Sốt rét ác tính', en: 'Severe malaria', ko: '말라리아' },
  { id: 'malnutrition', vi: 'Suy dinh dưỡng nặng và suy kiệt', en: 'Severe acute malnutrition', ko: '영양실조' },
  { id: 'drowning', vi: 'Tai nạn đuối nước', en: 'Accidental drowning', ko: '익사 사고' }
];

const CAUSES_YOUTH = [
  { id: 'traffic', vi: 'Tai nạn giao thông đường bộ', en: 'Road traffic injuries', ko: '교통사고' },
  { id: 'accident', vi: 'Tai nạn lao động / Té ngã', en: 'Occupational injury / accidental fall', ko: '사고 (산업재해·낙상)' },
  { id: 'conflict', vi: 'Nạn nhân xung đột vũ trang / Chiến tranh', en: 'Casualty of armed conflict', ko: '무력 분쟁' },
  { id: 'violence', vi: 'Nạn nhân của tội phạm bạo lực', en: 'Homicide / violent crime', ko: '타살' },
  { id: 'maternal', vi: 'Biến chứng thai sản khi sinh nở', en: 'Maternal childbirth complications', ko: '출산 합병증 (모성 사망)' },
  { id: 'dengue', vi: 'Sốt xuất huyết Dengue nặng', en: 'Severe dengue fever', ko: '중증 뎅기열' }
];

const CAUSES_ELDER = [
  { id: 'heart', vi: 'Bệnh tim thiếu máu cục bộ (nhồi máu cơ tim)', en: 'Ischemic heart disease (heart attack)', ko: '허혈성 심장질환 (심근경색)' },
  { id: 'stroke', vi: 'Đột quỵ (tai biến mạch máu não)', en: 'Stroke (cerebrovascular accident)', ko: '뇌졸중' },
  { id: 'cancer', vi: 'Bệnh ung thư', en: 'Cancer', ko: '암' },
  { id: 'copd', vi: 'Bệnh phổi tắc nghẽn mạn tính (COPD)', en: 'Chronic obstructive pulmonary disease (COPD)', ko: '만성폐쇄성폐질환 (COPD)' },
  { id: 'kidney', vi: 'Suy thận mạn tính giai đoạn cuối', en: 'End-stage chronic kidney disease', ko: '만성 신장질환' },
  { id: 'diabetes', vi: 'Biến chứng tiểu đường', en: 'Complications of diabetes mellitus', ko: '당뇨병 합병증' },
  { id: 'old_age', vi: 'Tuổi già thanh thản qua đời', en: 'Natural causes of old age', ko: '노환으로 평온하게 별세' }
];

export function advanceOneYear(state) {
  if (!state.alive) return state;

  const currentAge = state.yearsLived;
  const nextAge = currentAge + 1;
  state.yearsLived = nextAge;

  const country = state.country;
  const newLogs = [];

  // 1. Mortality risk calculation based on actual UN/WHO figures
  let deathProbability = 0;
  if (currentAge === 0) {
    // Infant mortality rate (per 1,000 live births)
    deathProbability = (country.im || 15) / 1000;
  } else if (currentAge >= 1 && currentAge <= 4) {
    // Under-5 mortality remainder spread across ages 1-4
    const u5Rem = Math.max(0, (country.u5 || 25) - (country.im || 15));
    deathProbability = (u5Rem / 4) / 1000;
  } else if (currentAge < 50) {
    // Young adult mortality: Baseline ~0.08% adjusted for hazards, road safety, war
    const roadRisk = (country.road || 15) / 100000;
    const warRisk = (country.war || 0) * 0.005;
    const homRisk = (country.hom || 3) / 100000;
    const baseRisk = 0.0006 + roadRisk + warRisk + homRisk;
    deathProbability = baseRisk;
  } else {
    // Gompertz-Makeham mortality curve for older adults
    // P(death) = alpha * exp(beta * age) calibrated to country life expectancy
    const le = country.le || 73;
    const ageFactor = Math.pow(1.09, nextAge - 50);
    const countryExpectancyAdj = Math.pow(78 / le, 2.2);
    deathProbability = 0.003 * ageFactor * countryExpectancyAdj;
  }

  // Health modifier: Healthy characters survive better
  const healthAdj = (100 - state.stats.health) / 50; // health=100 -> 0x, health=50 -> 1x, health=0 -> 2x
  deathProbability *= clamp(healthAdj, 0.3, 2.5);

  // Maximum human age cap
  if (nextAge >= 115) deathProbability = 1.0;

  // Check death occurrence
  if (chance(deathProbability)) {
    state.alive = false;
    let cause = null;
    if (currentAge === 0) {
      cause = pick(CAUSES_INFANT);
    } else if (currentAge <= 4) {
      cause = pick(CAUSES_CHILD);
    } else if (currentAge <= 50) {
      cause = pick(CAUSES_YOUTH);
    } else {
      cause = nextAge >= (country.le || 75) + 8 ? CAUSES_ELDER[CAUSES_ELDER.length - 1] : pick(CAUSES_ELDER);
    }

    state.causeOfDeath = cause;
    state.stats.health = 0;
    newLogs.push({
      age: nextAge,
      type: 'death',
      text: {
        vi: `Qua đời ở tuổi ${nextAge} do ${cause.vi}.`,
        en: `Passed away at age ${nextAge} due to ${cause.en}.`,
        ko: `${nextAge}세에 ${cause.ko}(으)로 세상을 떠났습니다.`
      }
    });

    state.log.unshift(...newLogs);
    return state;
  }

  // 2. Character growth, Education, Career, and Life events if alive
  // Age-based milestone titles and careers
  if (nextAge === 1) {
    newLogs.push({
      age: 1,
      type: 'event',
      text: {
        vi: 'Mừng sinh nhật 1 tuổi tròn trĩnh, bập bẹ gọi tiếng mẹ cha đầu tiên!',
        en: 'Celebrated your 1st birthday, taking tiny steps and babbling first words!',
        ko: '첫 번째 생일을 맞이하여 첫 발을 떼고 옹알이를 시작했습니다!'
      }
    });
  } else if (nextAge === 7 && state.stats.educationLevel === 0) {
    // Automatic primary enrollment if in high income country
    if (country.p === 'hi' || country.p === 'eca') {
      state.stats.educationLevel = 1;
      state.job = 'Học sinh tiểu học';
      state.jobId = 'student_prim';
      newLogs.push({
        age: 7,
        type: 'event',
        text: {
          vi: 'Bắt đầu cắp sách tới trường tiểu học, học đọc những câu thơ đầu đời.',
          en: 'Entered primary school, learning to read stories and solve arithmetic.',
          ko: '초등학교에 입학하여 글을 읽고 셈하는 법을 배웠습니다.'
        }
      });
    }
  }

  // Career salary & financial accumulation
  if (nextAge >= 18 && state.alive) {
    const basePpp = country.ppp || 15000;
    const eduMult = state.stats.educationLevel >= 4 ? 1.6 : state.stats.educationLevel >= 2 ? 1.1 : 0.7;
    const quintileMult = 0.5 + state.q * 0.25;
    const annualIncome = Math.round((basePpp / 12) * eduMult * quintileMult);
    const savingsRate = 0.15;
    state.stats.wealth += Math.round(annualIncome * savingsRate);

    // Job promotions / Career progress
    if (nextAge === 23 && state.jobId === 'student_uni') {
      state.job = 'Cử nhân / Chuyên viên';
      state.jobId = 'specialist';
      newLogs.push({
        age: 23,
        type: 'event',
        text: {
          vi: 'Tốt nghiệp Đại học danh dự, chính thức bắt đầu công việc chuyên môn!',
          en: 'Graduated from university with honors and stepped into a professional career!',
          ko: '대학을 우수한 성적으로 졸업하고 전문 직무에서 커리어를 시작했습니다!'
        }
      });
    } else if (nextAge === 40 && state.jobId !== 'owner') {
      state.job = 'Quản lý cấp cao';
      newLogs.push({
        age: 40,
        type: 'event',
        text: {
          vi: 'Được thăng chức lên vị trí quản lý sau nhiều năm cống hiến tận tụy.',
          en: 'Promoted to a senior leadership role in recognition of years of dedicated work.',
          ko: '오랜 헌신과 성과를 인정받아 총괄 관리직으로 승진했습니다.'
        }
      });
    } else if (nextAge === 65 && !state.flags.retired) {
      state.flags.retired = true;
      state.job = 'Nghỉ hưu';
      state.jobId = 'retired';
      newLogs.push({
        age: 65,
        type: 'event',
        text: {
          vi: 'Chính thức nghỉ hưu sau hơn 40 năm lao động bền bỉ, an dưỡng tuổi già.',
          en: 'Officially retired after four decades of honest labor to enjoy peaceful leisure.',
          ko: '평생의 성실한 노동을 마치고 명예롭게 은퇴하여 노후 생활에 들어갔습니다.'
        }
      });
    }
  }

  // Family events: Partner & Children
  if (state.family.partner && state.family.partner.alive) {
    const currentChildrenCount = state.family.children.length;
    const maxChildren = Math.max(1, Math.round(country.tfr || 2));
    if (nextAge >= 23 && nextAge <= 38 && currentChildrenCount < maxChildren && chance(0.28)) {
      const childGender = chance(0.51) ? 'M' : 'F';
      const childName = childGender === 'M' ? 'Bé trai' : 'Bé gái';
      state.family.children.push({ name: childName, gender: childGender, bornAtAge: nextAge, alive: true });
      state.stats.happiness += 12;
      newLogs.push({
        age: nextAge,
        type: 'family',
        text: {
          vi: `Gia đình đón chào một thiên thần nhỏ chào đời! Bạn chính thức làm cha/mẹ.`,
          en: `Welcomed a beautiful baby into the world! You became a proud parent.`,
          ko: `새 생명이 태어났습니다! 부모가 되어 아기를 품에 안았습니다.`
        }
      });
    }
  }

  // Grandchildren
  if (nextAge >= 55 && state.family.children.length > 0 && chance(0.2) && state.family.grandchildrenCount < 4) {
    state.family.grandchildrenCount++;
    state.stats.happiness += 10;
    newLogs.push({
      age: nextAge,
      type: 'family',
      text: {
        vi: 'Con bạn sinh cháu đầu lòng! Cả nhà quây quần hạnh phúc chúc mừng.',
        en: 'Your child had a baby! You held your beloved grandchild in your arms.',
        ko: '첫 손주를 보았습니다! 온 가족이 모여 새로운 탄생을 축하했습니다.'
      }
    });
  }

  // Aging parents' health
  if (state.family.mom.alive) {
    state.family.mom.age++;
    if (state.family.mom.age >= 75 && chance(0.08)) {
      state.family.mom.alive = false;
      state.stats.happiness -= 15;
      newLogs.push({
        age: nextAge,
        type: 'family',
        text: {
          vi: `Người mẹ yêu quý đã thanh thản tạ thế ở tuổi ${state.family.mom.age}.`,
          en: `Your beloved mother passed away peacefully at age ${state.family.mom.age}.`,
          ko: `어머니께서 ${state.family.mom.age}세를 일기로 영면하셨습니다.`
        }
      });
    }
  }
  if (state.family.dad.alive) {
    state.family.dad.age++;
    if (state.family.dad.age >= 75 && chance(0.09)) {
      state.family.dad.alive = false;
      state.stats.happiness -= 15;
      newLogs.push({
        age: nextAge,
        type: 'family',
        text: {
          vi: `Người cha đáng kính đã qua đời ở tuổi ${state.family.dad.age}.`,
          en: `Your respected father passed away at age ${state.family.dad.age}.`,
          ko: `아버지께서 ${state.family.dad.age}세를 일기로 영면하셨습니다.`
        }
      });
    }
  }

  // Natural health wear-down past 60
  if (nextAge >= 60) {
    state.stats.health = Math.max(10, state.stats.health - randomInt(1, 3));
  }

  // World historical events if birthYear is defined
  const currentCalYear = (state.birthYear || 2024) + nextAge;
  const HISTORICAL_EVENTS = {
    1969: { vi: 'Sự kiện Apollo 11: Loài người lần đầu tiên đặt chân lên Mặt Trăng!', en: 'Apollo 11 lands on the Moon; humanity takes its first steps on another world!', ko: '인류가 아폴로 11호를 타고 달에 첫 발을 내디뎠습니다!' },
    1975: { vi: 'Chiến tranh Việt Nam kết thúc; hòa bình lập lại trên toàn cõi.', en: 'The Vietnam War concludes, ushering in an era of peace.', ko: '베트남 전쟁이 종식되고 평화가 찾아왔습니다.' },
    1989: { vi: 'Bức tường Berlin sụp đổ; Chiến tranh Lạnh bước vào hồi kết.', en: 'The Berlin Wall falls; the Cold War draws toward its conclusion.', ko: '베를린 장벽이 무너지고 동서 냉전이 종식되었습니다.' },
    1995: { vi: 'Mạng Internet thương mại toàn cầu bùng nổ, kết nối thế giới.', en: 'The global commercial World Wide Web connects millions across continents.', ko: '상용 인터넷이 전 세계로 확산되며 정보화 시대가 열렸습니다.' },
    2001: { vi: 'Biến cố ngày 11 tháng 9 làm chấn động an ninh toàn cầu.', en: 'The September 11 attacks shake international relations and aviation.', ko: '9·11 테러가 발생하여 전 세계에 큰 충격을 주었습니다.' },
    2008: { vi: 'Cuộc khủng hoảng tài chính thế giới bùng nổ, kinh tế toàn cầu lao dốc.', en: 'The global financial crisis triggers widespread economic turmoil.', ko: '글로벌 금융위기가 발발하여 세계 경제가 휘청였습니다.' },
    2020: { vi: 'Đại dịch COVID-19 bùng phát; thế giới thực hiện giãn cách xã hội.', en: 'The COVID-19 pandemic spreads globally; worldwide lockdowns begin.', ko: '코로나19 대유행이 시작되어 전 세계적인 봉쇄와 거리두기가 시행되었습니다.' }
  };

  if (state.birthYear && HISTORICAL_EVENTS[currentCalYear] && !state.flags['hist_' + currentCalYear]) {
    state.flags['hist_' + currentCalYear] = true;
    newLogs.push({
      age: nextAge,
      type: 'event',
      text: HISTORICAL_EVENTS[currentCalYear],
      fact: {
        vi: `Sự kiện lịch sử thế giới năm ${currentCalYear}.`,
        en: `Global historical milestone of the year ${currentCalYear}.`,
        ko: `${currentCalYear}년의 세계사적 대사건입니다.`
      }
    });
  }

  // Authentic demographic events from the 181-event database
  const eligibleEvents = eventsData.filter((ev) => {
    if (nextAge < ev.minAge || nextAge > ev.maxAge) return false;
    if (state.flags['ev_' + ev.id]) return false;

    // Specific contextual triggers
    if (ev.id === 'vax') return nextAge === 0;
    if (ev.id === 'steps') return nextAge === 1;
    if (ev.id === 'word') return nextAge <= 2;
    if (ev.id === 'kid_academy') return ['KOR', 'CHN', 'JPN', 'VNM', 'TWN', 'SGP'].includes(country.id);
    if (ev.id === 'kid_water') return (country.p === 'ssa' || country.p === 'sa') && !state.urban;
    if (ev.id === 'kid_snow') return ['KOR', 'JPN', 'CHN', 'USA', 'CAN', 'RUS', 'MNG', 'NOR', 'SWE', 'FIN', 'DEU'].includes(country.id);
    if (ev.id === 'kid_rain') return ['se', 'sa', 'lac'].includes(country.p);
    if (ev.id === 'hungry') return country.ppp < 5000 && state.q <= 2;
    if (ev.id === 'childwork') return country.agr > 30 && state.q <= 2;
    if (ev.id === 'exam') return nextAge === 18;
    if (ev.id === 'teenjob') return nextAge >= 16 && nextAge <= 18;
    if (ev.id === 'crush') return nextAge >= 14 && nextAge <= 17;
    if (ev.id === 'anniv') return !!state.family.partner && nextAge >= 35;
    if (ev.id === 'kidcall') return state.family.children.length > 0 && nextAge >= 60;
    if (ev.id === 'graying') return nextAge === 50;

    return true;
  });

  // Roll to trigger 1 event
  if (eligibleEvents.length && chance(0.45)) {
    const chosenEv = pick(eligibleEvents);
    state.flags['ev_' + chosenEv.id] = nextAge;

    // Apply stat effects
    if (chosenEv.statEffects) {
      if (chosenEv.statEffects.health) state.stats.health = clamp(state.stats.health + chosenEv.statEffects.health, 5, 100);
      if (chosenEv.statEffects.happiness) state.stats.happiness = clamp(state.stats.happiness + chosenEv.statEffects.happiness, 5, 100);
      if (chosenEv.statEffects.smarts) state.stats.smarts = clamp(state.stats.smarts + chosenEv.statEffects.smarts, 5, 100);
      if (chosenEv.statEffects.social) state.stats.social = clamp(state.stats.social + chosenEv.statEffects.social, 5, 100);
    }

    newLogs.push({
      age: nextAge,
      type: chosenEv.cat === 'family' ? 'family' : 'event',
      text: chosenEv.text,
      fact: chosenEv.fact
    });
  }


  // Advance peer babies born in the same second
  if (state.peers && state.peers.length) {
    state.peers = advancePeers(state.peers, currentAge, nextAge);
  }

  // Check if an interactive decision triggers this year
  const decisionKeys = Object.keys(DECISIONS);
  for (const dk of decisionKeys) {
    const d = DECISIONS[dk];
    if (d.age === nextAge && !state.flags['dec_' + dk]) {
      state.pendingDecision = d;
      state.flags['dec_' + dk] = true;
      break;
    }
  }

  // Check if a demographic reflection checkpoint triggers at milestone ages (5, 15, 30, 50, 70)
  if (!state.pendingDecision && REFLECTIONS[nextAge] && !state.flags['refl_' + nextAge]) {
    state.pendingReflection = REFLECTIONS[nextAge];
    state.flags['refl_' + nextAge] = true;
  }

  state.log.unshift(...newLogs);
  return state;
}

/**
 * Simulate the life and mortality of peer babies born at the same second
 */
export function advancePeers(peers, currentAge, nextAge) {
  if (!peers) return [];
  return peers.map((peer) => {
    if (!peer.alive) return peer;

    const c = peer.country;
    let deathProb = 0;
    if (currentAge === 0) {
      deathProb = (c.im || 15) / 1000;
    } else if (currentAge < 5) {
      const u5Rem = Math.max(0, (c.u5 || 25) - (c.im || 15));
      deathProb = (u5Rem / 4) / 1000;
    } else if (currentAge < 50) {
      deathProb = 0.0006 + ((c.road || 15) / 100000) + ((c.war || 0) * 0.005);
    } else {
      const le = c.le || 73;
      deathProb = 0.003 * Math.pow(1.09, nextAge - 50) * Math.pow(78 / le, 2.2);
    }

    if (chance(deathProb)) {
      const cause = currentAge === 0
        ? pick(CAUSES_INFANT)
        : currentAge < 5
        ? pick(CAUSES_CHILD)
        : currentAge < 50
        ? pick(CAUSES_YOUTH)
        : pick(CAUSES_ELDER);

      return {
        ...peer,
        alive: false,
        deathAge: nextAge,
        deathCause: cause
      };
    }

    // Milestones for status
    let status = peer.status;
    if (nextAge === 3) {
      status = { vi: 'Học mẫu giáo', en: 'In kindergarten', ko: '유치원' };
    } else if (nextAge === 6) {
      status = { vi: 'Vào học lớp một', en: 'In primary school', ko: '초등학교 입학' };
    } else if (nextAge === 12) {
      status = { vi: 'Học trung học cơ sở', en: 'In middle school', ko: '중학교' };
    } else if (nextAge === 15) {
      status = { vi: 'Học trung học phổ thông', en: 'In high school', ko: '고등학교' };
    } else if (nextAge === 18) {
      const tracks = [
        { vi: 'Học đại học', en: 'In university', ko: '대학교' },
        { vi: 'Bắt đầu đi làm', en: 'Started working', ko: '취업' },
        { vi: 'Làm nông nghiệp', en: 'Farming', ko: '농업' }
      ];
      status = pick(tracks);
    } else if (nextAge === 25) {
      const careers = [
        { vi: 'Nhân viên công ty', en: 'Office worker', ko: '회사원' },
        { vi: 'Kỹ sư phần mềm', en: 'Software engineer', ko: '엔지니어' },
        { vi: 'Y tá bệnh viện', en: 'Nurse', ko: '간호사' },
        { vi: 'Kinh doanh tự do', en: 'Small business owner', ko: '자영업' },
        { vi: 'Công nhân nhà máy', en: 'Factory worker', ko: '공장 근로자' },
        { vi: 'Nông dân', en: 'Farmer', ko: '농민' }
      ];
      status = pick(careers);
    } else if (nextAge === 30 && !peer.status.vi.includes('kết hôn')) {
      status = {
        vi: `${status.vi} · Đã kết hôn`,
        en: `${status.en} · Married`,
        ko: `${status.ko} · 기혼`
      };
    } else if (nextAge === 62) {
      status = { vi: 'Nghỉ hưu an nhàn', en: 'Retired', ko: '은퇴' };
    }

    return {
      ...peer,
      status
    };
  });
}
