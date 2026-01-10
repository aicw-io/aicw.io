/**
 * Client-side blur for ranking reports
 * Features:
 * - URL param ?unlock=1 disables blur (for app dashboard links)
 * - Anchor links #brand-<name> and #source-<name>
 * - Auto tab switching based on anchor
 * - Session-based random blur
 * - Google crawlers see full content (no JS execution)
 */
(function() {
  var SIGNUP_URL = 'https://app.aicw.io/auth?utm_source=ranking&utm_content=blurred';
  var BLUR_PERCENTAGE = 0.40;
  var TOP_N_ALWAYS_BLUR = 3;

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

  // Seeded random from session
  function getSessionSeed() {
    var seed = sessionStorage.getItem('aicw-blur-seed');
    if (!seed) {
      seed = Math.random().toString(36).substring(2);
      sessionStorage.setItem('aicw-blur-seed', seed);
    }
    return seed;
  }

  function seededRandom(seed) {
    var hash = 0;
    for (var i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    return function() {
      hash = (hash * 1103515245 + 12345) & 0x7fffffff;
      return hash / 0x7fffffff;
    };
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

    var id = hash.substring(1); // Remove #
    var element = document.getElementById(id);
    if (!element) return;

    // Determine which tab to show
    if (id.startsWith('brand-')) {
      switchToTab('panel-brands');
    } else if (id.startsWith('source-')) {
      switchToTab('panel-sources');
    }

    // Scroll to element with slight delay for tab switch
    setTimeout(function() {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlightRow(element);
    }, 100);
  }

  function switchToTab(panelId) {
    var btn = document.querySelector('.tab-btn[data-target="' + panelId + '"]');
    if (btn && typeof window.switchTab === 'function') {
      window.switchTab(btn);
    }
  }

  function highlightRow(row) {
    row.style.transition = 'background-color 0.3s';
    row.style.backgroundColor = '#fef3c7'; // Yellow highlight
    setTimeout(function() {
      row.style.backgroundColor = '';
    }, 2000);
  }

  function applyBlur() {
    var seed = getSessionSeed() + window.location.pathname;
    var random = seededRandom(seed);

    // Inject blur CSS
    injectBlurStyles();

    // Detect page type and apply blur
    var path = window.location.pathname;
    if (path.includes('/mention/')) {
      applyDetailPageBlur('brand');
    } else if (path.includes('/website/')) {
      applyDetailPageBlur('source');
    } else {
      applyIndexPageBlur(random);
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
      .aicw-blurred-row {\
        position: relative;\
      }\
      .aicw-blurred-row::after {\
        content: "\\1F512";\
        position: absolute;\
        right: 8px;\
        top: 50%;\
        transform: translateY(-50%);\
        filter: none;\
        cursor: pointer;\
        pointer-events: auto;\
        font-size: 14px;\
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

  // Select exactly which indices to blur for even distribution
  function selectIndicesToBlur(totalItems, topN, percentage, random) {
    var indices = new Set();

    // Always blur top N
    for (var i = 0; i < Math.min(topN, totalItems); i++) {
      indices.add(i);
    }

    // For remaining items, select exactly percentage% to blur
    var remainingItems = totalItems - topN;
    if (remainingItems > 0) {
      var numToBlur = Math.round(remainingItems * percentage);

      // Create array of remaining indices
      var remainingIndices = [];
      for (var j = topN; j < totalItems; j++) {
        remainingIndices.push(j);
      }

      // Fisher-Yates shuffle using seeded random
      for (var k = remainingIndices.length - 1; k > 0; k--) {
        var swapIdx = Math.floor(random() * (k + 1));
        var temp = remainingIndices[k];
        remainingIndices[k] = remainingIndices[swapIdx];
        remainingIndices[swapIdx] = temp;
      }

      // Take first numToBlur items
      for (var m = 0; m < numToBlur; m++) {
        indices.add(remainingIndices[m]);
      }
    }

    return indices;
  }

  function applyIndexPageBlur(random) {
    // Blur brand rows in #panel-brands
    var brandRows = document.querySelectorAll('#panel-brands tbody tr');
    var brandIndicesToBlur = selectIndicesToBlur(brandRows.length, TOP_N_ALWAYS_BLUR, BLUR_PERCENTAGE, random);
    brandRows.forEach(function(row, index) {
      if (brandIndicesToBlur.has(index)) {
        blurTableRow(row, 'mention');
      }
    });

    // Blur source rows in #panel-sources
    var sourceRows = document.querySelectorAll('#panel-sources tbody tr');
    var sourceIndicesToBlur = selectIndicesToBlur(sourceRows.length, TOP_N_ALWAYS_BLUR, BLUR_PERCENTAGE, random);
    sourceRows.forEach(function(row, index) {
      if (sourceIndicesToBlur.has(index)) {
        blurTableRow(row, 'website');
      }
    });

    // Blur intro section brand mentions
    blurIntroSection();
  }

  function blurTableRow(row, type) {
    // Find the name link
    var nameLink = row.querySelector('a[href*="' + type + '/"]');
    if (nameLink) {
      nameLink.classList.add('aicw-blurred');
      // Store original href for potential unlock
      nameLink.dataset.originalHref = nameLink.href;
      nameLink.href = SIGNUP_URL;
      nameLink.style.pointerEvents = 'auto';
    }

    // Blur favicon
    var favicon = row.querySelector('img');
    if (favicon) {
      favicon.classList.add('aicw-blurred');
    }

    row.classList.add('aicw-blurred-row');
  }

  function blurIntroSection() {
    // Blur brand links in report-intro section
    var introLinks = document.querySelectorAll('.report-intro a[href*="mention/"]');
    introLinks.forEach(function(link) {
      link.classList.add('aicw-blurred');
      link.dataset.originalHref = link.href;
      link.href = SIGNUP_URL;
      link.style.pointerEvents = 'auto';
    });

    // Also blur favicons in intro
    var introFavicons = document.querySelectorAll('.report-intro img');
    introFavicons.forEach(function(img) {
      img.classList.add('aicw-blurred');
    });
  }

  function applyDetailPageBlur(type) {
    // On detail pages, blur specific high-value sections

    // Blur hero section (name, rank, key metrics)
    var hero = document.querySelector('.bg-gradient-to-r, .bg-gradient-to-br');
    if (hero) {
      // Blur the name
      var name = hero.querySelector('h1');
      if (name) name.classList.add('aicw-blurred');

      // Blur rank
      var rank = hero.querySelector('.font-black');
      if (rank) rank.classList.add('aicw-blurred');
    }

    // Blur some metrics but not all (teaser effect)
    var metrics = document.querySelectorAll('.metric-value-sm');
    metrics.forEach(function(metric, i) {
      if (i < 2) metric.classList.add('aicw-blurred'); // Blur first 2 metrics
    });

    // Keep citations/quotes visible (valuable for user to see format)
    // Keep source links visible but blur some
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
