// ===== Data sesi: Induksi word cloud + 5 soalan poll (10 Tabiat Guru Cemerlang) =====
const SLIDES = [
  {
    id: "wc",
    type: "wordcloud",
    heading: "Apa perasaan anda pada hari ini?",
    sub: "Masukkan 3 perkataan yang melambangkan perasaan anda sekarang."
  },
  {
    id: "p1",
    type: "poll",
    heading: "Dalam amalan pengajaran Matematik anda, tabiat manakah paling mencabar untuk diamalkan secara konsisten?",
    options: [
      "Bersedia rapi sebelum setiap kelas",
      "Memberi perhatian individu kepada setiap pelajar",
      "Mendengar lebih daripada bercakap",
      "Terus belajar kaedah pengajaran baharu",
      "Menjadi teladan secara konsisten"
    ]
  },
  {
    id: "p2",
    type: "poll",
    heading: "Tabiat manakah paling mudah terabai apabila jadual pengajaran semakin padat?",
    options: [
      "Persediaan mendalam sebelum kelas",
      "Maklum balas membina kepada pelajar",
      "Mengaitkan pelajaran dengan kehidupan sebenar",
      "Refleksi dan penambahbaikan kendiri",
      "Membina hubungan dengan pelajar"
    ]
  },
  {
    id: "wc2",
    type: "wordcloud",
    heading: "Apakah yang menjadikan seorang guru itu hebat?",
    sub: "Masukkan 3 perkataan yang menggambarkan ciri guru hebat."
  },
  {
    id: "p3",
    type: "poll",
    heading: "Apabila pelajar sukar memahami konsep Matematik, amalan manakah paling kerap anda gunakan?",
    options: [
      "Guna analogi dan contoh kehidupan sebenar",
      "Tunjuk cara / demonstrasi",
      "Ulang dan permudahkan penerangan",
      "Galakkan pelajar bertanya dan berbincang",
      "Guna alat bantu visual atau teknologi"
    ]
  },
  {
    id: "p4",
    type: "poll",
    heading: "Apakah pendekatan yang paling anda utamakan untuk membina disiplin dan hubungan baik dengan pelajar?",
    options: [
      "Jangkaan jelas dan konsisten",
      "Hormat dan maruah pelajar diutamakan",
      "Ganjaran dan pengiktirafan positif",
      "Bincang punca tingkah laku",
      "Ketegasan dengan kasih sayang"
    ]
  },
  {
    id: "p5",
    type: "poll",
    heading: "Selain keputusan peperiksaan, aspek manakah paling anda ingin bantu pelajar kembangkan?",
    options: [
      "Pemikiran kritis dan saintifik",
      "Keyakinan diri",
      "Rasa ingin tahu dan minat meneroka",
      "Kemahiran menyelesaikan masalah",
      "Nilai dan karakter (integriti, tekun)"
    ]
  }
];

function slideIndexById(id) {
  const i = SLIDES.findIndex(s => s.id === id);
  return i === -1 ? 0 : i;
}

// ===== Firebase init (guna firebase-config.js) =====
let db = null;
function initFirebase() {
  if (typeof firebaseConfig === "undefined") return null;
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  return db;
}

const ROOT = "libatUrus";

function metaRef() { return db.ref(`${ROOT}/meta`); }
function wcRef(id) { return db.ref(`${ROOT}/wc/${id}/entries`); }
function pollRef(id) { return db.ref(`${ROOT}/polls/${id}/votes`); }

// Sequential blue ramp for word-cloud weighting (light + dark aware via CSS vars isn't trivial inline, so pick readable steps)
const WORD_RAMP_LIGHT = ["#9ec5f4", "#6da7ec", "#3987e5", "#1c5cab", "#104281"];
const WORD_RAMP_DARK  = ["#2a4a72", "#3987e5", "#5b9ae8", "#86b6ef", "#cde2fb"];

function isDark() {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "dark") return true;
  if (explicit === "light") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function renderWordCloud(container, entries) {
  const freq = {};
  Object.values(entries || {}).forEach(e => {
    (e.words || []).forEach(w => {
      const clean = String(w).trim().toLowerCase();
      if (!clean) return;
      freq[clean] = (freq[clean] || 0) + 1;
    });
  });
  const words = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  if (!words.length) {
    container.innerHTML = '<div class="empty-state">Menunggu respons pertama…</div>';
    return;
  }
  const maxCount = words[0][1];
  const ramp = isDark() ? WORD_RAMP_DARK : WORD_RAMP_LIGHT;
  container.innerHTML = words.map(([word, count]) => {
    const ratio = count / maxCount;
    const size = 16 + ratio * 40;
    const step = Math.min(ramp.length - 1, Math.floor(ratio * ramp.length));
    const color = ramp[ramp.length - 1 - step];
    return `<span class="word" style="font-size:${size}px;color:${color}" title="${count}x">${escapeHtml(word)}</span>`;
  }).join(" ");
}

function renderPollResults(container, options, votes) {
  const counts = new Array(options.length).fill(0);
  Object.values(votes || {}).forEach(v => {
    if (typeof v.choice === "number" && counts[v.choice] !== undefined) counts[v.choice]++;
  });
  const total = counts.reduce((a, b) => a + b, 0);
  const seriesVars = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)", "var(--series-5)"];
  container.innerHTML = options.map((opt, i) => {
    const pct = total ? Math.round((counts[i] / total) * 100) : 0;
    return `
      <div class="bar-row">
        <div class="bar-label">${escapeHtml(opt)}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${pct}%;background:${seriesVars[i % seriesVars.length]}">${pct > 8 ? pct + "%" : ""}</div>
        </div>
        <div class="bar-count mono">${counts[i]}</div>
      </div>`;
  }).join("") + `<p class="mono" style="margin-top:4px;font-size:13px;">Jumlah respons: ${total}</p>`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
