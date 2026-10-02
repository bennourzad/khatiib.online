/**
 * منصة «خَطِيب» — دراسة تجربة المستخدم الشاملة
 * Interaction Controller & Jury Presentation Engine
 * Features: Daylight Mode (Default), Floating Sidebar Navigation, Chart.js Visualizer
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initScrollProgress();
  initCounters();
  initWizard();
  initActiveNav();
  initPresentationDeck();
});

/* ==========================================================================
   1. THEME CONTROLLER (Daylight Mode Default & Emerald Dark Mode)
   ========================================================================== */
let currentTheme = 'light';

function initTheme() {
  const savedTheme = localStorage.getItem('khatiib_theme') || 'light'; // Light is active first!
  applyTheme(savedTheme, false);

  const btnTheme = document.getElementById('btnThemeToggle');
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme, true);
    });
  }
}

function applyTheme(theme, reRenderCharts = true) {
  currentTheme = theme;
  localStorage.setItem('khatiib_theme', theme);

  if (theme === 'dark') {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
  } else {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
  }

  // Update theme button icons & tooltip
  const sunIcons = document.querySelectorAll('.theme-sun');
  const moonIcons = document.querySelectorAll('.theme-moon');
  const labelText = document.getElementById('themeLabelText');
  const btnTheme = document.getElementById('btnThemeToggle');
  const btnDeckTheme = document.getElementById('btnDeckThemeToggle');

  if (theme === 'dark') {
    sunIcons.forEach(icon => icon.classList.add('hidden'));
    moonIcons.forEach(icon => icon.classList.remove('hidden'));
    if (labelText) labelText.textContent = 'الوضع الليلي';
    if (btnTheme) btnTheme.setAttribute('title', 'التبديل إلى الوضع النهاري');
    if (btnDeckTheme) btnDeckTheme.setAttribute('title', 'التبديل إلى الوضع النهاري');
  } else {
    sunIcons.forEach(icon => icon.classList.remove('hidden'));
    moonIcons.forEach(icon => icon.classList.add('hidden'));
    if (labelText) labelText.textContent = 'الوضع النهاري';
    if (btnTheme) btnTheme.setAttribute('title', 'التبديل إلى الوضع الليلي');
    if (btnDeckTheme) btnDeckTheme.setAttribute('title', 'التبديل إلى الوضع الليلي');
  }

  // Refresh Charts with matching palette
  if (reRenderCharts) {
    renderCharts(theme);
  } else {
    initCharts(theme);
  }
}

/* ==========================================================================
   2. FLOATING SIDEBAR NAVIGATION CONTROLLER
   ========================================================================== */
function initSidebar() {
  const sidebar = document.getElementById('floatingSidebar');
  const btnCollapse = document.getElementById('btnToggleSidebarCollapse');
  const btnMobileToggle = document.getElementById('btnMobileSidebarToggle');
  const backdrop = document.getElementById('sidebarBackdrop');
  const navItems = document.querySelectorAll('.sidebar-nav-links .nav-item');

  // Collapse / Expand Toggle on Desktop
  if (btnCollapse && sidebar) {
    const isCollapsed = localStorage.getItem('khatiib_sidebar_collapsed') === 'true';
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
      document.body.classList.add('sidebar-collapsed');
    }

    btnCollapse.addEventListener('click', () => {
      const collapsed = sidebar.classList.toggle('collapsed');
      document.body.classList.toggle('sidebar-collapsed', collapsed);
      localStorage.setItem('khatiib_sidebar_collapsed', collapsed);
    });
  }

  // Mobile Drawer Toggle
  if (btnMobileToggle && sidebar && backdrop) {
    btnMobileToggle.addEventListener('click', () => {
      sidebar.classList.add('mobile-open');
      backdrop.classList.remove('hidden');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.add('hidden');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 1199) {
          sidebar.classList.remove('mobile-open');
          backdrop.classList.add('hidden');
        }
      });
    });
  }
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR & READING METRIC
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  const sidebarBar = document.getElementById('sidebarProgressBar');
  const sidebarPercent = document.getElementById('sidebarProgressPercent');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = Math.min(100, Math.max(0, Math.round((winScroll / height) * 100)));

    if (progressBar) progressBar.style.width = scrolled + '%';
    if (sidebarBar) sidebarBar.style.width = scrolled + '%';
    if (sidebarPercent) sidebarPercent.textContent = scrolled + '%';
  }, { passive: true });
}

