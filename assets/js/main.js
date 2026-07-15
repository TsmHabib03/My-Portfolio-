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

// ===================
// CONTACT FORM – Google Sheets Integration
// ===================

// ⚠️ IMPORTANT: Replace this URL with your deployed Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxRhIWUflHjpSgd-jAFGsoVbcdcHDi-1rbJQY4hxWmNt25Fr9djYUR4zZAAfsQv6GVhqQ/exec';

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get UI elements
        const submitBtn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnLoading = document.getElementById('btn-loading');
        const successMsg = document.getElementById('form-success');
        const errorMsg = document.getElementById('form-error');
        const errorText = document.getElementById('error-text');

        // Reset messages
        successMsg.classList.add('hidden');
        errorMsg.classList.add('hidden');

        // Show loading state
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        btnLoading.classList.add('flex');

        // Collect form data
        const formData = new FormData(this);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };

        try {
            // Send data to Google Apps Script
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Required for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Since mode is 'no-cors', we can't read the response
            // We assume success if no error is thrown
            console.log('✓ Contact form submitted successfully');

            // Show success message
            successMsg.classList.remove('hidden');
            contactForm.reset();

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                successMsg.classList.add('hidden');
            }, 5000);

        } catch (error) {
            console.error('Contact form error:', error);

            // Show error message
            errorText.textContent = 'Failed to send message. Please try again or email me directly.';
            errorMsg.classList.remove('hidden');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
            btnLoading.classList.remove('flex');
        }
    });
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate-fade-in');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section').forEach(s => observer.observe(s));

// ─── Page Loader ───
(function() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    window.addEventListener('load', () => {
        loader.style.width = '100%';
        setTimeout(() => loader.classList.add('complete'), 200);
        setTimeout(() => loader.remove(), 800);
    });
})();

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
    initializeYearTabs();
    loadGitHubContributions();
    initProfileSkeleton();
    initFloatingIcons();
    AOS.init({ duration: 550, once: true, easing: 'ease-out-cubic', offset: 60 });
});

// ─── Profile Image Skeleton ───
function initProfileSkeleton() {
    const img = document.querySelector('.hero-profile-image');
    const skeleton = document.getElementById('profile-skeleton');
    if (!img || !skeleton) return;

    const hide = () => {
        skeleton.classList.add('loaded');
        setTimeout(() => skeleton.remove(), 500);
    };

    // Already cached — remove immediately with no flash
    if (img.complete && img.naturalWidth > 0) {
        skeleton.remove();
        return;
    }

    img.addEventListener('load', hide);
    img.addEventListener('error', () => skeleton.remove());
}

// ─── Floating Profile Icons (random rotation) ───
function initFloatingIcons() {
    const slots = Array.from(document.querySelectorAll('.hero-floating-icon'));
    if (!slots.length) return;

    const POOL = [
        { icon: 'fas fa-code',       bg: 'var(--primary)',   label: 'Code'      },
        { icon: 'fas fa-laptop',     bg: 'var(--secondary)', label: 'Dev'       },
        { icon: 'fab fa-html5',      bg: '#e34f26',          label: 'HTML5'     },
        { icon: 'fab fa-css3-alt',   bg: '#1572b6',          label: 'CSS3'      },
        { icon: 'fab fa-js',         bg: '#b8860b',          label: 'JS'        },
        { icon: 'fab fa-php',        bg: '#6f5b9e',          label: 'PHP'       },
        { icon: 'fab fa-java',       bg: '#007396',          label: 'Java'      },
        { icon: 'fas fa-database',   bg: '#4479A1',          label: 'MySQL'     },
        { icon: 'fab fa-git-alt',    bg: '#f05032',          label: 'Git'       },
        { icon: 'fab fa-github',     bg: '#24292e',          label: 'GitHub'    },
        { svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>', bg: '#007acc', label: 'VS Code' },
        { icon: 'fab fa-react',      bg: '#0891b2',          label: 'React'     },
        { icon: 'fab fa-node-js',    bg: '#15803d',          label: 'Node.js'   },
        { icon: 'fab fa-laravel',    bg: '#ff2d20',          label: 'Laravel'   },
        { icon: 'fab fa-bootstrap',  bg: '#7952b3',          label: 'Bootstrap' },
        { icon: 'fab fa-docker',     bg: '#2496ed',          label: 'Docker'    },
        { icon: 'fab fa-figma',      bg: '#a259ff',          label: 'Figma'     },
    ];

    const showing = [];

    function pickNext(exclude) {
        const available = POOL.map((_, i) => i).filter(i => !exclude.includes(i));
        return available[Math.floor(Math.random() * available.length)];
    }

    function applyIcon(el, idx) {
        const t = POOL[idx];
        el.style.background = t.bg;
        el.title = t.label;
        el.innerHTML = t.svg
            ? t.svg.replace('<svg ', '<svg class="text-white" style="width:1rem;height:1rem" aria-hidden="true" ')
            : `<i class="${t.icon} text-white" style="font-size:1rem" aria-hidden="true" title="${t.label}"></i>`;
    }

    // Initial random assignment — each slot gets a unique tech
    slots.forEach(el => {
        const idx = pickNext(showing);
        showing.push(idx);
        applyIcon(el, idx);
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Rotate one random slot every 3.2 seconds
    setInterval(() => {
        const slotIdx = Math.floor(Math.random() * slots.length);
        const others = showing.filter((_, i) => i !== slotIdx);
        const newIdx = pickNext(others);
        const el = slots[slotIdx];

        // Fade out → swap → fade in
        el.style.transition = 'opacity 0.35s ease';
        el.style.opacity = '0';
        setTimeout(() => {
            showing[slotIdx] = newIdx;
            applyIcon(el, newIdx);
            el.style.opacity = '1';
        }, 370);
    }, 3200);
}

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

// Note: Heatmap colors are now handled via CSS classes (level-0 through level-4)
// in style.css for both light and dark themes

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
                cell.classList.add(`level-${level}`);
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
 * Re-color handled by CSS classes now (level-0 through level-4).
 * This function kept for compatibility but no longer needed.
 */
function recolorHeatmap() {
    // Colors now handled via CSS classes
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
