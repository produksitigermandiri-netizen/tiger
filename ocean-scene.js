(function () {
    'use strict';

    if (document.getElementById('ocean-scene')) return;

    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var pageType = page === 'index.html'
        ? 'login'
        : page === 'dashboard.html'
            ? 'dashboard'
            : 'workspace';

    document.body.classList.add('ocean-page', 'ocean-page--' + pageType);

    var fishSvg = '<svg viewBox="0 0 120 60" aria-hidden="true"><path fill="currentColor" d="M18 30C35 8 76 7 96 27c9-9 16-12 22-13-1 9-4 15-10 18 5 3 8 9 9 17-8-2-15-6-21-13-23 18-58 16-78-6Z"/><circle cx="72" cy="24" r="2.5" fill="rgba(233,255,255,.72)"/></svg>';
    var mantaSvg = '<svg viewBox="0 0 180 90" aria-hidden="true"><path fill="currentColor" d="M8 22c30 4 43 10 67 24 9-11 22-11 31 0 22-14 37-20 66-24-12 23-28 38-51 42-9 2-16 0-22-4l-8 26-7-27c-7 5-15 7-25 5C37 60 20 45 8 22Z"/><path d="M77 45c8-6 19-6 27 0" fill="none" stroke="rgba(233,255,255,.38)" stroke-width="2" stroke-linecap="round"/></svg>';
    var jellySvg = '<svg viewBox="0 0 70 110" aria-hidden="true"><path fill="currentColor" d="M8 46C8 20 19 5 35 5s27 15 27 41c-7 6-14 7-21 2-5 5-10 5-15 0-6 5-12 4-18-2Z"/><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M17 48c-7 17 11 22 2 42"/><path d="M31 50c-8 20 9 27 0 52"/><path d="M45 49c9 18-8 26 2 47"/><path d="M56 47c7 14-8 23-1 37"/></g></svg>';
    var seabedSvg = '<svg viewBox="0 0 1400 120" preserveAspectRatio="none" aria-hidden="true"><path fill="rgba(1,14,24,.72)" d="M0 87c155-25 270 17 403 3 164-18 257-57 434-23 162 31 349-13 563 15v38H0Z"/><g fill="none" stroke="rgba(34,211,197,.36)" stroke-width="7" stroke-linecap="round"><path d="M85 105c4-26-9-43-3-72M82 71c-16-12-20-23-18-35M83 62c14-10 20-22 21-36M1270 111c-3-28 12-45 6-72M1276 76c16-11 20-24 18-38M1275 67c-15-9-21-21-22-33"/></g><g fill="rgba(255,128,106,.28)"><path d="M170 108c-4-21 5-37 19-49-2 19 3 27 14 38-10-3-15 0-18 13Z"/><path d="M1195 112c5-23-5-40-21-53 3 20-2 30-14 40 11-3 17 1 20 14Z"/></g></svg>';

    var scene = document.createElement('div');
    scene.id = 'ocean-scene';
    scene.setAttribute('aria-hidden', 'true');
    scene.innerHTML =
        '<div class="ocean-caustics"></div>' +
        '<div class="ocean-rays"></div>' +
        '<div class="ocean-surface"></div>' +
        '<div class="ocean-depth"></div>' +
        '<div class="ocean-creature ocean-fish-one">' + fishSvg + '</div>' +
        '<div class="ocean-creature ocean-fish-two">' + fishSvg + '</div>' +
        '<div class="ocean-creature ocean-manta">' + mantaSvg + '</div>' +
        '<div class="ocean-creature ocean-jelly">' + jellySvg + '</div>' +
        '<div class="ocean-seabed">' + seabedSvg + '</div>';

    var bubbleCount = pageType === 'login' ? 22 : pageType === 'dashboard' ? 16 : 9;
    for (var i = 0; i < bubbleCount; i++) {
        var bubble = document.createElement('span');
        bubble.className = 'ocean-bubble';
        bubble.style.setProperty('--bubble-size', (4 + (i * 7 % 14)) + 'px');
        bubble.style.setProperty('--bubble-left', ((i * 43 + 7) % 96) + '%');
        bubble.style.setProperty('--bubble-duration', (10 + (i * 3 % 12)) + 's');
        bubble.style.setProperty('--bubble-delay', (-1 * (i * 2.17 % 18)).toFixed(2) + 's');
        scene.appendChild(bubble);
    }

    document.body.insertBefore(scene, document.body.firstChild);

    function syncThemeColour() {
        var meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) return;
        var isLight = document.documentElement.getAttribute('data-theme') === 'light';
        meta.setAttribute('content', isLight ? '#0b7896' : '#021b2d');
    }

    syncThemeColour();
    new MutationObserver(syncThemeColour).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
})();
