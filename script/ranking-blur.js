/**
 * Client-side blur for ranking reports
 * Features:
 * - URL param ?unlock=1 disables blur (for app dashboard links)
 * - Anchor links #brand-<name> and #source-<name> with permanent highlight
 * - Multi-selection: #brand-<name1>,<name2> or #source-<domain1>,<domain2>
 * - Auto tab switching based on anchor
 * - Blurs: Voice, Position, Mentions/Citations values
 * - Blurs: Source Links table URLs on /mention/ pages
 * - Blurs: Brands Referenced table on /website/ pages
 * - Google crawlers see full content (no JS execution)
 */
(function() {
  var SIGNUP_URL = 'https://app.aicw.io/auth?utm_source=ranking&utm_content=blurred';
  var currentHighlightedRows = []; // Track highlighted rows for cleanup

  // Check for unlock parameter
  function isUnlocked() {
    var params = new URLSearchParams(window.location.search);
    return params.has('unlock') || params.get('preview') === 'full';
  }

  // Generate slug from name (for anchor IDs)
  function slugify(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function init() {
    // Add anchor IDs to all rows (always, for navigation)
    addAnchorIds();

    // Skip blur if unlocked
    if (!isUnlocked()) {
      applyBlur();
      addCtaBanner();
    }

    // Handle anchor navigation (tab switch + scroll)
    handleAnchorNavigation();

    // Listen for hash changes
    window.addEventListener('hashchange', handleAnchorNavigation);
  }

  function addAnchorIds() {
    // Add IDs to brand rows
    var brandRows = document.querySelectorAll('#panel-brands tbody tr');
    brandRows.forEach(function(row) {
      var link = row.querySelector('a[href*="mention/"]');
      if (link) {
        var name = link.textContent.trim();
        row.id = 'brand-' + slugify(name);
      }
    });

    // Add IDs to source rows
    var sourceRows = document.querySelectorAll('#panel-sources tbody tr');
    sourceRows.forEach(function(row) {
      var link = row.querySelector('a[href*="website/"]');
      if (link) {
        var name = link.textContent.trim();
        row.id = 'source-' + slugify(name);
      }
    });
  }

  function handleAnchorNavigation() {
    var hash = window.location.hash;
    if (!hash) return;

    var hashContent = hash.substring(1); // Remove #
    var prefix, slugs;

    // Parse prefix and slugs (supports comma-separated: #brand-chatgpt,openai)
    if (hashContent.startsWith('brand-')) {
      prefix = 'brand';
      slugs = hashContent.substring(6).split(','); // Remove "brand-" prefix
      switchToTab('panel-brands');
    } else if (hashContent.startsWith('source-')) {
      prefix = 'source';
      slugs = hashContent.substring(7).split(','); // Remove "source-" prefix
      switchToTab('panel-sources');
    } else {
      return; // Unknown prefix
    }

    // Clear previous highlights
    clearHighlights();

    // Find and highlight all matching rows
    var firstElement = null;
    slugs.forEach(function(slug) {
      var id = prefix + '-' + slug.trim();
      var element = document.getElementById(id);
      if (element) {
        highlightRow(element);
        if (!firstElement) firstElement = element;
      }
    });

    // Scroll to first matched element
    if (firstElement) {
      setTimeout(function() {
        firstElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  function switchToTab(panelId) {
    var btn = document.querySelector('.tab-btn[data-target="' + panelId + '"]');
    if (btn && typeof window.switchTab === 'function') {
      window.switchTab(btn);
    }
  }

  function clearHighlights() {
    currentHighlightedRows.forEach(function(row) {
      row.style.backgroundColor = '';
      row.style.fontWeight = '';
    });
    currentHighlightedRows = [];
  }

  function highlightRow(row) {
    row.style.transition = 'background-color 0.3s';
    row.style.backgroundColor = '#fef3c7'; // Yellow highlight
    row.style.fontWeight = 'bold';         // Bold text
    currentHighlightedRows.push(row);
    // Permanent highlight - no setTimeout to remove
  }

  function applyBlur() {
    // Inject blur CSS
    injectBlurStyles();

    // Detect page type and apply blur
    var path = window.location.pathname;
    if (path.includes('/mention/')) {
      applyDetailPageBlur('brand');
    } else if (path.includes('/website/')) {
      applyDetailPageBlur('source');
    } else {
      applyIndexPageBlur();
    }
  }

  function injectBlurStyles() {
    var style = document.createElement('style');
    style.textContent = '\
      .aicw-blurred {\
        filter: blur(5px);\
        user-select: none;\
        pointer-events: none;\
        transition: filter 0.2s;\
      }\
      .aicw-blur-cta {\
        background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);\
        border: 1px solid #c7d2fe;\
        border-radius: 8px;\
        padding: 16px;\
        margin: 16px 0;\
        text-align: center;\
      }\
      .aicw-blur-cta p {\
        margin: 0;\
        color: #3730a3;\
      }\
      .aicw-blur-cta a {\
        color: #4f46e5;\
        font-weight: bold;\
        text-decoration: underline;\
        margin-left: 8px;\
      }\
      .aicw-blur-cta a:hover {\
        color: #3730a3;\
      }\
      html.dark .aicw-blur-cta {\
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);\
        border-color: #4338ca;\
      }\
      html.dark .aicw-blur-cta p {\
        color: #c7d2fe;\
      }\
      html.dark .aicw-blur-cta a {\
        color: #a5b4fc;\
      }\
      html.dark .aicw-blur-cta a:hover {\
        color: #e0e7ff;\
      }\
    ';
    document.head.appendChild(style);
  }

  function applyIndexPageBlur() {
    // Blur Voice column (3rd) in all rows - blur the influence-gauge or entire cell
    document.querySelectorAll('#panel-brands tbody td:nth-child(3), #panel-sources tbody td:nth-child(3)').forEach(function(td) {
      td.classList.add('aicw-blurred');
    });

    // Blur Position column (4th) in all rows
    document.querySelectorAll('#panel-brands tbody td:nth-child(4), #panel-sources tbody td:nth-child(4)').forEach(function(td) {
      td.classList.add('aicw-blurred');
    });

    // Blur Mentions column (5th) in all rows
    document.querySelectorAll('#panel-brands tbody td:nth-child(5), #panel-sources tbody td:nth-child(5)').forEach(function(td) {
      td.classList.add('aicw-blurred');
    });
  }

  function applyDetailPageBlur(type) {
    // Blur specific metrics by label text
    var labelsToBlur = ['Voice', 'Position'];
    if (type === 'brand') {
      labelsToBlur.push('Mentions');
    } else {
      labelsToBlur.push('Citations');
    }

    document.querySelectorAll('.metric-card-sm').forEach(function(card) {
      var label = card.querySelector('.metric-label-sm');
      if (label && labelsToBlur.indexOf(label.textContent.trim()) !== -1) {
        var value = card.querySelector('.metric-value-sm');
        if (value) value.classList.add('aicw-blurred');
      }
    });

    // Blur hero Share of Voice
    blurHeroVoice();

    // Page-type specific blurring
    if (type === 'brand') {
      blurSourceLinksTable();
    } else {
      blurBrandsReferencedTable();
    }
  }

  function blurHeroVoice() {
    // Find hero section and blur the voice percentage
    var hero = document.querySelector('.bg-gradient-to-r');
    if (hero) {
      var voiceContainers = hero.querySelectorAll('.text-right');
      voiceContainers.forEach(function(container) {
        var label = container.querySelector('.text-xs');
        if (label && label.textContent.indexOf('Share of Voice') !== -1) {
          var value = container.querySelector('.text-lg');
          if (value) value.classList.add('aicw-blurred');
        }
      });
    }
  }

  function blurSourceLinksTable() {
    // Find "Source Links" section by heading text
    var headings = document.querySelectorAll('h2');
    headings.forEach(function(h2) {
      if (h2.textContent.indexOf('Source Links') !== -1) {
        var container = h2.closest('.bg-white') || h2.closest('[class*="bg-gray"]') || h2.parentElement.parentElement;
        if (container) {
          var table = container.querySelector('table');
          if (table) {
            // Blur all URL links in the table (visually only, keep href for navigation)
            table.querySelectorAll('tbody a').forEach(function(link) {
              link.classList.add('aicw-blurred');
              // Keep original href - don't redirect to signup, allow navigation to /website/* pages
            });
            // Also blur favicons
            table.querySelectorAll('tbody img').forEach(function(img) {
              img.classList.add('aicw-blurred');
            });
          }
        }
      }
    });
  }

  function blurBrandsReferencedTable() {
    // Find "Brands Referenced" section by heading text
    var headings = document.querySelectorAll('h2');
    headings.forEach(function(h2) {
      if (h2.textContent.indexOf('Brands Referenced') !== -1) {
        var container = h2.closest('.bg-white') || h2.closest('[class*="bg-gray"]') || h2.parentElement.parentElement;
        if (container) {
          var table = container.querySelector('table');
          if (table) {
            // Blur all content in table body rows (visually only)
            table.querySelectorAll('tbody tr').forEach(function(row) {
              row.querySelectorAll('td').forEach(function(td) {
                td.classList.add('aicw-blurred');
              });
            });
            // Keep original hrefs - don't redirect to signup, allow navigation to /mention/* pages
          }
        }
      }
    });
  }

  function addCtaBanner() {
    var intro = document.querySelector('.report-intro, .entity-intro, .source-intro');
    if (intro && !document.querySelector('.aicw-blur-cta')) {
      var cta = document.createElement('div');
      cta.className = 'aicw-blur-cta';
      cta.innerHTML = '<p>Some content is blurred for preview.' +
        '<a href="' + SIGNUP_URL + '">Sign up free</a> to see full rankings and details.</p>';
      intro.insertAdjacentElement('afterend', cta);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
