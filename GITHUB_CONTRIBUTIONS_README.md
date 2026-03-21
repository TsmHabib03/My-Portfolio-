# GitHub Contributions Graph Integration

## Overview

This portfolio now features a live GitHub contributions graph that dynamically fetches and displays your GitHub activity across multiple years (2022-2026) in a visually appealing format that matches GitHub's official design.

## Features

✅ **Live GitHub Data**: Fetches contributions directly from GitHub's public API
✅ **Multi-Year Support**: View contributions from 2022 to 2026 with year selector tabs
✅ **GitHub-like Dark Theme**: Automatically adapts to match GitHub's dark mode colors
✅ **Smart Caching**: Caches data for 1 hour per year to reduce API calls and improve performance
✅ **Responsive Design**: Fully mobile-friendly with horizontal scrolling on small screens
✅ **Accessibility**: Includes proper ARIA labels and keyboard navigation support
✅ **Graceful Fallback**: Shows a helpful message with a link to your profile if loading fails
✅ **Year Switching**: Click year tabs to instantly switch between different years

## Configuration

### Changing the GitHub Username

Open `assets/js/main.js` and update the configuration at the top:

```javascript
// Configuration - Update these values
const GITHUB_USERNAME = 'TsmHabib03'; // Change this to your GitHub username
const AVAILABLE_YEARS = [2026, 2025, 2024, 2023, 2022]; // Years to display
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
```

**Steps:**
1. Replace `'TsmHabib03'` with your GitHub username
2. Optionally adjust `AVAILABLE_YEARS` array to show different years
3. Save the file
4. Clear your browser's localStorage (or wait for cache to expire)
5. Refresh the page

### Adding or Removing Years

To customize which years are displayed in the tabs:

```javascript
// Show only recent years
const AVAILABLE_YEARS = [2026, 2025, 2024];

// Or show a wider range
const AVAILABLE_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
```

**Note:** You'll also need to update the year tabs in `index.html`:

```html
<div class="mb-4 flex flex-wrap gap-2" id="year-tabs">
    <button class="year-tab active" data-year="2026">2026</button>
    <button class="year-tab" data-year="2025">2025</button>
    <!-- Add more years as needed -->
</div>
```

### Adjusting Cache Duration

To change how long contributions are cached:

```javascript
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
// or
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours
```

## How It Works

### Public SVG Fetch (No Authentication Required)

The implementation uses GitHub's public contributions endpoint:

```javascript
// Current year
https://github.com/users/<USERNAME>/contributions

// Specific year
https://github.com/users/<USERNAME>/contributions?from=2024-01-01&to=2024-12-31
```

This endpoint returns the exact SVG that GitHub uses on profile pages, ensuring a pixel-perfect match.

### Multi-Year Caching Strategy

1. **First Load**: Fetches data for the current year from GitHub and stores it in localStorage
2. **Year Switching**: When you click a year tab:
   - Checks if that year's data is cached and fresh (< 1 hour old)
   - If cached: Retrieves from localStorage instantly
   - If not cached or expired: Fetches fresh data from GitHub
3. **Cache Expiry**: Automatically fetches fresh data after cache expires

Cache keys format:
- Data: `gh_cal_<username>_<year>`
- Timestamp: `gh_cal_<username>_<year>_timestamp`

Example:
- `gh_cal_TsmHabib03_2026`
- `gh_cal_TsmHabib03_2026_timestamp`

### Dark Mode Support

The implementation automatically detects your theme preference:

1. **Manual Toggle**: When you click the theme toggle button
2. **System Preference**: Respects `prefers-color-scheme: dark`
3. **Color Mapping**: Applies GitHub's official dark theme colors to the SVG
4. **Year Switching**: Maintains theme when switching between years

## Theme Colors

### GitHub Dark Theme Colors (Applied in Dark Mode)

| Level       | Color   | Description |
|-------------|---------|-------------|
| Empty       | #161b22 | No contributions |
| Level 1     | #0e4429 | 1-3 contributions |
| Level 2     | #006d32 | 4-6 contributions |
| Level 3     | #26a641 | 7-9 contributions |
| Level 4     | #39d353 | 10+ contributions |

### Portfolio Theme Colors

- **Background**: `#0d1117` (GitHub dark background)
- **Card Background**: `#161b22` (GitHub card color)
- **Primary**: `#58a6ff` (GitHub blue)
- **Secondary**: `#3fb950` (GitHub green)
- **Text**: `#e6edf3` (GitHub text)

## Testing

### Local Testing

1. Open `index.html` in your browser
2. Navigate to the About section
3. Verify the contributions graph loads for 2026 (default)
4. Click different year tabs (2025, 2024, 2023, 2022) to verify they load
5. Toggle dark/light mode to see theme changes
6. Test on mobile by resizing your browser window
7. Verify horizontal scrolling works on narrow screens

