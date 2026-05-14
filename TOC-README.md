# Table of Contents Quick Reference

## One-Line Setup

```velocity
#parse('toc-macros.vm') #setupTableOfContents()
```

## Files

| File | Purpose | Size |
|------|---------|------|
| `toc-generator.js` | JavaScript engine | 3.5 KB |
| `toc-styles.css` | Styling and responsive design | 2 KB |
| `toc-macros.vm` | Velocity template macros | - |

## Features at a Glance

✅ Automatic heading detection  
✅ Hierarchical nesting  
✅ Smooth scrolling  
✅ Active section highlighting  
✅ Responsive design  
✅ WCAG AA accessible  
✅ Dark mode support  
✅ Keyboard navigation  
✅ Print friendly  

## Configuration

```javascript
TOCGenerator.init({
  headingSelector: 'h2, h3, h4, h5, h6',
  containerSelector: '.toc-container',
  minHeadings: 3,
  smoothScroll: true,
  highlightActiveSection: true
});
```

## Velocity Macros

```velocity
// Simple setup
#setupTableOfContents()

// With options
#setupTableOfContents({
  'headingSelector': 'h2, h3',
  'minHeadings': 2
})

// Conditional display
#conditionalTableOfContents(2)

// Manual components
#renderTableOfContents()
#initializeTableOfContents($config)
```

## HTML Structure

```html
<link rel="stylesheet" href="css/toc-styles.css">

<div class="toc-container"></div>

<main>
  <h2 id="section1">Section 1</h2>
  <p>Content...</p>
</main>

<script src="js/toc-generator.js"></script>
<script>
  TOCGenerator.init();
</script>
```

## CSS Customization

```css
/* Colors */
.toc-link { color: #007bff; }
.toc-link.active { border-left-color: #007bff; }

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .toc-container { background-color: #1e1e1e; }
  .toc-link { color: #66b3ff; }
}

/* High contrast */
@media (prefers-contrast: more) {
  .toc-container { border: 2px solid currentColor; }
  .toc-link { text-decoration: underline; }
}
```

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 60+ | ✅ Full |
| Firefox | 55+ | ✅ Full |
| Safari | 12+ | ✅ Full |
| Edge | 15+ | ✅ Full |
| IE 11 | - | ⚠️ Basic |

## Common Issues

| Issue | Solution |
|-------|----------|
| TOC not appearing | Check `minHeadings` setting or page has enough headings |
| Styling missing | Verify CSS file is loaded in Network tab |
| Links not working | Ensure headings have IDs (auto-assigned if missing) |
| Not scrolling smoothly | Check browser supports it or use polyfill |
| Section not highlighting | Verify `highlightActiveSection: true` |

## Accessibility

- ✅ WCAG AA compliant
- ✅ Keyboard navigation (Tab, Enter, Arrow keys)
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ High contrast mode
- ✅ Reduced motion support

## Performance

- ⚡ 3.5 KB JavaScript (minified)
- ⚡ 2 KB CSS (minified)
- ⚡ Passive scroll listeners
- ⚡ Single-pass DOM traversal

## Documentation Links

- **Full Documentation**: `TOC-FEATURE.md`
- **Example Page**: `TOC-EXAMPLE.html`
- **Issue Reports**: GitHub Issues
- **Discussions**: GitHub Discussions

## Version

Current Version: 1.0.0  
License: MIT

---

For detailed documentation, see `TOC-FEATURE.md`
