(function () {
'use strict';
const chance = probability => Math.random() < probability;

const DECISIONS = {
  // Age 2: Temperament
  temper: {
    id: 'temper',
    age: 2,
    title: {
      vi: 'Hai tuổi, thế giới lạ lẫm',
      en: 'Two years old, the world outside',
      ko: '두 살, 낯선 바깥'
    },
    body: {
      vi: 'Bạn chập chững bước ra ngoài thế giới. Trước mắt bạn ngập tràn những điều chưa từng thấy. Bạn sẽ bị thu hút bởi điều gì nhất?',
      en: 'You take your first steady steps outside into a vast world full of sights and sounds. What draws your attention first?',
      ko: '이제 제법 걷기 시작한 당신. 세상은 처음 보는 것들로 가득합니다. 당신은 무엇부터 할까요?'
    },
    fact: {
      vi: 'Tính cách con người được định hình bởi cả yếu tố bẩm sinh và môi trường đầu đời. Nghiên cứu cặp song sinh cho thấy khoảng 40% khác biệt tính cách do di truyền (Vukasović & Bratko 2015).',
      en: 'Temperament is shaped both by genetics and early experience. Twin studies show about 40% of personality variance is hereditary (Vukasović & Bratko 2015).',
      ko: '기질은 타고나는 몫과 자라며 겪는 일이 함께 만듭니다. 쌍둥이 연구에서 성격 차이의 약 40%가 유전으로 설명됩니다.'
    },
    choices: [
      {
        id: 'curious',
        label: {
          vi: 'Ngồi mân mê, tò mò nhìn ngắm từng viên đá và chiếc lá',
          en: 'Sit and examine pebbles, leaves, and tiny insects with intense curiosity',
          ko: '흙과 돌멩이를 한참 들여다본다'
        },
        sub: { vi: 'Trí tuệ +5, Hạnh phúc +2', en: 'Smarts +5, Happiness +2', ko: '지식 +5, 행복 +2' },
        apply: (state) => {
          state.stats.smarts += 5;
          state.stats.happiness += 2;
          return {
            vi: 'Bạn dành hàng giờ chăm chú quan sát thế giới vi mô quanh mình.',
            en: 'You spent hours quietly fascinated by the small wonders of the world.',
            ko: '당신은 주변의 작은 자연을 관찰하는 데 깊이 빠져들었습니다.'
          };
        }
      },
      {
        id: 'active',
        label: {
          vi: 'Chạy hết tốc lực về phía những âm thanh náo nhiệt',
          en: 'Run with all your might toward sounds, animals, and moving things',
          ko: '있는 힘껏 달려 나간다'
        },
        sub: { vi: 'Sức khỏe +6, Năng động', en: 'Health +6, Energetic', ko: '건강 +6' },
        apply: (state) => {
          state.stats.health += 6;
          return {
            vi: 'Đôi chân bạn thoăn thoắt khám phá khắp ngõ xóm.',
            en: 'Your quick legs carried you excitedly all around the neighborhood.',
            ko: '씩씩하게 달리는 당신의 웃음소리가 온 동네에 울려 퍼졌습니다.'
          };
        }
      },
      {
        id: 'empathetic',
        label: {
          vi: 'Lại gần chìa tay an ủi một bạn nhỏ đang bật khóc',
          en: 'Walk over and gently reach out a hand to another crying toddler',
          ko: '우는 아이에게 다가간다'
        },
        sub: { vi: 'Xã hội +6, Hạnh phúc +4', en: 'Social +6, Happiness +4', ko: '관계 +6, 행복 +4' },
        apply: (state) => {
          state.stats.social += 6;
          state.stats.happiness += 4;
          return {
            vi: 'Bạn thể hiện sự ấm áp và quan tâm đến người khác từ rất sớm.',
            en: 'You showed innate warmth and kindness to those around you from a tender age.',
            ko: '어린 나이에도 다른 사람의 슬픔에 귀 기울이는 다정함을 보였습니다.'
          };
        }
      },
      {
        id: 'resilient',
        label: {
          vi: 'Tự mình gượng dậy sau mỗi lần vấp ngã mà không hề khóc',
          en: 'Get straight back up after tumbling down without shedding a tear',
          ko: '넘어져도 혼자 일어나 다시 걷는다'
        },
        sub: { vi: 'Kiên cường, Sức bền +5', en: 'Resilience +5, Health +3', ko: '끈기 +5, 건강 +3' },
        apply: (state) => {
          state.stats.health += 3;
          state.stats.smarts += 3;
          return {
            vi: 'Sự kiên trì, không nản lòng đã trở thành một phần tính cách của bạn.',
            en: 'Undaunted resilience became a hallmark of your growing spirit.',
            ko: '아무리 넘어져도 털고 일어나는 단단한 마음이 싹텄습니다.'
          };
        }
      }
    ]
  },

  // Age 6: Primary schooling
  school1: {
    id: 'school1',
    age: 6,
    title: {
      vi: 'Tuổi lên sáu: Cơ hội đến trường',
      en: 'Age 6: The path to school',
      ko: '여섯 살: 학교의 문'
    },
    body: {
      vi: 'Đã đến tuổi vào lớp Một. Một số bạn bè cùng trang lứa bắt đầu cắp sách tới trường, nhưng tại những vùng quê hay gia đình thiếu thốn, không phải ai cũng có cơ hội đó.',
      en: 'It is time for first grade. Many children your age start school, but in poorer communities, school fees and family chores compete for a child\'s day.',
      ko: '초등학교에 입학할 나이가 되었습니다. 또래 몇몇은 학교에 가지만, 형편이 어려운 가정에서는 배움이 쉽지 않은 선택입니다.'
    },
    fact: {
      vi: 'Số năm đi học kỳ vọng trung bình toàn cầu đã tăng từ 10.2 năm (năm 1990) lên gần 13 năm hiện nay (UNDP), song hàng chục triệu trẻ em vẫn còn phải lao động sớm.',
      en: 'Expected years of schooling globally has risen to nearly 13 years (UNDP), yet tens of millions of children still miss out due to poverty.',
      ko: '전 세계 약 1억 6천만 명의 어린이가 아동 노동을 겪고 있습니다 (ILO/UNICEF).'
    },
    choices: [
      {
        id: 'plea_school',
        label: {
          vi: 'Khao khát được đến trường học chữ cùng bạn bè',
          en: 'Ask earnestly to go to school and learn to read',
          ko: '학교에 보내 달라고 조른다'
        },
        sub: { vi: 'Trí tuệ +10, Học vấn cấp 1', en: 'Smarts +10, Enters Primary', ko: '지식 +10, 초등학교 입학' },
        apply: (state) => {
          const successRate = state.q >= 2 ? 0.95 : 0.65;
          if (chance(successRate)) {
            state.stats.educationLevel = 1;
            state.stats.smarts += 10;
            state.job = 'Học sinh tiểu học';
            state.jobId = 'student_prim';
            return {
              vi: 'Cha mẹ gom góp tiền mua tập sách, bạn chính thức bước vào lớp 1!',
              en: 'Your parents scrimped and saved for books, and you started first grade with pride!',
              ko: '가족의 응원 속에 초등학교에 입학해 글자를 배우기 시작했습니다!'
            };
          } else {
            state.stats.social += 5;
            state.job = 'Phụ giúp gia đình';
            return {
              vi: 'Gia cảnh quá khó khăn, bạn đành ở nhà phụ việc và tự học lỏm vài con chữ.',
              en: 'School fees were out of reach; you stayed home helping the family while teaching yourself what you could.',
              ko: '형편 탓에 학교 문턱을 넘지 못하고 집안일을 돕게 되었습니다.'
            };
          }
        }
      },
      {
        id: 'help_family',
        label: {
          vi: 'Ở nhà phụ giúp cha mẹ làm đồng / bán hàng nhỏ',
          en: 'Stay home to help with chores, farm work, or family trade',
          ko: '가족을 돕는다'
        },
        sub: { vi: 'Gia đình gắn bó, Thêm thu nhập nhỏ', en: 'Social +6, Small family income', ko: '가족 관계 +6' },
        apply: (state) => {
          state.stats.social += 6;
          state.stats.wealth += 50;
          state.job = 'Lao động phụ việc';
          return {
            vi: 'Bạn trở thành chỗ dựa nhỏ bé nhưng quý giá cho cả nhà trong thời gian khó khăn.',
            en: 'You became a cherished extra pair of helping hands for your struggling family.',
            ko: '어린 나이부터 부모님의 일손을 거들며 가족의 든든한 버팀목이 되었습니다.'
          };
        }
      }
    ]
  },

  // Age 12: Middle school transition
  school2: {
    id: 'school2',
    age: 12,
    title: {
      vi: 'Mười hai tuổi: Bước chuyển cấp hai',
      en: 'Age 12: Middle school crossroads',
      ko: '열두 살: 중학교 진학'
    },
    body: {
      vi: 'Tốt nghiệp tiểu học. Để học tiếp lên cấp hai, chi phí mua sắm sách vở, đồng phục và phương tiện đi lại bắt đầu tăng lên đáng kể.',
      en: 'Primary school is behind you. Continuing to secondary education requires tuition, uniforms, and longer travel.',
      ko: '초등학교를 마쳤습니다. 계속 공부하려면 학비와 교복, 교통비가 듭니다.'
    },
    fact: {
      vi: 'Tại các quốc gia thu nhập thấp, tỷ lệ hoàn thành cấp hai chỉ đạt khoảng 35-50%, so với hơn 95% ở các nước phát triển (UNESCO).',
      en: 'In low-income nations, lower-secondary completion rates hover around 40%, compared to 95%+ in high-income countries (UNESCO).',
      ko: '소득 수준에 따라 중등교육 진학률의 격차가 크게 벌어집니다 (UNESCO).'
    },
    choices: [
      {
        id: 'middle_school',
        label: {
          vi: 'Nỗ lực thi vào trường trung học cơ sở',
          en: 'Continue onto middle school with diligence',
          ko: '공부를 계속한다 (중학교 진학)'
        },
        sub: { vi: 'Trí tuệ +12, Học vấn cấp 2', en: 'Smarts +12, Enters Middle School', ko: '지식 +12' },
        apply: (state) => {
          state.stats.educationLevel = 2;
          state.stats.smarts += 12;
          state.job = 'Học sinh cấp hai';
          state.jobId = 'student_sec';
          return {
            vi: 'Bạn đỗ vào trường cấp hai, mở mang thêm chân trời tri thức toán học, văn học và khoa học!',
            en: 'You stepped into middle school, eager to explore literature, mathematics, and science!',
            ko: '중학교에 진학하여 새로운 지식과 친구들을 만났습니다.'
          };
        }
      },
      {
        id: 'apprenticeship',
        label: {
          vi: 'Học một nghề thủ công / cơ khí hoặc phụ kinh doanh',
          en: 'Learn a practical trade, mechanic skills, or commerce',
          ko: '기술을 배우며 일하기 시작한다'
        },
        sub: { vi: 'Học nghề thực tế, Tiền +$200', en: 'Practical skill, Wealth +$200', ko: '기술 습득, 소득' },
        apply: (state) => {
          state.stats.wealth += 200;
          state.stats.social += 5;
          state.job = 'Học nghề thợ sửa chữa';
          state.jobId = 'apprentice';
          return {
            vi: 'Bạn bắt đầu học nghề cơ khí thủ công, đôi bàn tay dần trở nên khéo léo và nhanh nhẹn.',
            en: 'You apprenticed under a master craftsman, gaining practical skills that will last a lifetime.',
            ko: '일찍이 기술을 배우기 시작해 손재주를 갈고닦았습니다.'
          };
        }
      }
    ]
  },

  // Age 15: High school / Career
  school3: {
    id: 'school3',
    age: 15,
    title: {
      vi: 'Mười lăm tuổi: Ngã rẽ tương lai',
      en: 'Age 15: The turning point',
      ko: '열다섯 살: 진로의 갈림길'
    },
    body: {
      vi: 'Ở tuổi 15, những người bạn cùng trang lứa rẽ sang các ngả đường khác nhau: người tiếp tục học lên cấp ba, người vào trường nghề, người lập tức kiếm sống.',
      en: 'At fifteen, paths diverge: some head to academic high schools, others to vocational trade institutes, while many enter the workforce directly.',
      ko: '중학교를 마친 당신. 어떤 고등학교에 진학하거나, 사회로 첫발을 내딛을 때입니다.'
    },
    fact: {
      vi: 'Đào tạo nghề chất lượng cao tại Đức, Thụy Sĩ (hệ thống Dual VET) giúp tỷ lệ thất nghiệp thanh niên dưới 5%, trong khi tại Nam Âu và Nam Á tỷ lệ này có thể trên 25%.',
      en: 'Dual vocational training systems keep youth unemployment under 5% in Central Europe, while general youth unemployment exceeds 20% in many regions.',
      ko: '직업 교육과 인문계 진학의 선택은 이후 수십 년의 커리어 경로를 좌우합니다.'
    },
    choices: [
      {
        id: 'high_school',
        label: {
          vi: 'Thi vào trường Trung học phổ thông (Cấp 3) hướng tới Đại học',
          en: 'Academic High School (aiming for college entrance)',
          ko: '인문계 고등학교 진학'
        },
        sub: { vi: 'Trí tuệ +15, Hướng tới Đại học', en: 'Smarts +15, University track', ko: '지식 +15' },
        apply: (state) => {
          state.stats.educationLevel = 3;
          state.stats.smarts += 15;
          state.job = 'Học sinh cấp ba';
          state.jobId = 'student_high';
          return {
            vi: 'Bạn bước vào những năm tháng thanh xuân miệt mài bên trang sách chuẩn bị cho kỳ thi lớn.',
            en: 'You embarked on demanding high school years, studying late into the evening for college exams.',
            ko: '고등학교에 진학해 대학 입시를 향해 밤낮으로 매진했습니다.'
          };
        }
      },
      {
        id: 'vocational',
        label: {
          vi: 'Học trường Cao đẳng nghề / Kỹ thuật công nghệ',
          en: 'Vocational Technical School (hands-on modern trades)',
          ko: '직업계 고등학교 / 기술학교'
        },
        sub: { vi: 'Kỹ năng vững, Dễ có việc làm', en: 'Job stability, Wealth +$400', ko: '기술 취업 유리' },
        apply: (state) => {
          state.stats.educationLevel = 2.5;
          state.stats.wealth += 400;
          state.job = 'Kỹ thuật viên thực tập';
          state.jobId = 'technician_trainee';
          return {
            vi: 'Bạn nắm vững kỹ thuật hiện đại và được nhiều doanh nghiệp địa phương săn đón thực tập.',
            en: 'You mastered sought-after technical skills and secured a promising internship.',
            ko: '실무 기술을 탄탄히 익혀 졸업 전 취업 제안을 받았습니다.'
          };
        }
      },
      {
        id: 'workforce',
        label: {
          vi: 'Đi làm công nhân / buôn bán kiếm tiền ngay',
          en: 'Enter the workforce immediately (factory, trade, sales)',
          ko: '일을 시작해 스스로 돈을 번다'
        },
        sub: { vi: 'Thu nhập tức thì, Tiền +$800', en: 'Immediate income +$800', ko: '빠른 소득' },
        apply: (state) => {
          state.stats.wealth += 800;
          state.job = 'Công nhân / Nhân viên bán hàng';
          state.jobId = 'worker';
          return {
            vi: 'Bạn tự hào cầm trên tay đồng lương đầu tiên gửi về phụ giúp cha mẹ mua sắm đồ đạc.',
            en: 'You took immense pride in handing your first monthly paycheck to help support your parents.',
            ko: '사회생활을 시작해 첫 월급으로 가족들에게 선물을 안겨주었습니다.'
          };
        }
      }
    ]
  },

  // Age 18: College & Adulthood
  college: {
    id: 'college',
    age: 18,
    title: {
      vi: 'Mười tám tuổi: Đại học hay Vào đời?',
      en: 'Age 18: Higher Education or Career?',
      ko: '열여덟 살: 대학 입시와 독립'
    },
    body: {
      vi: 'Bạn tròn 18 tuổi - cột mốc chính thức trở thành người trưởng thành. Tương lai phía trước hoàn toàn do bạn quyết định.',
      en: 'Eighteen arrives: the legal threshold of adulthood. The choices you make now will ripple through the decades ahead.',
      ko: '성인이 된 열여덟 살. 대학 진학과 사회 진출, 혹은 새로운 도전을 결정할 순간입니다.'
    },
    fact: {
      vi: 'Theo Ngân hàng Thế giới (World Bank), bằng đại học giúp tăng thu nhập bình quân khoảng 14% cho mỗi năm học cao hơn so với người chỉ học hết phổ thông.',
      en: 'According to the World Bank, each additional year of tertiary education yields an average income premium of 14% globally.',
      ko: '고등교육 이수율은 국가의 기술 경쟁력과 개인의 평생 소득에 결정적 영향을 미칩니다.'
    },
    choices: [
      {
        id: 'go_uni',
        label: {
          vi: 'Thi và theo học Đại học chuyên ngành',
          en: 'Attend University (STEM, Medicine, Business, Humanities)',
          ko: '대학에 진학한다'
        },
        sub: { vi: 'Trí tuệ +20, Tốt nghiệp Cử nhân', en: 'Smarts +20, Degree pathway', ko: '지식 +20, 대졸' },
        apply: (state) => {
          state.stats.educationLevel = 4;
          state.stats.smarts += 20;
          state.job = 'Sinh viên Đại học';
          state.jobId = 'student_uni';
          return {
            vi: 'Cầm giấy báo trúng tuyển trên tay, bạn háo hức bước vào giảng đường đại học với bao ước mơ!',
            en: 'With your acceptance letter in hand, you stepped onto campus full of ambition and hope!',
            ko: '원하던 대학교에 합격해 캠퍼스 라이프와 전공 공부를 시작했습니다!'
          };
        }
      },
      {
        id: 'start_job',
        label: {
          vi: 'Tìm việc làm chuyên nghiệp hoặc đi làm văn phòng',
          en: 'Start a professional job / office career',
          ko: '곧바로 취업하여 사회생활을 시작한다'
        },
        sub: { vi: 'Tiền +$1,500, Kinh nghiệm', en: 'Wealth +$1,500, Career experience', ko: '소득 +$1,500' },
        apply: (state) => {
          state.stats.wealth += 1500;
          state.job = 'Nhân viên văn phòng';
          state.jobId = 'office_worker';
          return {
            vi: 'Bạn hòa nhập nhanh chóng vào môi trường làm việc chuyên nghiệp và bắt đầu tích lũy tài chính.',
            en: 'You adapted swiftly to workplace dynamics and began building financial stability.',
            ko: '직장에 안착하여 착실하게 경력을 쌓고 자립하기 시작했습니다.'
          };
        }
      },
      {
        id: 'travel_abroad',
        label: {
          vi: 'Tìm cơ hội xuất khẩu lao động hoặc du học nước ngoài',
          en: 'Seek opportunities abroad (working holiday, migration, scholarship)',
          ko: '해외 유학이나 취업에 도전한다'
        },
        sub: { vi: 'Kinh nghiệm quốc tế, Thu nhập cao hơn', en: 'Global experience, Higher earnings', ko: '새로운 기회' },
        apply: (state) => {
          state.stats.wealth += 2500;
          state.stats.smarts += 10;
          state.flags.abroad = true;
          return {
            vi: 'Bạn đặt chân đến miền đất mới, vừa làm việc chăm chỉ vừa gửi tiền về phụ giúp quê nhà!',
            en: 'You arrived in a foreign country, sending back generous remittances to your family back home.',
            ko: '낯선 타국에서 씩씩하게 일하며 고향의 가족들에게 정기적으로 송금했습니다.'
          };
        }
      }
    ]
  },

  // Age 26: Love & Marriage
  love: {
    id: 'love',
    age: 26,
    title: {
      vi: 'Hai mươi sáu tuổi: Tình yêu và Hôn nhân',
      en: 'Age 26: Romance and Commitment',
      ko: '스물여섯: 사랑과 결혼'
    },
    body: {
      vi: 'Bạn gặp gỡ một người tâm đầu ý hợp, cùng chia sẻ những buồn vui trong cuộc sống. Hai bạn bắt đầu bàn tính chuyện trăm năm.',
      en: 'You have met someone truly special who understands and inspires you. Thoughts turn toward marriage and shared futures.',
      ko: '인생의 기쁨과 슬픔을 나눌 수 있는 소중한 인연을 만났습니다. 두 사람은 함께할 미래를 이야기합니다.'
    },
    fact: {
      vi: 'Độ tuổi kết hôn trung bình lần đầu trên thế giới dao động từ 22 tuổi (một số nước châu Phi) đến 33 tuổi (Tây Âu, Hàn Quốc, Nhật Bản).',
      en: 'The average age at first marriage varies from early twenties in parts of South Asia/Africa to past 33 in Western Europe and East Asia.',
      ko: '많은 나라에서 초혼 연령이 30대 안팎으로 점차 높아지는 추세입니다.'
    },
    choices: [
      {
        id: 'marry',
        label: {
          vi: 'Tổ chức đám cưới ấm cúng, xây dựng mái ấm gia đình',
          en: 'Tie the knot in a joyous ceremony and build a family together',
          ko: '결혼하여 가정을 꾸린다'
        },
        sub: { vi: 'Hạnh phúc +15, Kết hôn', en: 'Happiness +15, Married', ko: '행복 +15, 결혼' },
        apply: (state) => {
          state.family.partner = { name: 'Người bạn đời', alive: true };
          state.stats.happiness += 15;
          return {
            vi: 'Một đám cưới ngập tràn tiếng cười chúc phúc của gia đình và bè bạn đã diễn ra!',
            en: 'Surrounded by loved ones, you exchanged heartfelt vows on a sunlit wedding day.',
            ko: '가족과 친지들의 따뜻한 축복 속에 아름다운 결혼식을 올렸습니다.'
          };
        }
      },
      {
        id: 'focus_career',
        label: {
          vi: 'Tạm gác chuyện kết hôn, dồn sức phát triển sự nghiệp và tự do cá nhân',
          en: 'Prioritize personal growth, financial goals, and career momentum',
          ko: '지금은 일과 커리어에 집중한다'
        },
        sub: { vi: 'Tiền +$3,000, Độc thân tự do', en: 'Wealth +$3,000, Independence', ko: '소득 +$3,000' },
        apply: (state) => {
          state.stats.wealth += 3000;
          state.stats.smarts += 5;
          return {
            vi: 'Bạn thăng tiến nhanh trong công việc, tận hưởng cuộc sống độc thân đầy tự do và trải nghiệm.',
            en: 'Your dedication yielded rapid promotions and financial independence.',
            ko: '맡은 일에서 실력을 인정받으며 경제적 자립을 공고히 다졌습니다.'
          };
        }
      }
    ]
  },

  // Age 35: Business or House investment
  midlife: {
    id: 'midlife',
    age: 35,
    title: {
      vi: 'Ba mươi lăm tuổi: An cư hay Mạo hiểm?',
      en: 'Age 35: Security or Adventure?',
      ko: '서른다섯: 안착이냐, 새로운 도전이냐'
    },
    body: {
      vi: 'Sau nhiều năm tích lũy, bạn có trong tay một khoản vốn kha khá. Đây là lúc đưa ra quyết định tài chính quan trọng cho tương lai.',
      en: 'With hard-earned savings accumulated, you stand at a major financial crossroads for your household.',
      ko: '수년간 성실히 모은 종잣돈. 내 집을 마련해 안정성을 높일지, 사업에 도전할지 고민합니다.'
    },
    fact: {
      vi: 'Sở hữu nhà ở là tài sản lớn nhất của hơn 70% hộ gia đình trên thế giới, nhưng khởi nghiệp thành công có thể tạo ra bước nhảy vọt về giai tầng kinh tế.',
      en: 'Home ownership represents the largest asset for over 70% of households globally, while entrepreneurship drives generational upward mobility.',
      ko: '부동산 자산은 가계의 가장 든든한 방패이며, 창업은 새로운 도약의 기회가 됩니다.'
    },
    choices: [
      {
        id: 'buy_home',
        label: {
          vi: 'Mua một căn nhà ấm cúng cho gia đình an cư lạc nghiệp',
          en: 'Purchase a family home for stability and enduring peace of mind',
          ko: '가족을 위한 내 집을 마련한다'
        },
        sub: { vi: 'Hạnh phúc +12, Sở hữu nhà riêng', en: 'Happiness +12, Homeowner', ko: '행복 +12, 내 집 마련' },
        apply: (state) => {
          state.stats.happiness += 12;
          state.flags.ownsHome = true;
          return {
            vi: 'Ngôi nhà mang tên bạn rộn rã tiếng cười, gia đình bạn an cư vững chãi!',
            en: 'Turning the key to your own front door brought an overwhelming sense of accomplishment.',
            ko: '드디어 마련한 우리 집 문패를 보며 가족 모두가 가슴 벅찬 감동을 느꼈습니다.'
          };
        }
      },
      {
        id: 'start_biz',
        label: {
          vi: 'Mở cơ sở kinh doanh / Khởi nghiệp theo đam mê',
          en: 'Found your own enterprise / Launch a business venture',
          ko: '내 사업 / 가게를 시작한다'
        },
        sub: { vi: 'Cơ hội nhân đôi tài sản hoặc rủi ro', en: 'High potential payoff, Entrepreneur', ko: '사업가 변신' },
        apply: (state) => {
          if (chance(0.65)) {
            state.stats.wealth += 8000;
            state.stats.happiness += 10;
            state.job = 'Chủ doanh nghiệp';
            return {
              vi: 'Cửa hàng / Công ty của bạn buôn may bán đắt, lợi nhuận tăng trưởng vượt bậc!',
              en: 'Your venture struck market demand and prospered beyond your fondest hopes!',
              ko: '창업한 사업이 큰 호응을 얻으며 번창하기 시작했습니다!'
            };
          } else {
            state.stats.wealth = Math.max(0, state.stats.wealth - 2000);
            state.stats.happiness -= 5;
            return {
              vi: 'Thương trường nhiều sóng gió, bạn gặp chút thua lỗ nhưng tích lũy được bài học quý giá.',
              en: 'A difficult economic climate tested your business, imparting invaluable resilience.',
              ko: '경기 침체로 어려움을 겪었지만, 값진 인생 교훈을 얻었습니다.'
            };
          }
        }
      }
    ]
  },

  // Age 42: Midlife Crisis
  mcrisis: {
    id: 'mcrisis',
    age: 42,
    title: {
      vi: 'Bốn mươi hai tuổi: Khủng hoảng tuổi trung niên',
      en: 'Age 42: Midlife Crossroads',
      ko: '마흔둘, 삶의 무게와 권태'
    },
    body: {
      vi: 'Sau nhiều năm miệt mài với trách nhiệm gia đình và công việc, bạn cảm thấy những mỏi mệt chất chứa. Cuộc sống như một vòng lặp khiến bạn tự vấn về ý nghĩa những gì mình đã chọn.',
      en: 'Years of unrelenting duty to work and household have taken their toll. You pause, wondering where the youthful dreams went and what truly matters.',
      ko: '가족 부양과 일상의 무게 속에서 찾아온 번아웃. 지난 삶을 돌아보며 진정한 행복이 무엇인지 깊은 고민에 잠깁니다.'
    },
    fact: {
      vi: 'Biểu đồ hạnh phúc đời người có hình chữ U (U-shaped happiness curve), thường chạm đáy ở lứa tuổi 40-48 trước khi tăng dần trở lại ở tuổi xế chiều (Blanchflower & Oswald).',
      en: 'The human happiness curve is widely documented as U-shaped across 145 countries, bottoming out in the 40s before rising steadily in later life (Blanchflower & Oswald).',
      ko: '인간의 행복감은 40대 중반에 생애 최저점을 기록했다가 노년기에 다시 회복되는 U자 곡선을 보입니다.'
    },
    choices: [
      {
        id: 'reconnect',
        label: {
          vi: 'Mở lòng tâm sự, dành trọn thời gian hâm nóng tình cảm cùng gia đình',
          en: 'Open up to your family and carve out dedicated time together',
          ko: '가족에게 솔직하게 털어놓고 함께하는 시간을 늘린다'
        },
        sub: { vi: 'Hạnh phúc +10, Quan hệ +10', en: 'Happiness +10, Social +10', ko: '행복 +10, 관계 +10' },
        apply: (state) => {
          state.stats.happiness += 10;
          state.stats.social += 10;
          return {
            vi: 'Những cuộc trò chuyện chân thành xoa dịu khoảng cách, tình thân lại ấm áp như thuở ban đầu.',
            en: 'Heartfelt talks dissolved the quiet distance; warmth and mutual understanding returned to your home.',
            ko: '진솔한 대화를 통해 묵은 오해가 풀리고 가족 간의 유대가 한층 더 단단해졌습니다.'
          };
        }
      },
      {
        id: 'new_passion',
        label: {
          vi: 'Theo đuổi một đam mê / kỹ năng mới đã ấp ủ từ lâu',
          en: 'Pursue a long-cherished hobby or learn a new creative craft',
          ko: '오랫동안 미뤄둔 새로운 취미나 배움에 도전한다'
        },
        sub: { vi: 'Trí tuệ +8, Hạnh phúc +8', en: 'Smarts +8, Happiness +8', ko: '지식 +8, 행복 +8' },
        apply: (state) => {
          state.stats.smarts += 8;
          state.stats.happiness += 8;
          return {
            vi: 'Niềm say mê mới tiếp thêm ngọn lửa nhiệt huyết cho tâm hồn bạn.',
            en: 'Immersing yourself in a creative calling sparked a renewed zest for life.',
            ko: '새로운 배움의 기쁨이 일상에 활력을 불어넣어 주었습니다.'
          };
        }
      },
      {
        id: 'focus_work',
        label: {
          vi: 'Lao vào công việc và phấn đấu đạt đỉnh cao tài chính',
          en: 'Double down on professional output and maximum income growth',
          ko: '일에 더욱 몰두하여 최고 소득을 달성한다'
        },
        sub: { vi: 'Tài sản +$3,500, Hạnh phúc -3', en: 'Wealth +$3,500, Happiness -3', ko: '소득 +$3,500' },
        apply: (state) => {
          state.stats.wealth += 3500;
          state.stats.happiness = Math.max(10, state.stats.happiness - 3);
          return {
            vi: 'Tài chính gia đình vững chãi hơn, dù đôi khi bạn cảm thấy thấm thía sự cô đơn.',
            en: 'Your career peaked financially, providing security even through moments of fatigue.',
            ko: '경제적으로는 가장 풍요로운 시기를 맞았지만, 가끔씩 밀려오는 외로움은 피할 수 없었습니다.'
          };
        }
      }
    ]
  },

  // Age 62: Retirement
  retire: {
    id: 'retire',
    age: 62,
    title: {
      vi: 'Sáu mươi hai tuổi: Ngưỡng cửa nghỉ hưu',
      en: 'Age 62: The Retirement Threshold',
      ko: '예순둘, 정년의 갈림길'
    },
    body: {
      vi: 'Bạn đã bước tới tuổi nghỉ hưu theo quy định của hầu hết các quốc gia. Bạn sẽ chọn gác lại công việc để an hưởng tuổi già hay tiếp tục gắn bó với công việc?',
      en: 'You reach the statutory retirement age recognized in most nations. Will you step back to enjoy tranquil leisure, or keep active in your calling?',
      ko: '대부분의 나라에서 은퇴를 맞이하는 나이. 일을 내려놓고 여유로운 노후를 누릴지, 사회 활동을 이어갈지 결정합니다.'
    },
    fact: {
      vi: 'Tuổi thọ tăng khiến thời gian sống sau nghỉ hưu kéo dài trung bình 20-25 năm (OECD). Duy trì giao tiếp xã hội sau nghỉ hưu giúp giảm 30% nguy cơ suy giảm nhận thức.',
      en: 'Rising life expectancy means retirement now spans 20-25 years on average (OECD). Remaining socially connected reduces cognitive decline risks by 30%.',
      ko: '은퇴 후 여생이 20년 이상으로 늘어난 시대, 규칙적인 사회 활동은 치매 위험을 30% 이상 낮춥니다.'
    },
    choices: [
      {
        id: 'enjoy_leisure',
        label: {
          vi: 'Nghỉ hưu thảnh thơi, chăm sóc hoa cỏ và vui vầy bên con cháu',
          en: 'Retire peacefully, tend your garden, and cherish your grandchildren',
          ko: '은퇴 후 텃밭을 가꾸고 손주들을 돌보며 여생을 즐긴다'
        },
        sub: { vi: 'Hạnh phúc +15, Sức khỏe +5', en: 'Happiness +15, Health +5', ko: '행복 +15, 건강 +5' },
        apply: (state) => {
          state.job = 'Nghỉ hưu an nhàn';
          state.stats.happiness += 15;
          state.stats.health += 5;
          return {
            vi: 'Bạn tận hưởng trọn vẹn những buổi sáng thanh bình không còn vội vã chuông báo thức.',
            en: 'You savored calm mornings without alarms, surrounded by the tender laughter of grandchildren.',
            ko: '평생의 노고를 내려놓고 평화로운 아침과 손주들의 재롱 속에 행복한 노후를 시작했습니다.'
          };
        }
      },
      {
        id: 'mentor_part',
        label: {
          vi: 'Làm cố vấn hoặc công việc bán thời gian để truyền đạt kinh nghiệm',
          en: 'Stay on as a senior mentor or part-time advisor',
          ko: '경험을 살려 자문역이나 시간제 일로 사회에 기여한다'
        },
        sub: { vi: 'Thu nhập +$1,500, Trí tuệ +5', en: 'Wealth +$1,500, Smarts +5', ko: '소득 +$1,500, 지식 +5' },
        apply: (state) => {
          state.stats.wealth += 1500;
          state.stats.smarts += 5;
          state.stats.social += 5;
          return {
            vi: 'Kho tàng kinh nghiệm của bạn được thế hệ trẻ trân trọng và lắng nghe.',
            en: 'Younger peers deeply valued your decades of wisdom and steady guidance.',
            ko: '풍부한 연륜과 지혜로 후배들의 존경을 받으며 보람찬 날들을 보냈습니다.'
          };
        }
      }
    ]
  },

  // Age 74: Golden Years Sanctuary
  oldhome: {
    id: 'oldhome',
    age: 74,
    title: {
      vi: 'Bảy mươi tư tuổi: Mái ấm hoàng hôn',
      en: 'Age 74: The Golden Years Sanctuary',
      ko: '일흔넷, 노년의 보금자리'
    },
    body: {
      vi: 'Bước vào độ tuổi xưa nay hiếm, những bước chân chậm lại. Bạn suy ngẫm về sự sắp xếp chu đáo nhất cho những năm tháng hoàng hôn của cuộc đời.',
      en: 'Into your seventies, physical agility gently recedes. You consider how best to arrange your daily living and care for the peaceful years ahead.',
      ko: '기력이 예전 같지 않은 나이. 노년의 남은 날들을 어디에서 누구와 함께 보낼지 생각합니다.'
    },
    fact: {
      vi: 'Tại các nước châu Á, hơn 60% người cao tuổi sống cùng hoặc gần con cháu; trong khi tại Bắc Âu, hệ thống chăm sóc cộng đồng và viện dưỡng lão giúp người già duy trì sự độc lập tự chủ (WHO).',
      en: 'Over 60% of elders in East Asia live with or near children, whereas comprehensive eldercare systems in Northern Europe enable independent communal living (WHO).',
      ko: '노년기 가족의 따뜻한 돌봄과 안정된 주거 환경은 삶의 만족도를 결정하는 핵심 요소입니다.'
    },
    choices: [
      {
        id: 'live_with_kids',
        label: {
          vi: 'Về sống chung dưới một mái nhà với con cháu',
          en: 'Move in with your adult children and grandchildren',
          ko: '자녀의 집으로 들어가 온 가족이 함께 산다'
        },
        sub: { vi: 'Hạnh phúc +16, Quan hệ +12', en: 'Happiness +16, Social +12', ko: '행복 +16, 유대 +12' },
        apply: (state) => {
          state.stats.happiness += 16;
          state.stats.social += 12;
          return {
            vi: 'Căn nhà ba thế hệ rộn ràng tiếng nói cười; bạn được con cháu chăm sóc từng bữa cơm, chén trà.',
            en: 'Living across generations brought daily cheer; your children tended your needs with devotion.',
            ko: '삼대가 한 지붕 아래 모여 살며 자녀들의 극진한 효도 속에 따뜻한 날들을 보냈습니다.'
          };
        }
      },
      {
        id: 'own_home_stay',
        label: {
          vi: 'Giữ nếp sống độc lập tại chính ngôi nhà quen thuộc bấy lâu',
          en: 'Remain in your longtime home with cherished independence',
          ko: '오랜 추억이 깃든 내 집에서 독립적으로 살아간다'
        },
        sub: { vi: 'Thanh thản, Hạnh phúc +8', en: 'Peace of mind, Happiness +8', ko: '자유로운 노후' },
        apply: (state) => {
          state.stats.happiness += 8;
          return {
            vi: 'Bạn duy trì lối sống thảnh thơi, tự do giữa những vật dụng và khu vườn quen thuộc.',
            en: 'You kept your tranquil daily routine in the sanctuary of your familiar neighborhood.',
            ko: '익숙한 동네와 오랜 이웃들 사이에서 나만의 편안한 일상을 유지했습니다.'
          };
        }
      }
    ]
  },

  // Age 19: Civic & Conscription Milestone
  service: {
    id: 'service',
    age: 19,
    title: {
      vi: 'Mười chín tuổi: Nghĩa vụ công dân',
      en: 'Age 19: National Service & Civic Duty',
      ko: '열아홉, 청춘의 부름'
    },
    body: {
      vi: 'Bước vào độ tuổi trưởng thành, giấy gọi thực hiện nghĩa vụ quân sự hoặc trách nhiệm công dân được gửi tới. Bạn sẽ lựa chọn đối diện ra sao?',
      en: 'Reaching young adulthood, the call to national military service or civil community contribution arrives. How do you choose to serve your society?',
      ko: '성인이 되어 국가와 사회를 향한 부름을 마주합니다. 청춘의 한 자락을 어떻게 채우시겠습니까?'
    },
    fact: {
      vi: 'Trên thế giới có khoảng 30 quốc gia duy trì chế độ nghĩa vụ quân sự bắt buộc (như Hàn Quốc, Israel, Singapore, Thụy Sĩ, Việt Nam...), với thời gian từ 12 đến 36 tháng.',
      en: 'About 30 nations worldwide enforce mandatory military service (such as South Korea, Israel, Singapore, Switzerland, Vietnam), spanning 12 to 36 months.',
      ko: '대한민국, 이스라엘, 싱가포르 등 약 30개국이 국가 안보를 위해 징병제를 유지하고 있습니다.'
    },
    choices: [
      {
        id: 'serve_proudly',
        label: {
          vi: 'Nhập ngũ rèn luyện kỷ luật thép trong quân ngũ',
          en: 'Enlist in military service to forge iron discipline',
          ko: '국방의 의무를 다하며 강인한 몸과 마음을 단련한다'
        },
        sub: { vi: 'Sức khỏe +10, Quan hệ đồng đội +8', en: 'Health +10, Comradeship +8', ko: '건강 +10, 전우애 +8' },
        apply: (state) => {
          state.stats.health += 10;
          state.stats.social += 8;
          state.flags.served = true;
          return {
            vi: 'Những tháng ngày quân ngũ tôi luyện bạn trở thành người kiên cường, gặt hái tình đồng chí keo sơn.',
            en: 'Rigorous military training forged resilience and lifelong bonds of brotherhood.',
            ko: '군 복무를 통해 강인한 체력과 평생을 함께할 끈끈한 전우들을 얻었습니다.'
          };
        }
      },
      {
        id: 'civil_service',
        label: {
          vi: 'Đăng ký công tác thiện nguyện / Phục vụ dân sự cộng đồng',
          en: 'Engage in community civil service and volunteer missions',
          ko: '사회복지 및 공공 지원 활동으로 사회에 기여한다'
        },
        sub: { vi: 'Trí tuệ +6, Xã hội +8', en: 'Smarts +6, Social +8', ko: '지식 +6, 사회성 +8' },
        apply: (state) => {
          state.stats.smarts += 6;
          state.stats.social += 8;
          return {
            vi: 'Bạn đóng góp sức mình tại các trung tâm hỗ trợ cộng đồng, thấu hiểu thêm muôn mặt đời sống.',
            en: 'Serving at community welfare centers gave you profound empathy for human struggles.',
            ko: '지역 사회의 소외된 이웃들을 돌보며 삶에 대한 깊은 시야와 배려를 배웠습니다.'
          };
        }
      }
    ]
  },

  // Age 22: First Career Launch
  jobhunt: {
    id: 'jobhunt',
    age: 22,
    title: {
      vi: 'Hai mươi hai tuổi: Bước vào đời',
      en: 'Age 22: Stepping into the World',
      ko: '스물둘, 사회로의 첫걸음'
    },
    body: {
      vi: 'Rời ghế nhà trường, bạn đứng trước ngã rẽ sự nghiệp. Thị trường lao động đầy cơ hội nhưng cũng nhiều cạnh tranh gay gắt.',
      en: 'Leaving formal education behind, you stand before life\'s occupational crossroads. Where will you invest your youthful drive?',
      ko: '배움의 울타리를 벗어나 본격적인 직업의 세계로 나아갑니다. 어떤 길로 첫 발을 떼시겠습니까?'
    },
    fact: {
      vi: 'Tỷ lệ thất nghiệp của thanh niên toàn cầu (15-24 tuổi) là khoảng 13%, cao gấp 3 lần so với người trưởng thành (ILO 2024). Tìm được hướng đi phù hợp là bước ngoặt quyết định.',
      en: 'Global youth unemployment (ages 15-24) sits around 13%, three times that of older adults (ILO 2024). Landing a career foothold is a pivotal milestone.',
      ko: '전 세계 청년 실업률은 약 13%에 달하며, 첫 직업 선택은 평생의 삶의 궤적에 큰 영향을 미칩니다.'
    },
    choices: [
      {
        id: 'office_career',
        label: {
          vi: 'Thi tuyển vào công ty / cơ quan hành chính làm việc chuyên môn',
          en: 'Pursue professional employment in corporate offices or civil service',
          ko: '기업 및 공공기관에 취업하여 전문 경력을 쌓는다'
        },
        sub: { vi: 'Thu nhập ổn định, Trí tuệ +6', en: 'Stable income, Smarts +6', ko: '안정적 소득, 지식 +6' },
        apply: (state) => {
          state.job = 'Chuyên viên văn phòng';
          state.jobId = 'clerk';
          state.stats.smarts += 6;
          state.stats.wealth += 200;
          return {
            vi: 'Bạn chính thức nhận việc tại văn phòng, hòa nhập vào nhịp sống công sở hối hả.',
            en: 'You secured an office role and adapted quickly to the energetic pace of professional life.',
            ko: '원하던 회사에 입사하여 성실한 직장인으로서의 첫 월급을 받았습니다.'
          };
        }
      },
      {
        id: 'skilled_craft',
        label: {
          vi: 'Theo đuổi nghề thủ công kỹ thuật / kỹ thuật viên lành nghề',
          en: 'Master a skilled technical trade or practical craftsmanship',
          ko: '전문 기술을 배워 현장 기술직의 길을 걷는다'
        },
        sub: { vi: 'Sức khỏe +6, Tài chính vững', en: 'Health +6, Solid trade earnings', ko: '건강 +6, 실속 소득' },
        apply: (state) => {
          state.job = 'Kỹ thuật viên lành nghề';
          state.jobId = 'mechanic';
          state.stats.health += 6;
          state.stats.wealth += 250;
          return {
            vi: 'Với đôi bàn tay thành thạo và sự chăm chỉ, tay nghề của bạn ngày càng được tín nhiệm.',
            en: 'Through tireless hands-on dedication, your craftsmanship won widespread trust.',
            ko: '숙련된 기술과 성실함으로 현장에서 두터운 신망을 얻으며 자리를 잡았습니다.'
          };
        }
      }
    ]
  },

  // Age 28: Migration Dilemma (Working Abroad vs Staying Near Family)
  migx: {
    id: 'migx',
    age: 28,
    title: {
      vi: 'Hai mươi tám tuổi: Ngã rẽ xuất ngoại',
      en: 'Age 28: The Migration Crossroads',
      ko: '스물여덟, 떠남과 머묾의 갈림길'
    },
    body: {
      vi: 'Một cơ hội làm việc tại nước ngoài với mức lương hấp dẫn mở ra. Đổi lại, bạn sẽ phải sống xa quê hương, cha mẹ và người thân nhiều năm.',
      en: 'A lucrative opportunity to work in a high-income nation arrives. It promises substantial savings, but demands leaving family and homeland behind.',
      ko: '해외에서 일할 기회가 찾아왔습니다. 더 큰 소득을 얻을 수 있지만, 가족과 고향을 떠나야 합니다.'
    },
    fact: {
      vi: 'Trên toàn thế giới có hơn 280 triệu người di cư quốc tế (UN DESA). Hàng năm, số tiền kiều hối gửi về các nước đang phát triển vượt qua 650 tỷ USD (World Bank).',
      en: 'Over 280 million people live as international migrants worldwide (UN DESA), sending over $650 billion in remittances to families annually (World Bank).',
      ko: '전 세계 2억 8천만 명이 해외 이주 노동자로 살아가며, 가족에게 보내는 송금은 많은 나라의 생계를 지탱합니다.'
    },
    choices: [
      {
        id: 'go_abroad',
        label: {
          vi: 'Quyết định ra nước ngoài làm việc để gửi tiền về giúp gia đình',
          en: 'Venture abroad to work and send remittances back to your family',
          ko: '더 넓은 기회와 가족의 미래를 위해 해외로 떠난다'
        },
        sub: { vi: 'Tài chính +1,500 USD, Trí tuệ +8, Hạnh phúc -4 (nhớ nhà)', en: 'Wealth +1500, Smarts +8, Homesick', ko: '소득 대폭 상승, 향수병' },
        apply: (state) => {
          state.stats.wealth += 1500;
          state.stats.smarts += 8;
          state.stats.happiness -= 4;
          state.flags.workedAbroad = true;
          return {
            vi: 'Vượt qua những ngày đầu bỡ ngỡ xứ người, bạn dành dụm gửi những khoản tiền quý giá về cho gia đình.',
            en: 'Overcoming early homesickness, you steadily sent life-changing savings back home.',
            ko: '낯선 이국땅에서 외로움을 견디며 땀 흘려 일해 고향 가족들에게 든든한 버팀목이 되었습니다.'
          };
        }
      },
      {
        id: 'stay_home',
        label: {
          vi: 'Ở lại quê hương để sớm tối kề cận bên cha mẹ và người thân',
          en: 'Stay home to remain close to aging parents and cherished roots',
          ko: '고향에 남아 부모님과 소중한 사람들의 곁을 지킨다'
        },
        sub: { vi: 'Hạnh phúc +10, Quan hệ gia đình +8', en: 'Happiness +10, Social +8', ko: '행복 +10, 가족 유대 +8' },
        apply: (state) => {
          state.stats.happiness += 10;
          state.stats.social += 8;
          return {
            vi: 'Mâm cơm gia đình mỗi tối đầy ắp tiếng cười; bạn cảm thấy an lòng khi ở cạnh người thân.',
            en: 'Warm dinners with family kept your spirit anchored and deeply comforted.',
            ko: '매일 저녁 가족들과 마주 앉아 밥을 먹는 소박한 일상 속에서 깊은 위안과 행복을 누렸습니다.'
          };
        }
      }
    ]
  },

  // Age 32: Entrepreneurship vs Employment Stability
  biz: {
    id: 'biz',
    age: 32,
    title: {
      vi: 'Ba mươi hai tuổi: Mộng lập nghiệp',
      en: 'Age 32: The Entrepreneurial Spark',
      ko: '서른둘, 내 사업의 꿈'
    },
    body: {
      vi: 'Tích lũy được kinh nghiệm và một khoản vốn nhỏ, bạn nung nấu ý định mở một tiệm kinh doanh riêng. Bạn chọn mạo hiểm hay giữ an toàn?',
      en: 'With a decade of hands-on experience and modest savings, the drive to launch your own venture calls. Do you take the leap or hold steady?',
      ko: '현장 경험과 모아둔 종잣돈을 바탕으로 나만의 가게나 사업체를 차릴 기회가 생겼습니다. 모험을 택하시겠습니까?'
    },
    fact: {
      vi: 'Hơn 90% doanh nghiệp trên thế giới là doanh nghiệp vừa và nhỏ (SME), đóng góp hơn 50% việc làm toàn cầu (World Bank).',
      en: 'Small and medium enterprises represent about 90% of all businesses and more than 50% of employment worldwide (World Bank).',
      ko: '자영업과 중소기업은 전 세계 일자리의 절반 이상을 만들어내는 경제의 든든한 뿌리입니다.'
    },
    choices: [
      {
        id: 'start_business',
        label: {
          vi: 'Mở cửa hàng kinh doanh riêng, tự làm chủ vận mệnh',
          en: 'Launch your independent business and become your own boss',
          ko: '과감하게 내 가게를 열고 사장으로서 도전한다'
        },
        sub: { vi: 'Thử thách lớn: Tài chính biến động, Trí tuệ +10', en: 'High reward/risk, Smarts +10', ko: '수익 잠재력, 지식 +10' },
        apply: (state) => {
          const success = chance(0.65);
          state.stats.smarts += 10;
          if (success) {
            state.job = 'Chủ doanh nghiệp nhỏ';
            state.jobId = 'owner';
            state.stats.wealth += 1200;
            state.stats.happiness += 8;
            return {
              vi: 'Nhờ nhạy bén và cần cù, cửa tiệm buôn may bán đắt, thu hút nhiều khách quen ủng hộ!',
              en: 'Through tireless grit, your shop flourished into a thriving neighborhood staple!',
              ko: '피나는 노력 끝에 입소문이 나며 가게가 번창하여 당당한 자영업 사장으로 우뚝 섰습니다!'
            };
          } else {
            state.stats.wealth = Math.max(0, state.stats.wealth - 300);
            return {
              vi: 'Kinh doanh gặp lúc khó khăn, nhưng bạn tích lũy được những bài học thương trường vô giá.',
              en: 'Market downturns tested your shop, but the ordeal taught you invaluable business grit.',
              ko: '경기 침체로 고전했지만, 위기를 극복하며 값진 사업 경험과 안목을 배웠습니다.'
            };
          }
        }
      },
      {
        id: 'keep_stable',
        label: {
          vi: 'Giữ công việc hiện tại, duy trì thu nhập đều đặn nuôi sống gia đình',
          en: 'Keep your steady job and protect your family\'s financial calm',
          ko: '모험 대신 안정적인 직장을 유지하며 가족을 지킨다'
        },
        sub: { vi: 'Hạnh phúc +6, Thu nhập an toàn', en: 'Happiness +6, Low stress', ko: '행복 +6, 안정적 삶' },
        apply: (state) => {
          state.stats.happiness += 6;
          state.stats.wealth += 400;
          return {
            vi: 'Lương thưởng đều đặn mang lại sự vững tâm cho bạn và gia đình nhỏ giữa những biến động thời cuộc.',
            en: 'Steady salary brought dependable security for you and your loved ones.',
            ko: '매달 들어오는 안정된 월급으로 가정을 꾸리며 마음 편한 평화를 지켰습니다.'
          };
        }
      }
    ]
  },

  // Age 38: Mid-career Health & Wellness Awakening
  lifestyle: {
    id: 'lifestyle',
    age: 38,
    title: {
      vi: 'Ba mươi tám tuổi: Tiếng chuông sức khỏe',
      en: 'Age 38: The Midlife Wellness Awakening',
      ko: '서른여덟, 몸이 보내는 신호'
    },
    body: {
      vi: 'Những cơn đau lưng mỏi gối xuất hiện sau những ngày làm việc quần quật. Cơ thể nhắc nhở bạn rằng tuổi trẻ không còn là tấm khiên bất khả xâm phạm.',
      en: 'Lingering fatigue and aches emerge after prolonged workweeks. Your body gently signals that youth is no longer an infinite reservoir.',
      ko: '과로와 스트레스 속에 피로가 쉽게 풀리지 않습니다. 건강을 챙겨야 할 때가 왔음을 직감합니다.'
    },
    fact: {
      vi: 'Các bệnh không lây nhiễm (tim mạch, ung thư, tiểu đường, hô hấp) chiếm tới 74% tổng số ca tử vong trên thế giới hàng năm (WHO). Thay đổi thói quen ở tuổi 30-40 có thể kéo dài thêm cả chục năm tuổi thọ.',
      en: 'Non-communicable diseases (cardiovascular, cancer, diabetes) account for 74% of all global deaths (WHO). Lifestyle changes in midlife add over a decade of vitality.',
      ko: '규칙적인 운동과 식습관 개선은 중년기 만성질환 위험을 절반 이하로 줄여줍니다 (WHO).'
    },
    choices: [
      {
        id: 'healthy_change',
        label: {
          vi: 'Quyết tâm ăn uống điều độ, tập thể dục mỗi ngày',
          en: 'Commit to wholesome nutrition and daily fitness training',
          ko: '운동을 시작하고 술과 야식을 줄이며 건강을 챙긴다'
        },
        sub: { vi: 'Sức khỏe +12, Hạnh phúc +6', en: 'Health +12, Vitality +6', ko: '건강 +12, 활력 회복' },
        apply: (state) => {
          state.stats.health = Math.min(100, state.stats.health + 12);
          state.stats.happiness += 6;
          return {
            vi: 'Cơ thể nhẹ nhõm, tinh thần sảng khoái; bạn cảm thấy dồi dào năng lượng như thuở đôi mươi.',
            en: 'Your body felt refreshed and light; newfound vitality fueled each morning with optimism.',
            ko: '몸이 몰라보게 가벼워지고 활력을 되찾아 하루하루를 활기차게 시작하게 되었습니다.'
          };
        }
      },
      {
        id: 'work_focus',
        label: {
          vi: 'Tạm gác lại, tiếp tục dốc toàn lực cho công việc kiếm tiền',
          en: 'Push through the aches and keep driving hard for financial gain',
          ko: '지금은 쉴 때가 아니다, 일에 모든 에너지를 쏟아붓는다'
        },
        sub: { vi: 'Thu nhập +500, Sức khỏe -6', en: 'Wealth +500, Health -6', ko: '수입 증가, 피로 누적' },
        apply: (state) => {
          state.stats.wealth += 500;
          state.stats.health = Math.max(10, state.stats.health - 6);
          return {
            vi: 'Thu nhập tăng thêm, nhưng đôi mắt bạn hằn sâu những đêm mất ngủ vì lo toan.',
            en: 'Earnings mounted, but weary sleepless nights began taking a noticeable toll on your body.',
            ko: '수입은 늘었지만 누적된 만성 피로로 건강에 적신호가 켜졌습니다.'
          };
        }
      }
    ]
  },

  // Age 48: Eldercare and Family Devotion
  eldercare: {
    id: 'eldercare',
    age: 48,
    title: {
      vi: 'Bốn mươi tám tuổi: Phụng dưỡng mẹ cha',
      en: 'Age 48: Honoring the Elders',
      ko: '마흔여덟, 부모님의 흰머리'
    },
    body: {
      vi: 'Cha mẹ ngày một già yếu, đau ốm triền miên cần người chăm sóc sớm tối. Giữa bộn bề gia đình riêng và công việc, bạn sẽ gánh vác chữ hiếu ra sao?',
      en: 'Aging parents face declining mobility and chronic ailments, needing daily devotion. Balancing your own household and career, how do you tend to them?',
      ko: '연로하신 부모님의 건강이 눈에 띄게 쇠약해지셨습니다. 곁에서 보살펴 드릴 손길이 절실합니다.'
    },
    fact: {
      vi: 'Thế hệ "kẹp bánh mì" (Sandwich Generation) ở độ tuổi 40-50 trên toàn cầu vừa phải nuôi dạy con cái, vừa phải chăm sóc cha mẹ già, đối mặt với gánh nặng kép về tài chính và cảm xúc (OECD).',
      en: 'The "Sandwich Generation" in their 40s-50s globally supports both maturing children and frail parents, shouldering double emotional and fiscal weight (OECD).',
      ko: '40~50대는 자녀 양육과 노부모 부양을 동시에 짊어지는 샌드위치 세대로서 큰 책임감을 마주합니다.'
    },
    choices: [
      {
        id: 'care_at_home',
        label: {
          vi: 'Đón cha mẹ về chăm sóc tận tay, kề cận sớm hôm',
          en: 'Welcome your parents into your home to personally care for them',
          ko: '부모님을 모셔와 정성껏 곁에서 수발을 든다'
        },
        sub: { vi: 'Hạnh phúc +14, Gắn kết gia đình +12', en: 'Happiness +14, Family Bond +12', ko: '효도, 깊은 가족애' },
        apply: (state) => {
          state.stats.happiness += 14;
          state.stats.social += 12;
          return {
            vi: 'Dù vất vả sớm khuya, nhìn nụ cười an tâm của đấng sinh thành, lòng bạn ngập tràn sự thanh thản.',
            en: 'Though physically wearying, seeing your parents\' peaceful smiles brought boundless solace.',
            ko: '고단한 수발 속에서도 부모님의 온화한 미소를 보며 자식으로서 도리를 다했다는 평안을 얻었습니다.'
          };
        }
      },
      {
        id: 'medical_aid',
        label: {
          vi: 'Thuê điều dưỡng viên chuyên nghiệp hỗ trợ y tế tại nhà',
          en: 'Hire professional in-home nursing and specialized medical care',
          ko: '전문 간병인과 의료 서비스를 지원해 드린다'
        },
        sub: { vi: 'Tài chính -400, Sức khỏe cha mẹ ổn định', en: 'Wealth -400, Professional care', ko: '비용 지출, 체계적 간병' },
        apply: (state) => {
          state.stats.wealth = Math.max(0, state.stats.wealth - 400);
          state.stats.social += 6;
          return {
            vi: 'Sự hỗ trợ y tế bài bản giúp cha mẹ bớt đau đớn và gia đình bạn vẫn duy trì được công việc.',
            en: 'Professional medical care alleviated their suffering while keeping your career afloat.',
            ko: '전문적인 돌봄 덕분에 부모님의 통증이 완화되고 가족 모두가 지치지 않고 일상을 이어갔습니다.'
          };
        }
      }
    ]
  },

  // Age 68: Community Legacy & Mentorship
  legacy: {
    id: 'legacy',
    age: 68,
    title: {
      vi: 'Sáu mươi tám tuổi: Cây cao bóng cả',
      en: 'Age 68: The Venerable Elder',
      ko: '예순여덟, 삶의 열매를 나누다'
    },
    body: {
      vi: 'Con cháu đã trưởng thành, bạn có nhiều thời gian rảnh rỗi hơn bao giờ hết. Bạn chọn sẻ chia vốn sống tích lũy cả đời cho xã hội hay an nhàn tận hưởng?',
      en: 'With children independent and retirement in full bloom, you possess a treasure trove of lived experience. How do you choose to spend these golden days?',
      ko: '자녀들도 장성하고 시간적 여유가 생긴 나이. 평생 쌓아온 지혜와 여유를 세상과 어떻게 나누시겠습니까?'
    },
    fact: {
      vi: 'Nghiên cứu từ Đại học Harvard chỉ ra rằng những người cao tuổi tích cực tham gia hoạt động xã hội hoặc hướng dẫn người trẻ có tuổi thọ cao hơn 20% và tỷ lệ sa sút trí tuệ thấp hơn đáng kể.',
      en: 'Harvard longevity studies show elders who actively mentor or volunteer live 20% longer with substantially lower cognitive decline.',
      ko: '노년기 적극적인 사회 봉사와 후배 멘토링은 치매 위험을 낮추고 삶의 만족도를 크게 높입니다.'
    },
    choices: [
      {
        id: 'mentor_youth',
        label: {
          vi: 'Tham gia hội người cao tuổi, truyền dạy kinh nghiệm và làm việc thiện',
          en: 'Mentor the young and volunteer in community neighborhood projects',
          ko: '지역 공동체에서 봉사하고 젊은 세대에게 지혜를 나눈다'
        },
        sub: { vi: 'Hạnh phúc +16, Xã hội +14', en: 'Happiness +16, Social +14', ko: '존경, 삶의 보람' },
        apply: (state) => {
          state.stats.happiness += 16;
          state.stats.social += 14;
          return {
            vi: 'Khu xóm quý mến sự đôn hậu của bạn; những lời khuyên chân thành của bạn thắp sáng đường đi cho lớp trẻ.',
            en: 'Neighbors cherished your kindness; your gentle counsel guided many struggling youths.',
            ko: '동네 이웃들의 깊은 존경 속에 청년들에게 길잡이가 되어 주며 보람찬 나날을 보냈습니다.'
          };
        }
      },
      {
        id: 'leisure_travel',
        label: {
          vi: 'Thảnh thơi chăm sóc vườn hoa, câu cá và đi du lịch an dưỡng',
          en: 'Enjoy serene leisure, tending lush garden flowers and scenic travels',
          ko: '텃밭을 가꾸고 여유롭게 여행을 다니며 평화로운 일상을 즐긴다'
        },
        sub: { vi: 'Thanh thản, Sức khỏe +8', en: 'Tranquility, Health +8', ko: '건강 +8, 여유로운 노후' },
        apply: (state) => {
          state.stats.health = Math.min(100, state.stats.health + 8);
          state.stats.happiness += 12;
          return {
            vi: 'Những luống hoa rực rỡ và những chuyến dạo chơi êm đềm mang lại sự thư thái tuyệt đối cho tâm hồn.',
            en: 'Fragrant flowerbeds and leisurely strolls bathed your spirit in tranquil joy.',
            ko: '화사하게 핀 꽃들을 가꾸고 한가로이 거닐며 한 점 후회 없는 평온한 나날을 보냈습니다.'
          };
        }
      }
    ]
  },

  // Age 80: Final Will & Peaceful Heritage
  will: {
    id: 'will',
    age: 80,
    title: {
      vi: 'Tám mươi tuổi: Di sản để lại',
      en: 'Age 80: The Lasting Heritage',
      ko: '여든, 아름다운 마무리'
    },
    body: {
      vi: 'Tròn tám mươi năm ngang qua thế gian, nhìn lại cả một kiếp nhân sinh với bao thăng trầm. Bạn muốn để lại di sản gì cho cuộc đời trước lúc xuôi tay?',
      en: 'Eighty years upon this Earth. Looking back upon a complete human existence of joy, tears, and resilience. What final gift do you leave behind?',
      ko: '여든 해의 길고 아름다운 여정을 돌아보며, 세상에 남길 마지막 뜻을 정리합니다.'
    },
    fact: {
      vi: 'Chỉ khoảng 1/3 số người sinh ra ở các nước đang phát triển sống đến tuổi 80. Bạn là một trong những người may mắn đã đi trọn vẹn một kiếp nhân sinh.',
      en: 'Only about a third of babies born in developing nations live to celebrate their 80th birthday. Reaching age 80 is humanity\'s grandest triumph.',
      ko: '인간의 삶에서 80세에 도달하는 것은 수많은 역경과 질병을 이겨낸 숭고한 결실입니다.'
    },
    choices: [
      {
        id: 'family_harmony',
        label: {
          vi: 'Căn dặn con cháu gìn giữ hòa khí, yêu thương đùm bọc nhau',
          en: 'Leave a testament of familial harmony, love, and unity for descendants',
          ko: '자손들에게 서로 우애하고 정직하게 살 것을 당부하며 화합을 남긴다'
        },
        sub: { vi: 'Hạnh phúc vẹn tròn +20', en: 'Complete Peace +20', ko: '평안한 안식 +20' },
        apply: (state) => {
          state.stats.happiness += 20;
          return {
            vi: 'Con cháu tề tựu quanh giường nắm chặt tay bạn trong sự kính trọng và biết ơn sâu sắc.',
            en: 'Surrounded by loving children and grandchildren, you felt total peace in your heart.',
            ko: '온 가족이 손을 맞잡고 눈물로 감사를 전하는 가운데, 더없이 충만한 마음으로 평안을 누렸습니다.'
          };
        }
      },
      {
        id: 'donate_cause',
        label: {
          vi: 'Dành một phần tích lũy gửi tặng quỹ khuyến học cho trẻ em nghèo',
          en: 'Endow a portion of savings to support scholarships for needy children',
          ko: '어려운 환경의 아이들을 위한 배움의 장학금으로 뜻을 전한다'
        },
        sub: { vi: 'Ý nghĩa cao cả, Hạnh phúc +22', en: 'Noble Legacy, Happiness +22', ko: '숭고한 유산 +22' },
        apply: (state) => {
          state.stats.happiness += 22;
          state.stats.social += 15;
          return {
            vi: 'Tên bạn được ghi danh trong lòng những em nhỏ được cắp sách tới trường, nối dài hy vọng cho đời sau.',
            en: 'Your name lived on in the bright eyes of schoolchildren whose futures you illuminated.',
            ko: '당신의 따뜻한 나눔 덕분에 배움의 기회를 얻은 아이들의 가슴속에 영원히 기억되었습니다.'
          };
        }
      }
    ]
  }
};


window.RelationDecisions = DECISIONS;
})();