### Clearing Cache

To force a fresh fetch during testing:

```javascript
// In browser console - Clear specific year:
localStorage.removeItem('gh_cal_TsmHabib03_2026');
localStorage.removeItem('gh_cal_TsmHabib03_2026_timestamp');

// Clear all years at once:
['2026', '2025', '2024', '2023', '2022'].forEach(year => {
    localStorage.removeItem(`gh_cal_TsmHabib03_${year}`);
    localStorage.removeItem(`gh_cal_TsmHabib03_${year}_timestamp`);
});

location.reload();
```

## Troubleshooting

### Graph Not Loading for Specific Year

**Possible causes:**
1. **Invalid username**: Double-check spelling in `main.js`
2. **Year out of range**: GitHub may not have data for very old years
3. **Network issues**: Check browser console for errors
4. **CORS issues**: GitHub's endpoint should allow cross-origin requests
5. **Rate limiting**: Wait a few minutes if you've made many requests

**Solution:**
- Open browser DevTools (F12)
- Check the Console tab for error messages
- Check the Network tab to see the actual URL being requested
- Verify the year parameter is being passed correctly

### Year Tabs Not Working

**Solution:**
1. Ensure year tabs have the correct `data-year` attribute
2. Check browser console for JavaScript errors
3. Verify `initializeYearTabs()` is being called
4. Confirm year values match those in `AVAILABLE_YEARS` array

### Colors Not Changing in Dark Mode

**Solution:**
1. Clear browser cache
2. Check that `data-theme="dark"` is applied to `<html>` element
3. Verify CSS rules in style.css are not being overridden
4. Ensure `applyThemeToContributions()` is called after theme toggle

### Specific Year Shows Old Data

**Solution:**
- Cache may be stale but not expired yet
- Clear that year's cache manually (see Clearing Cache above)
- Or reduce `CACHE_DURATION` temporarily for testing

### Mobile Scrolling Issues

**Solution:**
- The graph should scroll horizontally on screens < 768px
- If not working, ensure `-webkit-overflow-scrolling: touch` is applied
- Check that parent containers don't have `overflow: hidden`

## Security & Privacy

### No Authentication Required

This implementation uses GitHub's **public** contributions endpoint, which:
- ✅ Requires no API tokens or authentication
- ✅ Works for any public GitHub profile
- ✅ Respects GitHub's privacy settings
- ❌ Cannot access private contributions

### Using GraphQL (Alternative - Not Implemented)

If you need more detailed data (per-day metadata), you can use GitHub's GraphQL API:

```javascript
// Requires GitHub Personal Access Token
const query = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;
```

**Note**: If using GraphQL:
1. Create a GitHub Personal Access Token (Settings → Developer Settings → Personal Access Tokens)
2. Store token in environment variable or `.env` file
3. **Never commit tokens to git**
4. Add `.env` to `.gitignore`

## File Changes Summary

### Updated Files

1. **index.html**
   - Updated status line text
   - Updated About section content
   - Added GitHub contributions container with year selector tabs (2026-2022)
   - Added year navigation UI

2. **assets/css/style.css**
   - Updated dark theme colors to match GitHub
   - Added contributions graph styles
   - Added year tab button styles with hover and active states
   - Added responsive mobile styles
   - Added accessibility focus styles

3. **assets/js/main.js**
   - Added multi-year configuration (`AVAILABLE_YEARS` array)
   - Updated `loadGitHubContributions(year)` function to accept year parameter
   - Added year-specific caching logic with localStorage
   - Added `initializeYearTabs()` function for tab switching
   - Added dark mode color mapping for all years
   - Added fallback error handling per year
   - Added system theme preference listener

## Acceptance Criteria Checklist

- ✅ Contributions graph visually matches GitHub's official design for all years
- ✅ Year tabs allow switching between 2022-2026
- ✅ Each year's data is cached independently
- ✅ Dark mode uses GitHub-like theme colors across all years
- ✅ Responsive on screens 320px and up
- ✅ Year tabs are responsive on mobile devices
- ✅ Status and About text updated as specified
- ✅ Fallback behavior works when fetch fails for any year
- ✅ Code is commented and organized
- ✅ Accessible with ARIA labels and keyboard support
- ✅ Smart caching reduces unnecessary API calls
- ✅ Theme changes apply to currently displayed year
- ✅ Year switching is instant when data is cached

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify GitHub username is correct
3. Clear cache and try again
4. Check GitHub profile is public

## License

This implementation uses GitHub's public API and respects their Terms of Service.