/* ==========================================================================
   4. KPI COUNTERS ANIMATION
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1200;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounters();
      }
    });
  }, { threshold: 0.25 });

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    observer.observe(heroSection);
  } else {
    runCounters();
  }
}

/* ==========================================================================
   5. DATA VISUALIZATION (CHART.JS) WITH DAY/NIGHT SUPPORT
   ========================================================================== */
let expChartInstance = null;
let timeChartInstance = null;

function initCharts(theme = currentTheme) {
  renderCharts(theme);
}

function renderCharts(theme) {
  if (typeof Chart === 'undefined') {
    renderSvgChartFallbacks();
    return;
  }

  const isDark = theme === 'dark';
  const textColor = isDark ? '#cbd5e1' : '#0c201a';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 32, 26, 0.08)';
  const sliceBorderColor = isDark ? '#06231e' : '#ffffff';

  Chart.defaults.font.family = "'thmanyahseriftext', sans-serif";
  Chart.defaults.color = textColor;

  // 1. Experience Breakdown Donut Chart
  const expCtx = document.getElementById('experienceDonutChart');
  if (expCtx) {
    if (expChartInstance) expChartInstance.destroy();

    expChartInstance = new Chart(expCtx, {
      type: 'doughnut',
      data: {
        labels: ['أقل من 3 سنوات (مبتدئ)', '3 إلى 10 سنوات (متوسط)', 'أكثر من 10 سنوات (خبير)'],
        datasets: [{
          data: [22, 48, 30],
          backgroundColor: isDark 
            ? ['#3b82f6', '#10b981', '#c5a880']
            : ['#0284c7', '#059669', '#946e37'],
          borderColor: sliceBorderColor,
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            rtl: true,
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${context.raw}% (${Math.round(context.raw * 145 / 100)} خطيباً)`;
              }
            }
          }
        },
        cutout: '66%'
      }
    });
  }

  // 2. Hours per Week Bar Chart
  const timeCtx = document.getElementById('timeHoursBarChart');
  if (timeCtx) {
    if (timeChartInstance) timeChartInstance.destroy();

    timeChartInstance = new Chart(timeCtx, {
      type: 'bar',
      data: {
        labels: ['أقل من 2h', '2 - 4h', '4 - 6h', 'أكثر من 6h'],
        datasets: [{
          label: 'نسبة الخطباء %',
          data: [11, 31, 47, 11],
          backgroundColor: isDark
            ? [
                'rgba(255, 255, 255, 0.2)',
                'rgba(56, 189, 248, 0.6)',
                '#c5a880',
                'rgba(244, 63, 94, 0.6)'
              ]
            : [
                'rgba(12, 32, 26, 0.15)',
                '#0284c7',
                '#946e37',
                '#e11d48'
              ],
          borderColor: isDark
            ? ['rgba(255, 255, 255, 0.3)', '#38bdf8', '#dfcaa7', '#f43f5e']
            : ['rgba(12, 32, 26, 0.25)', '#0284c7', '#7b5825', '#be123c'],
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 55,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: (val) => val + '%'
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            rtl: true,
            callbacks: {
              label: (ctx) => ` النسبة: ${ctx.raw}% من العينة`
            }
          }
        }
      }
    });
  }
}

function renderSvgChartFallbacks() {
  const expCanvas = document.getElementById('experienceDonutChart');
  if (expCanvas && expCanvas.parentElement) {
    expCanvas.parentElement.innerHTML = `
      <svg viewBox="0 0 200 200" width="220" height="220" style="margin: 0 auto; display: block;">
        <circle cx="100" cy="100" r="70" fill="transparent" stroke="#0284c7" stroke-width="26" stroke-dasharray="96.7 440" stroke-dashoffset="0"></circle>
        <circle cx="100" cy="100" r="70" fill="transparent" stroke="#059669" stroke-width="26" stroke-dasharray="211.1 440" stroke-dashoffset="-96.7"></circle>
        <circle cx="100" cy="100" r="70" fill="transparent" stroke="#946e37" stroke-width="26" stroke-dasharray="131.9 440" stroke-dashoffset="-307.8"></circle>
        <text x="100" y="96" text-anchor="middle" fill="currentColor" font-size="18" font-weight="bold" font-family="'thmanyahseriftext', sans-serif">N = 145</text>
        <text x="100" y="116" text-anchor="middle" fill="#946e37" font-size="12" font-family="'thmanyahseriftext', sans-serif">خطيباً</text>
      </svg>
    `;
  }

  const timeCanvas = document.getElementById('timeHoursBarChart');
  if (timeCanvas && timeCanvas.parentElement) {
    timeCanvas.parentElement.innerHTML = `
      <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 160px; padding-top: 20px;">
        <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size: 11px;">11%</span>
          <div style="width: 32px; height: 30px; background: rgba(0,0,0,0.15); border-radius: 4px;"></div>
          <span style="font-size: 11px; color:#5e776e;">&lt; 2h</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size: 11px;">31%</span>
          <div style="width: 32px; height: 75px; background: #0284c7; border-radius: 4px;"></div>
          <span style="font-size: 11px; color:#5e776e;">2-4h</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size: 12px; font-weight:bold; color:#946e37;">47%</span>
          <div style="width: 32px; height: 115px; background: #946e37; border-radius: 4px; box-shadow: 0 0 10px rgba(148,110,55,0.4);"></div>
          <span style="font-size: 11px; font-weight:bold; color:#946e37;">4-6h</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size: 11px;">11%</span>
          <div style="width: 32px; height: 30px; background: rgba(225,29,72,0.5); border-radius: 4px;"></div>
          <span style="font-size: 11px; color:#5e776e;">&gt; 6h</span>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   6. JOURNEY COMPARISON TOGGLER
   ========================================================================== */
window.switchJourneyView = function(mode) {
  const wrapper = document.getElementById('journeyFlowsWrapper');
  const asIsBox = document.getElementById('flowAsIsBox');
  const toBeBox = document.getElementById('flowToBeBox');

  const btnBoth = document.getElementById('btnViewBothJourneys');
  const btnAsIs = document.getElementById('btnViewAsIs');
  const btnToBe = document.getElementById('btnViewToBe');

  [btnBoth, btnAsIs, btnToBe].forEach(btn => btn?.classList.remove('active'));

  if (mode === 'split') {
    btnBoth?.classList.add('active');
    wrapper.style.gridTemplateColumns = window.innerWidth > 1024 ? '1fr 1fr' : '1fr';
    asIsBox.style.display = 'flex';
    toBeBox.style.display = 'flex';
    asIsBox.style.opacity = '1';
    toBeBox.style.opacity = '1';
  } else if (mode === 'asis') {
    btnAsIs?.classList.add('active');
    wrapper.style.gridTemplateColumns = '1fr';
    asIsBox.style.display = 'flex';
    toBeBox.style.display = 'none';
    asIsBox.style.opacity = '1';
  } else if (mode === 'tobe') {
    btnToBe?.classList.add('active');
    wrapper.style.gridTemplateColumns = '1fr';
    asIsBox.style.display = 'none';
    toBeBox.style.display = 'flex';
    toBeBox.style.opacity = '1';
  }
};

/* ==========================================================================
   7. INTERACTIVE 5-STEP WIZARD DEMO
   ========================================================================== */
const wizardStepsData = {
  1: {
    title: 'الخطوة الأولى: تحديد العنوان ونوع المحتوى المنبري',
    desc: 'يتيح للخطيب تحديد وجهة الطرح فوراً دون تشتت، مما يقضي على عائق رهبة الصفحة البيضاء.',
    html: `
      <div class="wizard-preview-panel">
        <label style="font-weight: 700; color: var(--gold-light); font-size: 0.9rem;">عنوان الخطبة المقترح:</label>
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); padding: 12px; border-radius: 8px; color: var(--text-main); font-weight: 600;">
          «خُلق الحياء وأثره في إصلاح الفرد والمجتمع»
        </div>
        <label style="font-weight: 700; color: var(--gold-light); font-size: 0.9rem; margin-top: 10px;">نوع الخطبة:</label>
        <div class="wiz-options-grid">
          <div class="wiz-option-card selected">
            <h5>خطبة جمعة رئيسية</h5>
            <span>قسمان مع جلسة استراحة ودعاء ختامي</span>
          </div>
          <div class="wiz-option-card">
            <h5>موعظة / درس بعد الصلاة</h5>
            <span>سرد متصل وتركيز على موضوع محدد</span>
          </div>
          <div class="wiz-option-card">
            <h5>خطبة عيد أو استسقاء</h5>
            <span>أحكام خاصة وتكبيرات مسنونة</span>
          </div>
        </div>
      </div>
    `
  },
  2: {
    title: 'الخطوة الثانية: تخصيص وتوجيه الخطاب للجمهور',
    desc: 'تكييف الأمثلة ومستوى البلاغة واللغة بما يلائم خلفية وواقع المصلين في الجامع.',
    html: `
      <div class="wizard-preview-panel">
        <label style="font-weight: 700; color: var(--gold-light); font-size: 0.9rem;">تحديد الشريحة الأكثر حضوراً في المسجد:</label>
        <div class="wiz-options-grid">
          <div class="wiz-option-card selected">
            <h5>عامة أهل الحي وعائلاتهم</h5>
            <span>لغة متوازنة تلامس الأسرة والتربية والتراحم</span>
          </div>
          <div class="wiz-option-card">
            <h5>فئة الشباب والطلاب</h5>
            <span>التركيز على الشبهات المعاصرة والإعلام الرقمي</span>
          </div>
          <div class="wiz-option-card">
            <h5>مجتمع الأعمال والموظفين</h5>
            <span>أمانة العمل، البيوع، والمسؤولية المالية</span>
          </div>
        </div>
        <div style="background: var(--emerald-soft); border: 1px solid rgba(4, 120, 87, 0.3); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; color: var(--emerald-accent); font-weight: 600;">
          ✓ تم ضبط معجم الألفاظ والأمثلة تلقائياً ليلائم وعي ومفردات الشريحة المختارة.
        </div>
      </div>
    `
  },
  3: {
    title: 'الخطوة الثالثة: ضبط النبرة والوقت المقدر للإلقاء',
    desc: 'التحكم الصارم في زمن المنبر وتحديد الوقع الشعوري المناسب لموضوع الخطبة.',
    html: `
      <div class="wizard-preview-panel">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px;">
          <div>
            <label style="font-weight: 700; color: var(--gold-light); font-size: 0.9rem;">النبرة الوعظية:</label>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              <div class="wiz-option-card selected">
                <h5>هادئة رقيقة ترغيبية</h5>
                <span>تعتمد على ضرب الأمثلة وتهذيب النفوس</span>
              </div>
              <div class="wiz-option-card">
                <h5>حماسية تحذيرية جادة</h5>
                <span>نبرة قوية في الترهيب من المنكرات</span>
              </div>
            </div>
          </div>
          <div>
            <label style="font-weight: 700; color: var(--gold-light); font-size: 0.9rem;">سقف وقت الإلقاء المقدر:</label>
            <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px; background: var(--bg-secondary); padding: 16px; border-radius: 8px;">
              <span style="font-size: 2rem; font-weight: 900; color: var(--gold-light);">12</span>
              <span style="font-size: 0.9rem; color: var(--text-secondary);">دقيقة إلقاء (~1100 كلمة منبرية مشكولة)</span>
            </div>
          </div>
        </div>
      </div>
    `
  },
  4: {
    title: 'الخطوة الرابعة: هندسة المحاور والشواهد الشرعية',
    desc: 'إعطاء الخطيب السيادة الكاملة لاختيار وتعديل وحذف أي عنصر قبل الشروع في التوليد.',
    html: `
      <div class="wizard-preview-panel">
        <label style="font-weight: 700; color: var(--gold-light); font-size: 0.9rem;">المحاور والشواهد المقترحة:</label>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); padding: 10px 14px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span>١. الاستفتاح بآيات سورة القصص: ﴿فَجَاءَتْهُ إِحْدَاهُمَا تَمْشِي عَلَى اسْتِحْيَاءٍ﴾</span>
            <span style="color: var(--emerald-accent); font-size: 0.8rem; font-weight: 700;">[قرآن كريم]</span>
          </div>
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); padding: 10px 14px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span>٢. حديث: «الحَيَاءُ لا يَأْتِي إِلَّا بِخَيْرٍ» [متفق عليه]</span>
            <span style="color: var(--emerald-accent); font-size: 0.8rem; font-weight: 700;">[صحيح البخاري]</span>
          </div>
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); padding: 10px 14px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span>٣. أثر الحياء الرقمي في ضبط تفاعل المسلم مع منصات التواصل الحديثة</span>
            <span style="color: var(--gold-light); font-size: 0.8rem; font-weight: 700;">[إسقاط معاصر]</span>
          </div>
        </div>
      </div>
    `
  },
  5: {
    title: 'الخطوة الخامسة: ميثاق المسؤولية والتوليد اللحظي الموثق',
    desc: 'تأكيد أمانة الإلقاء وإطلاق المعالجة المتوازية للتوليد في ثوانٍ مع التوثيق المباشر.',
    html: `
      <div class="wizard-preview-panel">
        <div style="background: rgba(148, 110, 55, 0.1); border: 1px dashed var(--gold-primary); padding: 16px; border-radius: 8px;">
          <h5 style="color: var(--gold-light); margin-bottom: 6px; font-weight: 700;">ميثاق أمانة الكلمة المنبرية:</h5>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
            «أقر بأن ما سألقيه على المنبر هو أمانة شرعية ومسؤولية أمام الله، وأن هذه المنصة وسيلة إعانة وتيسير، وسأراجع المسودة بعين الفاحص والناصح لأمة محمد ﷺ.»
          </p>
        </div>
        <div style="display: flex; gap: 12px; align-items: center; margin-top: 10px;">
          <button class="btn-gold-pulse" style="padding: 10px 20px; font-size: 0.92rem;">
            ✦ بدء التوليد والتخريج الآلي اللحظي
          </button>
          <span style="font-size: 0.82rem; color: var(--text-muted);">الوقت المقدر: 5 - 15 ثانية</span>
        </div>
      </div>
    `
  }
};

function initWizard() {
  previewWizardStep(1);
}

window.previewWizardStep = function(step) {
  const buttons = document.querySelectorAll('.w-step-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('active', +btn.getAttribute('data-step') === step);
  });

  const bodyBox = document.getElementById('wizardBodyBox');
  if (!bodyBox) return;

  const data = wizardStepsData[step];
  if (!data) return;

  bodyBox.innerHTML = `
    <div class="wiz-preview-title">
      <span>${data.title}</span>
    </div>
    <p class="wiz-preview-desc mb-4">${data.desc}</p>
    ${data.html}
  `;
};

/* ==========================================================================
   8. ANXIETY-FREE LOADING STATE SIMULATION
   ========================================================================== */
window.runSimulatedLoading = function() {
  const btn = document.getElementById('btnSimulateLoading');
  const phaseText = document.getElementById('simPhaseText');
  const percentText = document.getElementById('simPercentText');
  const progressBar = document.getElementById('simProgressBar');
  const logBox = document.getElementById('simLogBox');
  const quoteText = document.getElementById('simQuoteText');

  if (!btn || !progressBar || !logBox) return;

  btn.disabled = true;
  btn.style.opacity = '0.6';

  const steps = [
    {
      pct: 15,
      phase: 'فحص الشواهد القرآنية...',
      log: '✓ تم استدعاء نصوص الآيات بدقة مع ضبط التشكيل العثماني',
      quote: '«القرآن نور الصدور وينبوع المواعظ»'
    },
    {
      pct: 45,
      phase: 'الاتصال بالدرر السنية وباحث الأحاديث...',
      log: '✓ فحص سند حديث (الحياء لا يأتي إلا بخير) -> صحيح البخاري (رقم 6117)',
      quote: '«نضَّر الله امرأً سمع مقالتي فوعاها فأداها كما سمعها»'
    },
    {
      pct: 75,
      phase: 'تطبيق فلاتر البلاغة التراثية...',
      log: '✓ صياغة الاستفتاح المسنون وجلسة الاستراحة والدعاء المنبري الجامع',
      quote: '«وجوامع الكلم من هدي النبوة الشريفة»'
    },
    {
      pct: 100,
      phase: 'اكتملت الخطبة بنجاح تام!',
      log: '✨ جاهزة للتصدير لملف Word وقراءة المنبر الفورية (زمن: 4.8 ثوانٍ)',
      quote: '«نسأل الله القبول والنفع بما خطته أناملك ونطق به لسانك»'
    }
  ];

  logBox.innerHTML = '';
  let currentStepIdx = 0;

  const interval = setInterval(() => {
    if (currentStepIdx >= steps.length) {
      clearInterval(interval);
      btn.disabled = false;
      btn.style.opacity = '1';
      return;
    }

    const step = steps[currentStepIdx];
    progressBar.style.width = step.pct + '%';
    percentText.textContent = step.pct + '%';
    phaseText.textContent = step.phase;
    quoteText.textContent = step.quote;

    const logEntry = document.createElement('div');
    logEntry.className = 'log-item';
    logEntry.textContent = step.log;
    logBox.appendChild(logEntry);

    currentStepIdx++;
  }, 1300);
};

/* ==========================================================================
   9. MINBAR FONT SCALER
   ========================================================================== */
let currentMinbarFontSize = 22;

window.adjustMinbarFontSize = function(delta) {
  const sample = document.getElementById('minbarTextSample');
  const indicator = document.getElementById('currentFontSizeIndicator');
  if (!sample || !indicator) return;

  currentMinbarFontSize += delta;
  if (currentMinbarFontSize < 16) currentMinbarFontSize = 16;
  if (currentMinbarFontSize > 36) currentMinbarFontSize = 36;

  sample.style.fontSize = currentMinbarFontSize + 'px';
  indicator.textContent = currentMinbarFontSize + 'px';
};

/* ==========================================================================
   10. ACTIVE SIDEBAR NAVIGATION ITEM ON SCROLL
   ========================================================================== */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.sidebar-nav-links .nav-item');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.pageYOffset + 220;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      item.classList.toggle('active', href === `#${currentId}`);
    });
  }, { passive: true });
}

