# Copilot Instructions for Portfolio Website

## Project Overview
This is a static personal portfolio website for Habib, a Grade 12 student aspiring to become a software developer. The site showcases skills, projects, and contact information with a modern, minimal design.

## Tech Stack
- **HTML5** - Single-page structure in `index.html`
- **Tailwind CSS** - Via CDN (`https://cdn.tailwindcss.com`)
- **Custom CSS** - [style.css](assets/css/style.css) for components, [responsive.css](assets/css/responsive.css) for breakpoints
- **Vanilla JavaScript** - [main.js](assets/js/main.js) for interactivity
- **Font Awesome 6** - Icons via CDN
- **Inter font** - Typography via Google Fonts

## Architecture

### File Structure
```
index.html              # Single-page app with all sections
assets/
  css/
    style.css           # Component styles, CSS variables, animations
    responsive.css      # Media queries for tablet/mobile
  js/
    main.js             # Navigation, form handling, scroll effects
  images/               # Project screenshots and profile photos
```

### CSS Variables (in `:root`)
Always use these variables for consistency:
- Colors: `--primary` (#0070f3), `--secondary` (#00b383), `--accent` (#f5a623)
- Spacing: `--radius` (12px), `--radius-lg` (16px)
- Effects: `--shadow`, `--shadow-md`, `--shadow-lg`, `--transition`

### Section Structure
Each major section follows this pattern:
```html
<section id="section-name" class="py-20 bg-gradient-to-br from-gray-50 ...">
  <!-- Background decoration with blur effects -->
  <div class="absolute inset-0 opacity-20">...</div>
  
  <!-- Content container -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <!-- Section header with badge + title + underline -->
    <!-- Section content -->
  </div>
</section>
```

## Key Patterns

### Glassmorphism Cards
Use this pattern for cards with the frosted-glass effect:
```html
<div class="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg">
```

### Project Cards
Project cards in the Projects section use:
- `.project-card .glass-card` classes
- Status badges: `.status-badge.status-working` or `.status-badge.status-progress`
- Tech icons: `.tech-icon-small` with Font Awesome brand icons
- Action buttons: `.project-btn.project-btn-primary` and `.project-btn.project-btn-secondary`

### Button Styles
- Primary: `.btn-primary` - Blue filled button
- Secondary: `.btn-secondary` - Outlined button that fills on hover

### Responsive Design
- Desktop-first approach with Tailwind utilities
- Custom breakpoints in `responsive.css`: 1024px (tablet), 768px (mobile)
- Mobile menu toggle handled in `main.js`

## Development Workflow

### Running Locally
Simply open `index.html` in a browser - no build step required.

### Adding a New Project Card
1. Copy an existing project card from the Projects section
2. Update: image src, alt text, status badge, tech icons, title, description
3. Add project image to `assets/images/`

### Adding New Sections
1. Follow the section structure pattern above
2. Use existing CSS classes from `style.css`
3. Add `data-aos` attributes for scroll animations (AOS library referenced but not loaded)

## Conventions

### Naming
- IDs use kebab-case: `#mobile-menu`, `#contact-form`
- CSS classes use BEM-like naming: `.status-badge`, `.tech-icon-small`
- Images use descriptive names: `weatherApp.png`, `LearnFlow.png`

### Social Links
All social media links open in new tabs with `target="_blank" rel="noopener noreferrer"`

### Colors by Context
- Primary (blue): Main CTAs, links, headers
- Secondary (green): Success states, availability badges
- Accent (orange): Highlights, attention-grabbing elements

## Known Limitations
- Form submission currently only logs to console (no backend)
- AOS animations referenced in HTML but library not loaded
- Some page links in README (`about.html`, `projects.html`) don't exist - single-page design
