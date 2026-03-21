# GitHub Contributions Graph Integration

## Overview

This portfolio now features a live GitHub contributions graph that dynamically fetches and displays your GitHub activity in a visually appealing format that matches GitHub's official design.

## Features

✅ **Live GitHub Data**: Fetches contributions directly from GitHub's public API
✅ **GitHub-like Dark Theme**: Automatically adapts to match GitHub's dark mode colors
✅ **Smart Caching**: Caches data for 1 hour to reduce API calls and improve performance
✅ **Responsive Design**: Fully mobile-friendly with horizontal scrolling on small screens
✅ **Accessibility**: Includes proper ARIA labels and keyboard navigation support
✅ **Graceful Fallback**: Shows a helpful message with a link to your profile if loading fails

## Configuration

### Changing the GitHub Username

Open `assets/js/main.js` and update the configuration at the top:

```javascript
// Configuration - Update these values
const GITHUB_USERNAME = 'TsmHabib03'; // Change this to your GitHub username
const CONTRIBUTIONS_YEAR = new Date().getFullYear();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
```

**Steps:**
1. Replace `'TsmHabib03'` with your GitHub username
2. Save the file
3. Clear your browser's localStorage (or wait for cache to expire)
4. Refresh the page

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
https://github.com/users/<USERNAME>/contributions
```

This endpoint returns the exact SVG that GitHub uses on profile pages, ensuring a pixel-perfect match.

### Caching Strategy

1. **First Load**: Fetches data from GitHub and stores it in localStorage
2. **Subsequent Loads**: Retrieves from cache if less than 1 hour old
3. **Cache Expiry**: Automatically fetches fresh data after cache expires

Cache keys:
- Data: `gh_cal_<username>_<year>`
- Timestamp: `gh_cal_<username>_<year>_timestamp`

### Dark Mode Support

The implementation automatically detects your theme preference:

1. **Manual Toggle**: When you click the theme toggle button
2. **System Preference**: Respects `prefers-color-scheme: dark`
3. **Color Mapping**: Applies GitHub's official dark theme colors to the SVG

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
3. Verify the contributions graph loads
4. Toggle dark/light mode to see theme changes
5. Test on mobile by resizing your browser window

### Clearing Cache

To force a fresh fetch during testing:

```javascript
// In browser console:
localStorage.removeItem('gh_cal_TsmHabib03_2026');
localStorage.removeItem('gh_cal_TsmHabib03_2026_timestamp');
location.reload();
```

## Troubleshooting

### Graph Not Loading

**Possible causes:**
1. **Invalid username**: Double-check spelling in `main.js`
2. **Network issues**: Check browser console for errors
3. **CORS issues**: GitHub's endpoint should allow cross-origin requests
4. **Rate limiting**: Wait a few minutes if you've made many requests

**Solution:**
- Open browser DevTools (F12)
- Check the Console tab for error messages
- Verify network requests in the Network tab

### Colors Not Changing in Dark Mode

**Solution:**
1. Clear browser cache
2. Check that `data-theme="dark"` is applied to `<html>` element
3. Verify CSS rules in style.css are not being overridden

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
   - Added GitHub contributions container

2. **assets/css/style.css**
   - Updated dark theme colors to match GitHub
   - Added contributions graph styles
   - Added responsive mobile styles
   - Added accessibility focus styles

3. **assets/js/main.js**
   - Added `loadGitHubContributions()` function
   - Added caching logic with localStorage
   - Added dark mode color mapping
   - Added fallback error handling
   - Added system theme preference listener

## Acceptance Criteria Checklist

- ✅ Contributions graph visually matches GitHub's official design
- ✅ Dark mode uses GitHub-like theme colors
- ✅ Responsive on screens 320px and up
- ✅ Status and About text updated as specified
- ✅ Fallback behavior works when fetch fails
- ✅ Code is commented and organized
- ✅ Accessible with ARIA labels and keyboard support
- ✅ Smart caching reduces unnecessary API calls

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify GitHub username is correct
3. Clear cache and try again
4. Check GitHub profile is public

## License

This implementation uses GitHub's public API and respects their Terms of Service.