/* ==========================================================================
   11. JURY PRESENTATION DECK CONTROLLER (Slide-based Uncluttered Pitch Deck)
   ========================================================================== */
function initPresentationDeck() {
  const btnTrigger = document.getElementById('btnPresentationMode');
  const deckOverlay = document.getElementById('presentationDeckOverlay');
  const btnExit = document.getElementById('btnExitPresentationDeck');
  const btnPrev = document.getElementById('btnDeckPrev');
  const btnNext = document.getElementById('btnDeckNext');
  const slideNumLabel = document.getElementById('deckCurrentSlideNum');
  const progressBar = document.getElementById('deckProgressBar');
  const btnDeckTheme = document.getElementById('btnDeckThemeToggle');
  const dotsWrapper = document.getElementById('deckDotsWrapper');

  if (!deckOverlay) return;

  const slides = deckOverlay.querySelectorAll('.deck-slide');
  const dots = dotsWrapper ? dotsWrapper.querySelectorAll('.deck-dot') : [];
  const totalSlides = slides.length;
  const totalNumLabel = deckOverlay.querySelector('.deck-counter-total');
  let currentSlide = 1;

  // Convert numbers to Arabic numerals (e.g. 1 -> ٠١, 2 -> ٠٢)
  const toArabicNum = (num) => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const s = num < 10 ? '0' + num : '' + num;
    return s.split('').map(d => arabicDigits[parseInt(d, 10)]).join('');
  };

  if (totalNumLabel) {
    totalNumLabel.textContent = toArabicNum(totalSlides);
  }

  const updateSlideView = (targetIndex) => {
    if (targetIndex < 1) targetIndex = 1;
    if (targetIndex > totalSlides) targetIndex = totalSlides;
    currentSlide = targetIndex;

    // Update slides visibility
    slides.forEach(slide => {
      const slideIdx = parseInt(slide.getAttribute('data-slide'), 10);
      slide.classList.toggle('active', slideIdx === currentSlide);
    });

    // Update dots
    dots.forEach(dot => {
      const dotIdx = parseInt(dot.getAttribute('data-index'), 10);
      dot.classList.toggle('active', dotIdx === currentSlide);
    });

    // Update counter text & progress bar
    if (slideNumLabel) {
      slideNumLabel.textContent = toArabicNum(currentSlide);
    }
    if (progressBar) {
      const pct = (currentSlide / totalSlides) * 100;
      progressBar.style.width = `${pct}%`;
    }

    // Update button states
    if (btnPrev) {
      btnPrev.disabled = currentSlide === 1;
    }
    if (btnNext) {
      btnNext.disabled = currentSlide === totalSlides;
    }
  };

  const openDeck = () => {
    deckOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    updateSlideView(1);
  };

  const closeDeck = () => {
    deckOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // Event Listeners
  if (btnTrigger) {
    btnTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openDeck();
    });
  }

  if (btnExit) {
    btnExit.addEventListener('click', (e) => {
      e.preventDefault();
      closeDeck();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentSlide > 1) {
        updateSlideView(currentSlide - 1);
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentSlide < totalSlides) {
        updateSlideView(currentSlide + 1);
      }
    });
  }

  // Dots direct clicking
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      if (idx) updateSlideView(idx);
    });
  });

  // Presentation theme toggle
  if (btnDeckTheme) {
    btnDeckTheme.addEventListener('click', () => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme, true);
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (deckOverlay.classList.contains('hidden')) return;

    if (e.key === 'Escape') {
      closeDeck();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageDown') {
      // In RTL slide deck: Next slide
      if (currentSlide < totalSlides) {
        updateSlideView(currentSlide + 1);
      }
    } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
      // Previous slide
      if (currentSlide > 1) {
        updateSlideView(currentSlide - 1);
      }
    }
  });
}
