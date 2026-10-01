(function () {
    'use strict';

    if (document.getElementById('space-scene')) return;

    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var pageType = page === 'index.html' ? 'login' : page === 'dashboard.html' ? 'dashboard' : 'workspace';
    document.body.classList.add('space-page', 'space-page--' + pageType);

    var scene = document.createElement('div');
    scene.id = 'space-scene';
    scene.setAttribute('aria-hidden', 'true');
    scene.innerHTML = '<div class="space-nebula space-nebula--violet"></div>' +
        '<div class="space-nebula space-nebula--cyan"></div>' +
        '<div class="space-grid"></div>' +
        '<div class="space-stars"></div>';

    var stars = scene.querySelector('.space-stars');
    var count = pageType === 'login' ? 58 : pageType === 'dashboard' ? 46 : 32;
    for (var i = 0; i < count; i++) {
        var star = document.createElement('i');
        star.className = 'space-star' + (i % 7 === 0 ? ' space-star--twinkle' : '');
        star.style.setProperty('--star-x', ((i * 47 + 13) % 100) + '%');
        star.style.setProperty('--star-y', ((i * 71 + 19) % 100) + '%');
        star.style.setProperty('--star-size', (i % 11 === 0 ? 2 : 1) + 'px');
        star.style.setProperty('--star-opacity', (0.28 + (i % 6) * 0.1).toFixed(2));
        star.style.setProperty('--star-delay', (-1 * (i % 13)).toFixed(1) + 's');
        stars.appendChild(star);
    }
    document.body.insertBefore(scene, document.body.firstChild);

    function syncThemeColour() {
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', document.documentElement.getAttribute('data-theme') === 'light' ? '#eaf0fa' : '#080b1c');
    }
    syncThemeColour();
    new MutationObserver(syncThemeColour).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}());
