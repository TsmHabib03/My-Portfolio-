// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-blue-500');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-blue-500');
        }
    });
});

// Mobile menu toggle functionality
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        const icon = this.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Form submission handling
const contactForm = document.querySelector('#contact form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => { formObject[key] = value; });
        console.log('Form submitted:', formObject);
        alert("Thank you for your message! I'll get back to you soon.");
        this.reset();
    });
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate-fade-in');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section').forEach(s => observer.observe(s));

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
    initializeYearTabs();
    loadGitHubContributions();
    console.log('Portfolio website loaded successfully!');
});

// Smooth hover effects
document.querySelectorAll('.hover-scale').forEach(element => {
    element.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-2px)'; });
    element.addEventListener('mouseleave', function() { this.style.transform = 'translateY(0)'; });
});

// ===================
// THEME TOGGLE
// ===================
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    enableDarkMode(false);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = htmlElement.getAttribute('data-theme') === 'dark';
        isDark ? disableDarkMode() : enableDarkMode(true);
    });
}

function enableDarkMode(animate = true) {
    htmlElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        if (animate) {
            themeToggle.classList.add('active');
            setTimeout(() => themeToggle.classList.remove('active'), 500);
        }
    }
    recolorHeatmap();
}

function disableDarkMode() {
    htmlElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        themeToggle.classList.add('active');
        setTimeout(() => themeToggle.classList.remove('active'), 500);
    }
    recolorHeatmap();
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        e.matches ? enableDarkMode(false) : disableDarkMode();
    }
});

// ===================
// GITHUB CONTRIBUTIONS – Dynamic Custom Heatmap
// API: github-contributions-api.jogruber.de (CORS-free JSON)
// ===================

const GITHUB_USERNAME   = 'TsmHabib03';
const CONTRIB_API       = 'https://github-contributions-api.jogruber.de/v4';
const CACHE_DURATION    = 60 * 60 * 1000; // 1 hour
const MONTH_NAMES       = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

let currentYear = new Date().getFullYear();

// GitHub's official heatmap colors – light and dark palettes
const HEATMAP_COLORS = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark:  ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
};

/** Returns current theme name */
function getTheme() {
    return htmlElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/**
 * Load contributions from the CORS-free JSON API, with 1h local cache.
 */
async function loadGitHubContributions(year = currentYear) {
    const container = document.getElementById('github-contributions-container');
    if (!container) return;

    currentYear = year;
    const cacheKey = `gh_json_${GITHUB_USERNAME}_${year}`;
    const cacheTs  = `${cacheKey}_ts`;
    const now      = Date.now();

    // Try cache first
    try {
        const cached = localStorage.getItem(cacheKey);
        const ts     = localStorage.getItem(cacheTs);
        if (cached && ts && (now - parseInt(ts)) < CACHE_DURATION) {
            renderHeatmap(container, JSON.parse(cached), year);
            return;
        }
    } catch (_) {}

    // Show loading
    container.innerHTML = `<div class="loading-spinner">
        <i class="fas fa-spinner fa-spin" style="margin-right:6px;"></i>Loading contributions…
    </div>`;

    try {
        const res = await fetch(`${CONTRIB_API}/${GITHUB_USERNAME}?y=${year}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Cache it
        try {
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheTs, now.toString());
        } catch (_) {}

        renderHeatmap(container, data, year);
        console.log(`✓ GitHub contributions ${year}: ${data.total?.[year] ?? 0} total`);

    } catch (err) {
        console.error('Contributions load failed:', err);
        showContribFallback(container, year);
    }
}

/**
 * Render the GitHub-style heatmap grid from JSON data.
 */
function renderHeatmap(container, data, year) {
    const contributions = data.contributions ?? [];
    const totalCount    = data.total?.[year] ?? 0;

    container.setAttribute('aria-label', `${GITHUB_USERNAME}'s GitHub contributions in ${year}`);
    container.innerHTML = '';

    // Update stat cards
    updateContribStats(contributions);

    // Build week grid (Sunday-first, 7 rows)
    const weeks  = buildWeekGrid(contributions, year);
    const palette = HEATMAP_COLORS[getTheme()];

    // ─── Outer scroll wrapper ───
    const scroll = document.createElement('div');
    scroll.className = 'heatmap-scroll';

    // ─── Month labels row ───
    const monthRow = document.createElement('div');
    monthRow.className = 'heatmap-month-row';

    // Spacer to align with day-label column
    const spacer = document.createElement('div');
    spacer.className = 'heatmap-day-label-spacer';
    monthRow.appendChild(spacer);

    let lastMonth = -1;
    weeks.forEach(week => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-month-label';
        const firstReal = week.find(d => d !== null);
        if (firstReal) {
            const m = new Date(firstReal.date + 'T00:00:00Z').getUTCMonth();
            if (m !== lastMonth) {
                cell.textContent = MONTH_NAMES[m];
                lastMonth = m;
            }
        }
        monthRow.appendChild(cell);
    });
    scroll.appendChild(monthRow);

    // ─── Grid body (day labels + week columns) ───
    const body = document.createElement('div');
    body.className = 'heatmap-grid-body';

    // Day labels (Sun–Sat, only Mon/Wed/Fri shown like GitHub)
    const dayCol = document.createElement('div');
    dayCol.className = 'heatmap-day-labels';
    ['', 'Mon', '', 'Wed', '', 'Fri', ''].forEach(label => {
        const d = document.createElement('div');
        d.className = 'heatmap-day-label';
        d.textContent = label;
        dayCol.appendChild(d);
    });
    body.appendChild(dayCol);

    // Week columns
    weeks.forEach(week => {
        const col = document.createElement('div');
        col.className = 'heatmap-week-col';
        week.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            if (day) {
                const level = day.level ?? 0;
                cell.style.backgroundColor = palette[level];
                cell.dataset.level = level;
                cell.dataset.count = day.count;
                cell.dataset.date  = day.date;
                // Tooltip on hover
                cell.title = day.count === 0
                    ? `No contributions on ${formatDate(day.date)}`
                    : `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatDate(day.date)}`;
                if (level > 0) cell.classList.add('heatmap-cell--active');
            } else {
                cell.classList.add('heatmap-cell--empty');
            }
            col.appendChild(cell);
        });
        body.appendChild(col);
    });
    scroll.appendChild(body);

    // ─── Total label (bottom-left, just like GitHub) ───
    const totalLabel = document.createElement('div');
    totalLabel.className = 'heatmap-total-label';
    totalLabel.textContent = `${totalCount.toLocaleString()} contributions in ${year}`;
    scroll.appendChild(totalLabel);

    container.appendChild(scroll);
}

