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
        const sectionHeight = section.clientHeight;
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

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Form submission handling (optional enhancement)
const contactForm = document.querySelector('#contact form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Here you can add your form submission logic
        console.log('Form submitted:', formObject);
        
        // Show success message (you can customize this)
        alert('Thank you for your message! I\'ll get back to you soon.');
        
        // Reset form
        this.reset();
    });
}

// Intersection Observer for animations (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

// Observe all sections for animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add loading state management
document.addEventListener('DOMContentLoaded', function() {
    // Remove any loading states
    document.body.classList.add('loaded');
    
    // Initialize any other components here
    console.log('Portfolio website loaded successfully!');
});

// Add smooth hover effects for buttons
document.querySelectorAll('.hover-scale').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ===================
// THEME TOGGLE - Cyberpunk Night Mode
// ===================
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    enableDarkMode(false); // false = no animation on load
}

// Toggle theme on button click
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = htmlElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            disableDarkMode();
        } else {
            enableDarkMode(true);
        }
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
}