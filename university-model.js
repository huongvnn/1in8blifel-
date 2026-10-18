// university-model.js — trường đại học, ngành học, học phí ước tính, tuyển sinh và tốt nghiệp.
// Cần nạp trước: universities-data.js (do build-universities.mjs tạo, định nghĩa globalThis.UNIVERSITY_NAMES).
// QUAN TRỌNG: không có bộ dữ liệu toàn cầu nào cho học phí và ngành của từng trường. Ở đây:
//   - tên trường: dữ liệu thật (Hipo), có thể thiếu;
//   - ngành: suy ra từ tên trường (ví dụ "Medical University" → khối sức khỏe) theo nhóm ngành ISCED-F của UNESCO;
//   - học phí: ƯỚC TÍNH từ GDP/người PPP của quốc gia, loại trường công/tư và ngành — không phải học phí thật.
const UniversityModel = (() => {
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const fmt = n => Math.round(n).toLocaleString("en-US");
  const hash = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const data = () => globalThis.UNIVERSITY_NAMES || {};
  const viInstitutionNamePatterns = [
    [/^(\d+)(st|nd|rd|th)\s+Military Medical University$/i, "Đại học Y khoa Quân y thứ $1"],
    [/^National University of the\s+/i, "Đại học Quốc gia "],
    [/^National University of\s+/i, "Đại học Quốc gia "],
    [/^Universidad Nacional(?: Autónoma)? de\s+/i, "Đại học Quốc gia "],
    [/^Universidade Federal de\s+/i, "Đại học Liên bang "],
    [/^Universidad de\s+/i, "Đại học "],
    [/^Universidade de\s+/i, "Đại học "],
    [/^Université de\s+/i, "Đại học "],
    [/^Università degli Studi di\s+/i, "Đại học "],
    [/^Università di\s+/i, "Đại học "],
    [/^Universität\s+/i, "Đại học "],
    [/^Universitatea\s+/i, "Đại học "],
    [/^Universitas\s+/i, "Đại học "],
    [/^Hochschule\s+/i, "Trường đại học "],
    [/^École\s+/i, "Trường "],
    [/^Medical University of the\s+/i, "Đại học Y khoa "],
    [/^Medical University of\s+/i, "Đại học Y khoa "],
    [/^Technical University of the\s+/i, "Đại học Kỹ thuật "],
    [/^Technical University of\s+/i, "Đại học Kỹ thuật "],
    [/^Polytechnic University of the\s+/i, "Đại học Bách khoa "],
    [/^Polytechnic University of\s+/i, "Đại học Bách khoa "],
    [/^University of the\s+/i, "Đại học "],
    [/^University of\s+/i, "Đại học "],
    [/^(.+?)\s+State University$/i, "Đại học Bang $1"],
    [/^(.+?)\s+National University$/i, "Đại học Quốc gia $1"],
    [/^(.+?)\s+Medical University$/i, "Đại học Y khoa $1"],
    [/^(.+?)\s+Technical University$/i, "Đại học Kỹ thuật $1"],
    [/^(.+?)\s+Polytechnic University$/i, "Đại học Bách khoa $1"],
    [/^(.+?)\s+University$/i, "Đại học $1"],
    [/^(.+?)\s+Institute of Technology$/i, "Viện Công nghệ $1"],
    [/^Institute of Technology of the\s+/i, "Viện Công nghệ "],
    [/^Institute of Technology of\s+/i, "Viện Công nghệ "],
    [/^(.+?)\s+Institute$/i, "Viện $1"],
    [/^(.+?)\s+College$/i, "Trường Cao đẳng $1"]
  ];
  const viNameWordReplacements = [
    [/\bpolytechnic\b/gi, "Bách khoa"],
    [/\buniversidad\b/gi, "Đại học"],
    [/\buniversidade\b/gi, "Đại học"],
    [/\buniversité\b/gi, "Đại học"],
    [/\buniversità\b/gi, "Đại học"],
    [/\buniversität\b/gi, "Đại học"],
    [/\buniversitatea\b/gi, "Đại học"],
    [/\buniversitas\b/gi, "Đại học"],
    [/\bnacional\b/gi, "Quốc gia"],
    [/\bfederal\b/gi, "Liên bang"],
    [/\bmedical\b/gi, "Y khoa"],
    [/\bmedicine\b/gi, "Y học"],
    [/\bhealth\b/gi, "Sức khỏe"],
    [/\btechnology\b/gi, "Công nghệ"],
    [/\btechnical\b/gi, "Kỹ thuật"],
    [/\bengineering\b/gi, "Kỹ thuật"],
    [/\bsciences?\b/gi, "Khoa học"],
    [/\beducation\b/gi, "Giáo dục"],
    [/\bbusiness\b/gi, "Kinh doanh"],
    [/\blaw\b/gi, "Luật"],
    [/\bagriculture\b/gi, "Nông nghiệp"],
    [/\binternational\b/gi, "Quốc tế"],
    [/\bfederal\b/gi, "Liên bang"],
    [/\broyal\b/gi, "Hoàng gia"],
    [/\bmilitary\b/gi, "Quân sự"],
    [/\bopen\b/gi, "Mở"],
    [/\bfree\b/gi, "Tự do"],
    [/\bcentral\b/gi, "Trung ương"],
    [/\bnational\b/gi, "Quốc gia"],
    [/\bstate\b/gi, "Bang"],
    [/\binstitute\b/gi, "Viện"],
    [/\buniversity\b/gi, "Đại học"],
    [/\bcollege\b/gi, "Cao đẳng"],
    [/\bschool\b/gi, "Trường"],
    [/\bof\b/gi, ""],
    [/\bthe\b/gi, ""],
    [/\band\b/gi, "và"]
  ];

  function translateName(name, language = "vi") {
    const original = typeof name === "string" ? name.trim() : "";
    if (!original || language === "en") return original;
    for (const [pattern, replacement] of viInstitutionNamePatterns) {
      if (pattern.test(original)) return original.replace(pattern, replacement).replace(/\s+/g, " ").trim();
    }
    let translated = original;
    for (const [pattern, replacement] of viNameWordReplacements) {
      translated = translated.replace(pattern, replacement);
    }
    return translated.replace(/\s+/g, " ").trim();
  }

  // Ngành học, gom theo nhóm lĩnh vực rộng ISCED-F 2013. costMul: hệ số học phí; incomeMul: hệ số thu nhập sau tốt nghiệp;
  // intel: độ khó (0–100); years: số năm học. Các hệ số là giả định để chơi, không phải thống kê.
  const M = (id, field, vi, en, costMul, incomeMul, intel, years, jobVi, jobEn) => ({ id, field, vi, en, costMul, incomeMul, intel, years, jobVi, jobEn });
  const MAJORS = [
    M("teaching", "Giáo dục", "Sư phạm", "Teacher education", 0.85, 0.85, 45, 4, "Giáo viên", "Teacher"),
    M("arts", "Nghệ thuật và nhân văn", "Nghệ thuật và thiết kế", "Arts and design", 0.95, 0.9, 40, 4, "Nghệ sĩ/nhà thiết kế", "Artist/designer"),
    M("language_lit", "Nghệ thuật và nhân văn", "Ngôn ngữ và văn học", "Languages and literature", 0.9, 0.85, 50, 4, "Biên dịch/biên tập viên", "Translator/editor"),
    M("history_phil", "Nghệ thuật và nhân văn", "Lịch sử và triết học", "History and philosophy", 0.9, 0.85, 55, 4, "Nghiên cứu viên nhân văn", "Humanities researcher"),
    M("psychology", "Khoa học xã hội, báo chí", "Tâm lý học", "Psychology", 1, 0.95, 55, 4, "Chuyên viên tâm lý", "Psychology specialist"),
    M("media", "Khoa học xã hội, báo chí", "Truyền thông và báo chí", "Media and journalism", 1, 0.95, 45, 4, "Nhà báo/chuyên viên truyền thông", "Journalist/communications specialist"),
    M("politics", "Khoa học xã hội, báo chí", "Xã hội học và chính trị", "Sociology and politics", 0.95, 0.9, 55, 4, "Chuyên viên chính sách", "Policy analyst"),
    M("business", "Kinh doanh, quản trị, luật", "Quản trị kinh doanh", "Business administration", 1.1, 1.1, 50, 4, "Chuyên viên kinh doanh", "Business professional"),
    M("econ_fin", "Kinh doanh, quản trị, luật", "Kinh tế và tài chính", "Economics and finance", 1.15, 1.25, 60, 4, "Chuyên viên tài chính", "Finance professional"),
    M("accounting", "Kinh doanh, quản trị, luật", "Kế toán và kiểm toán", "Accounting and auditing", 1.05, 1.1, 50, 4, "Kế toán/kiểm toán viên", "Accountant/auditor"),
    M("law", "Kinh doanh, quản trị, luật", "Luật", "Law", 1.2, 1.3, 60, 4, "Chuyên viên pháp lý", "Legal professional"),
    M("math_stat", "Khoa học tự nhiên, toán, thống kê", "Toán và thống kê", "Mathematics and statistics", 1.05, 1.2, 70, 4, "Nhà phân tích dữ liệu", "Data analyst"),
    M("phys_chem", "Khoa học tự nhiên, toán, thống kê", "Vật lý và hóa học", "Physics and chemistry", 1.1, 1.1, 68, 4, "Nhà khoa học", "Scientist"),
    M("biology", "Khoa học tự nhiên, toán, thống kê", "Sinh học và môi trường", "Biology and environment", 1.05, 1, 60, 4, "Nhà khoa học sinh học/môi trường", "Biology/environment scientist"),
    M("cs", "Công nghệ thông tin và truyền thông", "Khoa học máy tính", "Computer science", 1.15, 1.45, 65, 4, "Kỹ sư phần mềm", "Software engineer"),
    M("is", "Công nghệ thông tin và truyền thông", "Hệ thống thông tin", "Information systems", 1.1, 1.25, 55, 4, "Chuyên viên hệ thống thông tin", "Information systems specialist"),
    M("mech_elec", "Kỹ thuật, sản xuất, xây dựng", "Kỹ thuật cơ khí và điện", "Mechanical and electrical engineering", 1.2, 1.3, 62, 4, "Kỹ sư", "Engineer"),
    M("civil_arch", "Kỹ thuật, sản xuất, xây dựng", "Xây dựng và kiến trúc", "Civil engineering and architecture", 1.15, 1.2, 58, 4, "Kỹ sư xây dựng/kiến trúc sư", "Civil engineer/architect"),
    M("chem_mat", "Kỹ thuật, sản xuất, xây dựng", "Kỹ thuật hóa học và vật liệu", "Chemical and materials engineering", 1.2, 1.25, 62, 4, "Kỹ sư hóa học/vật liệu", "Chemical/materials engineer"),
    M("agri", "Nông, lâm, ngư nghiệp, thú y", "Nông, lâm, ngư nghiệp", "Agriculture, forestry and fisheries", 0.95, 0.9, 48, 4, "Kỹ sư nông nghiệp", "Agricultural specialist"),
    M("vet", "Nông, lâm, ngư nghiệp, thú y", "Thú y", "Veterinary medicine", 1.4, 1.15, 62, 5, "Bác sĩ thú y", "Veterinarian"),
    M("medicine", "Sức khỏe và phúc lợi", "Y khoa", "Medicine", 1.8, 1.9, 80, 6, "Bác sĩ", "Physician"),
    M("nursing", "Sức khỏe và phúc lợi", "Điều dưỡng", "Nursing", 1.1, 1, 52, 4, "Điều dưỡng viên", "Nurse"),
    M("pharmacy", "Sức khỏe và phúc lợi", "Dược học", "Pharmacy", 1.4, 1.3, 68, 5, "Dược sĩ", "Pharmacist"),
    M("dentistry", "Sức khỏe và phúc lợi", "Nha khoa", "Dentistry", 1.8, 1.8, 78, 6, "Nha sĩ", "Dentist"),
    M("tourism", "Dịch vụ", "Du lịch và khách sạn", "Tourism and hospitality", 1, 0.9, 42, 4, "Quản lý dịch vụ du lịch", "Hospitality manager"),
    M("sports", "Dịch vụ", "Thể dục thể thao", "Sports and physical education", 0.95, 0.9, 40, 4, "Huấn luyện viên", "Coach")
  ];
  const byId = Object.fromEntries(MAJORS.map(m => [m.id, m]));

  // Tên trường → nhóm ngành đặc thù (khớp từ khóa đa ngôn ngữ cơ bản). Không khớp → trường tổng hợp.
  const RULES = [
    [/medic|medical|health|nurs|pharm|dental|salud|sant[eé]|sa[uú]de|sağlık|tıp\b|clinic|hospital/i, ["medicine", "nursing", "pharmacy", "dentistry", "biology"]],
    [/agri|forest|veterin|ziraat|agrar|fisher|rural/i, ["agri", "vet", "biology", "chem_mat"]],
    [/\b(law|juridic\w*|jurid\w*|droit|derecho|direito|rechts\w*)\b/i, ["law", "politics", "econ_fin"]],
    [/\b(business|economics?|commerce|management|finance|administration|empresa\w*|negocio\w*|gest[aã]o|gestion)\b/i, ["business", "econ_fin", "accounting", "is", "tourism"]],
    [/educat|pedagog|teacher|teaching|normal university/i, ["teaching", "language_lit", "psychology", "sports"]],
    [/\b(arts?|music\w*|conservator\w*|design|drama|theatre|theater|film)\b/i, ["arts", "language_lit", "media", "history_phil"]],
    [/theolog|seminar|divinity|islamic|bible|religio|catholic|yeshiva|kilise/i, ["history_phil", "language_lit", "psychology", "politics"]],
    [/\b(sport\w*|physical (education|culture)|olympic)\b/i, ["sports", "nursing", "psychology"]],
    [/polytech|technic|technolog|engineering|ingenier|mühendis|teknik|politécnic|politecnic|institute of tech/i, ["mech_elec", "civil_arch", "chem_mat", "cs", "is", "math_stat", "phys_chem"]],
    [/maritime|naval|marine|aviation|air force|military/i, ["mech_elec", "civil_arch", "cs", "tourism"]]
  ];
  const GENERAL = ["teaching", "arts", "language_lit", "history_phil", "psychology", "media", "politics", "business", "econ_fin",
    "accounting", "law", "math_stat", "phys_chem", "biology", "cs", "is", "mech_elec", "civil_arch", "agri", "nursing", "tourism", "sports"];

  // Học phí: tỷ lệ so với GDP/người PPP. Giá trị mặc định + vài quốc gia có mô hình học phí khác hẳn; tất cả là giả định gần đúng.
  const RATIOS = { USA: { public: 0.14, private: 0.52 }, GBR: { public: 0.22, private: 0.3 }, AUS: { public: 0.13, private: 0.3 },
    CAN: { public: 0.09, private: 0.2 }, JPN: { public: 0.08, private: 0.16 }, KOR: { public: 0.08, private: 0.14 } };
  const FREE_PUBLIC = new Set(["DEU", "NOR", "FIN", "SWE", "DNK", "ISL", "CZE", "GRC", "BRA", "ARG", "URY", "CUB", "SVN", "POL", "EST"]);
  const PRIVATE_HEAVY = new Set(["JPN", "KOR", "BRA", "CHL", "PHL", "IDN", "IND", "USA"]);
  const PRIVATE_NAME = /\b(private|privada|particular|özel|vakıf|vakif|priv[eé]e?|privat|christian|adventist|cat[oó]lica?|catholic)\b/i;

  function describeUniversity(name, iso3) {
    const r = rng(hash(`${iso3}:${name}`));
    const roll = r();
    const tier = roll < 0.1 ? 1 : roll < 0.35 ? 2 : roll < 0.8 ? 3 : 4; // 1 = rất chọn lọc … 4 = tuyển sinh rộng
    const privateShare = FREE_PUBLIC.has(iso3) ? 0.04 : PRIVATE_HEAVY.has(iso3) ? 0.6 : 0.2;
    const kind = PRIVATE_NAME.test(name) ? "private" : r() < privateShare ? "private" : "public";
    const rule = RULES.find(([re]) => re.test(name));
    let majors;
    if (rule) majors = [...rule[1]];
    else {
      const pool = [...GENERAL].sort(() => r() - 0.5);
      majors = pool.slice(0, 8 + Math.floor(r() * 7));
      if (r() < 0.4) majors.push("medicine", "pharmacy");
    }
    return { name, tier, kind, majors: [...new Set(majors)] };
  }

  function tuitionFor(country, uni, major) {
    const ratios = RATIOS[country.iso] || { public: 0.06, private: 0.2 };
    let ratio = uni.kind === "private" ? ratios.private : ratios.public;
    if (uni.kind === "public" && FREE_PUBLIC.has(country.iso)) ratio = 0.004; // chỉ còn phí hành chính
    const tierMul = [0, 1.4, 1.15, 1, 0.9][uni.tier];
    return Math.round(clamp(country.gdp * ratio * major.costMul * tierMul, 0, 60000) / 10) * 10;
  }

  function admissionChance(state, uni, major) {
    const base = [0, 0.18, 0.38, 0.62, 0.85][uni.tier];
    const p = base + (state.stats.intelligence - 50) * 0.004 + (state.stats.knowledge - 30) * 0.003 +
      ((state.profile.learningPotential || 50) - 50) * 0.002 - (major.intel - 50) * 0.002;
    return clamp(p, 0.05, 0.95);
  }

  function describe(uni, major, annual, years, chance, lang) {
    const money = annual === 0 ? (lang === "en" ? "no tuition" : "miễn học phí")
      : `≈ US$${fmt(annual)} PPP/${lang === "en" ? "year" : "năm"}`;
    return lang === "en"
      ? `Estimated tuition ${money} · ${years} years · admission chance ≈ ${Math.round(chance * 100)}%`
      : `Học phí ước tính ${money} · ${years} năm · cơ hội trúng tuyển ≈ ${Math.round(chance * 100)}%`;
  }

  // Tạo 3 lựa chọn nộp hồ sơ (mơ ước / vừa sức / an toàn) từ trường thật của quốc gia sinh sống.
  function applicationOptions(state, host) {
    const country = host.country(state);
    const names = data()[host.alpha2(country.iso)] || [];
    const r = Math.random;
    const pool = names.length ? Array.from({ length: Math.min(12, names.length) }, () => names[Math.floor(r() * names.length)]) : [];
    let unis = [...new Set(pool)].map(n => describeUniversity(n, country.iso));
    if (!unis.length) {
      unis = [1, 3, 4].map(tier => ({ ...describeUniversity(`Trường đại học ${country.cities[0]} ${tier}`, country.iso), tier, synthetic: true,
        majors: GENERAL.slice(0, 12) }));
    }
    const picked = [];
    for (const tier of [1, 2, 3, 4]) {
      const u = unis.find(x => x.tier === tier && !picked.includes(x));
      if (u && picked.length < 3) picked.push(u);
    }
    for (const u of unis) if (picked.length < 3 && !picked.includes(u)) picked.push(u);
    return picked.slice(0, 3).map(uni => {
      const fit = uni.majors.map(id => byId[id]).filter(m => m.intel <= state.stats.intelligence + 20);
      const options = fit.length ? fit : uni.majors.map(id => byId[id]);
      const major = options[Math.floor(r() * options.length)];
      const annual = tuitionFor(country, uni, major);
      const chance = admissionChance(state, uni, major);
      return {
        vi: `${uni.name} · ${major.vi}`, en: `${uni.name} · ${major.en}`, text: `${uni.name} · ${major.vi}`,
        effects: { knowledge: 1 }, special: "uni_apply",
        risk: { base: chance, stats: {} },
        uni: { name: uni.name, tier: uni.tier, kind: uni.kind, majorId: major.id, tuition: annual, years: major.years, scholarship: 0 },
        detailVi: describe(uni, major, annual, major.years, chance, "vi"),
        detailEn: describe(uni, major, annual, major.years, chance, "en")
      };
    });
  }

  function applyWealth(s, fraction) {
    const amount = Math.round(s.profile.gdp * fraction);
    s.debt ||= 0; s.wealth ||= 0;
    if (amount >= 0) { const repay = Math.min(s.debt, amount); s.debt -= repay; s.wealth += amount - repay; }
    else { const spend = -amount, paid = Math.min(s.wealth, spend); s.wealth -= paid; s.debt += spend - paid; }
  }

  // Gọi trong resolveChoice cho mọi lựa chọn; trả về ghi chú {vi,en} hoặc null.
  function applyChoice(s, choice, host) {
    if (choice.special !== "uni_apply") return null;
    if (Math.random() >= choice.risk.base) {
      host.changeStats({ happiness: -1 });
      return { vi: `Hồ sơ vào ${choice.uni.name} lần này chưa được nhận; bạn có thể thử lại sau.`, en: `Your application to ${choice.uni.name} is not accepted this time; you can try again later.` };
    }
    const merit = clamp(0.1 + (s.stats.intelligence - 50) * 0.004 + (s.stats.knowledge - 30) * 0.003, 0.02, 0.4);
    const scholarship = Math.random() < merit ? pickFrom([0.25, 0.5, 1]) : 0;
    s.education = "Đang học đại học";
    s.universityStartedAge = s.age;
    s.university = { ...choice.uni, scholarship };
    const major = byId[choice.uni.majorId];
    return {
      vi: `Bạn được nhận vào ${choice.uni.name}, ngành ${major.vi}${scholarship ? `, kèm học bổng ${Math.round(scholarship * 100)}% học phí` : ""}.`,
      en: `You are admitted to ${choice.uni.name}, studying ${major.en}${scholarship ? `, with a ${Math.round(scholarship * 100)}% tuition scholarship` : ""}.`
    };
  }
  const pickFrom = list => list[Math.floor(Math.random() * list.length)];

  // Gọi mỗi năm khi đang học đại học (trong completeYear): trừ học phí, tăng kiến thức.
  function yearTick(s, host) {
    if (s.education !== "Đang học đại học" || !s.university) return null;
    const u = s.university;
    const cost = u.tuition * (1 - (u.scholarship || 0));
    if (cost > 0) applyWealth(s, -cost / s.profile.gdp);
    host.changeStats({ knowledge: 2, intelligence: 1 });
    return null;
  }

  function years(s) { return s.university?.years || 4; }
  function onGraduate(s) {
    const u = s.university;
    if (!u) return null;
    s.degree = { majorId: u.majorId, uniName: u.name, tier: u.tier };
    const m = byId[u.majorId];
    return { vi: `Bạn tốt nghiệp ngành ${m.vi} tại ${u.name}.`, en: `You graduate in ${m.en} from ${u.name}.` };
  }
  function incomeFactor(s) {
    if (!s.degree) return 1;
    return byId[s.degree.majorId].incomeMul * [0, 1.15, 1.07, 1, 0.95][s.degree.tier];
  }
  function jobTitle(s) {
    const m = byId[s.degree.majorId];
    return { vi: m.jobVi, en: m.jobEn };
  }

  // Thêm bản dịch tiếng Anh (tên ngành, nghề) vào bảng englishText của game.
  function registerEnglish(map) {
    for (const m of MAJORS) { map[m.vi] = m.en; map[m.jobVi] = m.jobEn; }
  }

  function dataStatus() {
    const d = data();
    return { countries: Object.keys(d).length, universities: Object.values(d).reduce((a, l) => a + l.length, 0) };
  }

  return { applicationOptions, applyChoice, yearTick, years, onGraduate, incomeFactor, jobTitle, registerEnglish, dataStatus,
    tuitionFor, admissionChance, describeUniversity, translateName, MAJORS };
})();
if (typeof module !== "undefined") module.exports = UniversityModel;