/**
 * Re-color all heatmap cells when the user toggles dark/light mode.
 * No re-fetch needed.
 */
function recolorHeatmap() {
    const palette = HEATMAP_COLORS[getTheme()];
    document.querySelectorAll('.heatmap-cell[data-level]').forEach(cell => {
        cell.style.backgroundColor = palette[parseInt(cell.dataset.level, 10)];
    });
}

/**
 * Build a 2-D array: weeks[col][row0..6] where row 0 = Sunday.
 * Null entries = days outside the year being displayed.
 */
function buildWeekGrid(contributions, year) {
    const byDate = {};
    contributions.forEach(d => { byDate[d.date] = d; });

    const start = new Date(Date.UTC(year, 0, 1));
    const isCurrentYear = year === new Date().getFullYear();
    const today = new Date();
    const end   = isCurrentYear
        ? new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
        : new Date(Date.UTC(year, 11, 31));

    const weeks  = [];
    const cursor = new Date(start);
    // Rewind cursor to the Sunday before (or on) Jan 1
    cursor.setUTCDate(cursor.getUTCDate() - cursor.getUTCDay());

    while (cursor <= end) {
        const week = [];
        for (let d = 0; d < 7; d++) {
            const iso = toISO(cursor);
            if (cursor < start || cursor > end) {
                week.push(null); // padding outside year
            } else {
                week.push(byDate[iso] ?? { date: iso, count: 0, level: 0 });
            }
            cursor.setUTCDate(cursor.getUTCDate() + 1);
        }
        weeks.push(week);
    }
    return weeks;
}

/**
 * Compute and animate stats from the contribution array.
 */
function updateContribStats(contributions) {
    const todayISO = toISO(new Date());
    const past     = contributions.filter(d => d.date <= todayISO);
    const counts   = past.map(d => d.count);

    const total      = counts.reduce((a, b) => a + b, 0);
    const activeDays = counts.filter(c => c > 0).length;

    let currentStreak = 0;
    for (let i = past.length - 1; i >= 0; i--) {
        if (past[i].count > 0) currentStreak++;
        else break;
    }

    let longestStreak = 0, tmp = 0;
    counts.forEach(c => {
        tmp = c > 0 ? tmp + 1 : 0;
        if (tmp > longestStreak) longestStreak = tmp;
    });

    animateCounter('total-contributions', total);
    animateCounter('current-streak',      currentStreak, currentStreak === 1 ? ' day' : ' days');
    animateCounter('longest-streak',      longestStreak, longestStreak === 1 ? ' day' : ' days');
    animateCounter('active-days',         activeDays);
}

/** Animate a number counting up */
function animateCounter(id, target, suffix = '') {
    const el = document.getElementById(id);
    if (!el) return;
    const dur = 900, t0 = Date.now();
    (function tick() {
        const p = Math.min((Date.now() - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
    })();
}

/** Show error fallback */
function showContribFallback(container, year) {
    container.innerHTML = `
        <div class="contributions-fallback">
            <i class="fas fa-exclamation-triangle" style="margin-right:.4rem;color:#f78166;"></i>
            Unable to load contributions for ${year}.
            <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer">
                View ${GITHUB_USERNAME} on GitHub →
            </a>
        </div>`;
}

/** Initialize year tab click handlers */
function initializeYearTabs() {
    document.querySelectorAll('.year-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadGitHubContributions(parseInt(this.getAttribute('data-year')));
        });
    });
}

// ─── Helpers ───
function toISO(date) {
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth()+1)}-${pad(date.getUTCDate())}`;
}
function pad(n) { return String(n).padStart(2, '0'); }
function formatDate(iso) {
    return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'
    });
}
