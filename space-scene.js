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
        '<div class="space-stars"></div>' +
        '<div class="space-sun"></div>';

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

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    var compactScreen = window.matchMedia && window.matchMedia('(max-width: 768px)');
    var spacecraftTimer;
    var cometTimer;
    var spacecraftActive = false;
    var cometActive = false;

    function randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    function canAnimateAmbient() {
        return !document.hidden && !(reducedMotion && reducedMotion.matches);
    }

    function clearAmbientTimers() {
        window.clearTimeout(spacecraftTimer);
        window.clearTimeout(cometTimer);
        spacecraftTimer = undefined;
        cometTimer = undefined;
    }

    function scheduleSpacecraft() {
        window.clearTimeout(spacecraftTimer);
        if (!canAnimateAmbient() || (compactScreen && compactScreen.matches)) return;
        var interval = randomBetween(25000, 50000);
        if (pageType === 'workspace') interval *= 1.35;
        spacecraftTimer = window.setTimeout(spawnSpacecraft, interval);
    }

    function scheduleComet() {
        window.clearTimeout(cometTimer);
        if (!canAnimateAmbient()) return;
        var interval = randomBetween(18000, 40000);
        if (compactScreen && compactScreen.matches) interval *= 1.7;
        if (pageType === 'workspace') interval *= 1.2;
        cometTimer = window.setTimeout(spawnComet, interval);
    }

    function spawnSpacecraft() {
        spacecraftTimer = undefined;
        if (!canAnimateAmbient() || spacecraftActive || (compactScreen && compactScreen.matches)) {
            scheduleSpacecraft();
            return;
        }
        spacecraftActive = true;
        var reverse = Math.random() > 0.5;
        var spacecraft = document.createElement('div');
        spacecraft.className = 'space-spacecraft' + (reverse ? ' space-spacecraft--reverse' : '');
        spacecraft.innerHTML = '<svg viewBox="0 0 96 42" aria-hidden="true"><path class="spacecraft-body" d="M7 25 34 11 68 13 89 21 68 28 34 31Z"/><path class="spacecraft-wing" d="m39 18 12-11 8 7-9 7Zm1 10 10 7 9-8-10-4Z"/><path class="spacecraft-cockpit" d="m49 15 12 2-7 5-11-2Z"/><path class="spacecraft-engine" d="m14 22 13 2-13 3Z"/></svg>';
        spacecraft.style.setProperty('--spacecraft-scale', randomBetween(0.7, 1.05).toFixed(2));
        spacecraft.style.setProperty('--spacecraft-opacity', randomBetween(pageType === 'workspace' ? 0.24 : 0.32, pageType === 'workspace' ? 0.36 : 0.5).toFixed(2));
        spacecraft.style.setProperty('--spacecraft-duration', randomBetween(10, 16).toFixed(1) + 's');
        spacecraft.style.setProperty('--spacecraft-start-y', randomBetween(38, 68).toFixed(1) + 'vh');
        spacecraft.style.setProperty('--spacecraft-end-y', randomBetween(8, 29).toFixed(1) + 'vh');
        scene.appendChild(spacecraft);
        spacecraft.addEventListener('animationend', function () {
            spacecraft.remove();
            spacecraftActive = false;
            scheduleSpacecraft();
        }, { once: true });
    }

    function spawnComet() {
        cometTimer = undefined;
        if (!canAnimateAmbient() || cometActive) {
            scheduleComet();
            return;
        }
        cometActive = true;
        var comet = document.createElement('div');
        comet.className = 'space-comet';
        comet.style.setProperty('--comet-start-x', randomBetween(-12, 62).toFixed(1) + 'vw');
        comet.style.setProperty('--comet-start-y', randomBetween(5, 33).toFixed(1) + 'vh');
        comet.style.setProperty('--comet-distance-x', randomBetween(25, 42).toFixed(1) + 'vw');
        comet.style.setProperty('--comet-distance-y', randomBetween(16, 28).toFixed(1) + 'vh');
        comet.style.setProperty('--comet-duration', randomBetween(1.5, 3).toFixed(2) + 's');
        scene.appendChild(comet);
        comet.addEventListener('animationend', function () {
            comet.remove();
            cometActive = false;
            scheduleComet();
        }, { once: true });
    }

    function resumeAmbient() {
        if (canAnimateAmbient()) {
            if (!spacecraftActive) scheduleSpacecraft();
            if (!cometActive) scheduleComet();
        }
    }

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) clearAmbientTimers();
        else resumeAmbient();
    });
    if (reducedMotion) reducedMotion.addEventListener('change', function () {
        clearAmbientTimers();
        resumeAmbient();
    });
    resumeAmbient();

    function syncThemeColour() {
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', document.documentElement.getAttribute('data-theme') === 'light' ? '#eaf0fa' : '#080b1c');
    }
    syncThemeColour();
    new MutationObserver(syncThemeColour).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}());
