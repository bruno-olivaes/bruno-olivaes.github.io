// Motor de Telemetria, Heatmaps e Repasse de Origem para Kiwify — Ecossistema TVIN
(() => {
    const STORAGE_KEY = 'tvin_attribution_v1';
    const ATTRIBUTION_KEYS = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'src',
        'sck',
        'ref',
        'afiliado'
    ];

    const cfg = window.TVIN_TRACKING_CONFIG || {};
    const searchParams = new URLSearchParams(window.location.search);
    const debugEnabled = Boolean(cfg.debug) || searchParams.get('debug_tracking') === '1';

    window.__TVIN_EVENTS__ = window.__TVIN_EVENTS__ || [];

    function logDebug(...args) {
        if (debugEnabled && typeof console !== 'undefined' && console.info) {
            console.info('[TVIN Tracking]', ...args);
        }
    }

    function cleanId(value, pattern) {
        if (typeof value !== 'string') return '';
        const trimmed = value.trim();
        if (!trimmed) return '';
        if (/^(G-X+|SEU_|EXEMPLO|TESTE)/i.test(trimmed)) return '';
        if (pattern && !pattern.test(trimmed)) return '';
        return trimmed;
    }

    function readSessionAttribution() {
        try {
            const raw = window.sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (_) {
            return {};
        }
    }

    function writeSessionAttribution(data) {
        try {
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (_) {
            // Ambiente privado ou file:// pode restringir sessionStorage
        }
    }

    function inferFromReferrer(referrerUrl) {
        const ref = (referrerUrl || '').toLowerCase();
        if (!ref) {
            return { utm_source: 'direto', utm_medium: 'site', src: 'lp_direto' };
        }
        if (ref.includes('instagram.com') || ref.includes('ig.me')) {
            return { utm_source: 'instagram', utm_medium: 'referral', src: 'ig_ref' };
        }
        if (ref.includes('youtube.com') || ref.includes('youtu.be')) {
            return { utm_source: 'youtube', utm_medium: 'referral', src: 'yt_ref' };
        }
        if (ref.includes('facebook.com') || ref.includes('fb.com') || ref.includes('l.fb.com')) {
            return { utm_source: 'facebook', utm_medium: 'referral', src: 'fb_ref' };
        }
        if (ref.includes('google.')) {
            return { utm_source: 'google', utm_medium: 'organic', src: 'google_org' };
        }
        if (ref.includes('t.co') || ref.includes('x.com') || ref.includes('twitter.com')) {
            return { utm_source: 'x', utm_medium: 'referral', src: 'x_ref' };
        }
        try {
            const host = new URL(ref).hostname.replace(/^www\./, '');
            return { utm_source: host || 'referral', utm_medium: 'referral', src: `ref_${host}` };
        } catch (_) {
            return { utm_source: 'referral', utm_medium: 'referral', src: 'lp_ref' };
        }
    }

    function collectAttribution() {
        const saved = readSessionAttribution();
        const urlData = {};

        ATTRIBUTION_KEYS.forEach((key) => {
            const val = searchParams.get(key);
            if (val && val.trim()) {
                urlData[key] = val.trim().slice(0, 120);
            }
        });

        const merged = { ...saved, ...urlData };
        if (!merged.utm_source && !merged.src) {
            const inferred = inferFromReferrer(document.referrer);
            Object.assign(merged, inferred);
        }
        if (!merged.src) {
            const sourceSlug = (merged.utm_source || 'direto').replace(/[^a-z0-9_-]/gi, '').slice(0, 30);
            const medSlug = (merged.utm_medium || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 20);
            merged.src = medSlug ? `${sourceSlug}_${medSlug}` : sourceSlug;
        }
        writeSessionAttribution(merged);
        return merged;
    }

    const attribution = collectAttribution();
    const ga4Id = cleanId(cfg.ga4MeasurementId, /^G-[A-Z0-9]+$/i);
    const clarityId = cleanId(cfg.clarityProjectId, /^[a-z0-9]+$/i);
    const metaPixelId = cleanId(cfg.metaPixelId, /^\d{6,25}$/);

    // Carregadores sob demanda (so carregam scripts externos quando IDs reais existem)
    function initGA4(id) {
        if (!id) return;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', id, {
            send_page_view: true,
            page_title: document.title,
            page_location: window.location.href
        });

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
        document.head.appendChild(script);
    }

    function initClarity(id) {
        if (!id) return;
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r);
            t.async = 1;
            t.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(i);
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', id);

        window.clarity('set', 'utm_source', attribution.utm_source || 'direto');
        if (attribution.utm_medium) window.clarity('set', 'utm_medium', attribution.utm_medium);
        if (attribution.utm_campaign) window.clarity('set', 'utm_campaign', attribution.utm_campaign);
        window.clarity('set', 'src', attribution.src || 'lp_direto');
        window.clarity('set', 'dispositivo', window.innerWidth <= 768 ? 'mobile' : 'desktop');
        window.clarity('set', 'principio_dia', String(new Date().getDate() % 10));
    }

    function initMetaPixel(id) {
        if (!id) return;
        (function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = true;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        window.fbq('init', id);
        window.fbq('track', 'PageView');
        window.fbq('track', 'ViewContent', {
            content_name: 'Do Primeiro Real ao Patrimônio',
            value: 14.90,
            currency: 'BRL'
        });
    }

    initGA4(ga4Id);
    initClarity(clarityId);
    initMetaPixel(metaPixelId);

    const state = {
        lastSectionSeen: 'home',
        seenSections: new Set(['home']),
        scrollMilestones: new Set(),
        timeMilestones: new Set(),
        engagedSeconds: 0
    };

    function emitEvent(eventName, params = {}) {
        const payload = {
            event: eventName,
            timestamp: Date.now(),
            ...params
        };
        if (window.__TVIN_EVENTS__.length >= 200) {
            window.__TVIN_EVENTS__.shift();
        }
        window.__TVIN_EVENTS__.push(payload);
        logDebug(eventName, params);

        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        }
        if (typeof window.clarity === 'function') {
            window.clarity('event', eventName);
        }
    }

    window.tvinTrackEvent = emitEvent;

    function buildKiwifyUrl(baseHref, ctaPos) {
        try {
            const url = new URL(baseHref);
            ATTRIBUTION_KEYS.forEach((key) => {
                if (attribution[key] && !url.searchParams.has(key)) {
                    url.searchParams.set(key, attribution[key]);
                }
            });
            const deviceType = window.innerWidth <= 768 ? 'mobile' : 'desktop';
            const digit = new Date().getDate() % 10;
            url.searchParams.set('s1', ctaPos || 'cta_geral');
            url.searchParams.set('s2', deviceType);
            url.searchParams.set('s3', `${state.lastSectionSeen}_p${digit}`);
            return url.toString();
        } catch (_) {
            return baseHref;
        }
    }

    function refreshAllKiwifyLinks() {
        const links = document.querySelectorAll('a[href*="pay.kiwify.com.br"]');
        links.forEach((link) => {
            if (!link.dataset.baseHref) {
                link.dataset.baseHref = link.href;
            }
            const ctaPos = link.dataset.ctaPos || link.dataset.track || 'cta_geral';
            link.href = buildKiwifyUrl(link.dataset.baseHref, ctaPos);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const deviceType = window.innerWidth <= 768 ? 'mobile' : 'desktop';
        emitEvent('landing_loaded', {
            utm_source: attribution.utm_source || 'direto',
            utm_medium: attribution.utm_medium || 'site',
            utm_campaign: attribution.utm_campaign || '',
            src: attribution.src || 'lp_direto',
            dispositivo: deviceType,
            principio_dia: new Date().getDate() % 10
        });

        refreshAllKiwifyLinks();

        // 1. Cliques nos botões de compra Kiwify
        document.querySelectorAll('a[href*="pay.kiwify.com.br"]').forEach((link) => {
            if (!link.dataset.baseHref) {
                link.dataset.baseHref = link.href;
            }
            const updateLink = () => {
                const ctaPos = link.dataset.ctaPos || link.dataset.track || 'cta_geral';
                link.href = buildKiwifyUrl(link.dataset.baseHref, ctaPos);
            };
            link.addEventListener('pointerdown', updateLink);
            link.addEventListener('focus', updateLink);
            link.addEventListener('click', () => {
                updateLink();
                const ctaPos = link.dataset.ctaPos || link.dataset.track || 'cta_geral';
                const eventParams = {
                    cta_position: ctaPos,
                    utm_source: attribution.utm_source || 'direto',
                    src: attribution.src || 'lp_direto',
                    dispositivo: window.innerWidth <= 768 ? 'mobile' : 'desktop',
                    last_section: state.lastSectionSeen,
                    currency: 'BRL',
                    value: 14.90,
                    items: [{
                        item_id: 'primeiro-real-patrimonio',
                        item_name: 'Do Primeiro Real ao Patrimônio',
                        price: 14.90,
                        quantity: 1
                    }]
                };
                emitEvent('cta_kiwify_click', eventParams);
                emitEvent('begin_checkout', eventParams);
                if (typeof window.fbq === 'function') {
                    window.fbq('track', 'InitiateCheckout', {
                        content_name: 'Do Primeiro Real ao Patrimônio',
                        content_category: ctaPos,
                        value: 14.90,
                        currency: 'BRL'
                    });
                }
                if (typeof window.clarity === 'function') {
                    window.clarity('set', 'ultimo_cta_kiwify', ctaPos);
                }
            });
        });

        // 2. Cliques nos links sociais / patrocinadores locais (@thevisaoinformacao)
        document.querySelectorAll('a[data-track^="ig_"]').forEach((link) => {
            link.addEventListener('click', () => {
                const pos = link.dataset.ctaPos || link.dataset.track || 'instagram';
                emitEvent('ig_apoio_click', {
                    cta_position: pos,
                    utm_source: attribution.utm_source || 'direto',
                    dispositivo: window.innerWidth <= 768 ? 'mobile' : 'desktop'
                });
                if (typeof window.clarity === 'function') {
                    window.clarity('set', 'clique_instagram', pos);
                }
            });
        });

        // 3. Visibilidade de seções (funil de atenção da página)
        const trackedSections = document.querySelectorAll('header[id], section[id], footer[id]');
        if ('IntersectionObserver' in window && trackedSections.length > 0) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const secId = entry.target.id;
                    if (!secId) return;
                    state.lastSectionSeen = secId;
                    if (!state.seenSections.has(secId)) {
                        state.seenSections.add(secId);
                        emitEvent('section_view', {
                            section_id: secId,
                            sections_count: state.seenSections.size
                        });
                    }
                });
            }, { threshold: 0.25 });

            trackedSections.forEach((sec) => sectionObserver.observe(sec));
        }

        // 4. Profundidade de rolagem (25%, 50%, 75%, 90%)
        let scrollScheduled = false;
        window.addEventListener('scroll', () => {
            if (scrollScheduled) return;
            scrollScheduled = true;
            window.requestAnimationFrame(() => {
                scrollScheduled = false;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (docHeight <= 0) return;
                const pct = Math.round((window.scrollY / docHeight) * 100);
                [25, 50, 75, 90].forEach((milestone) => {
                    if (pct >= milestone && !state.scrollMilestones.has(milestone)) {
                        state.scrollMilestones.add(milestone);
                        emitEvent('scroll_depth', {
                            percent_scrolled: milestone,
                            last_section: state.lastSectionSeen
                        });
                    }
                });
            });
        }, { passive: true });

        // 5. Abertura das perguntas do FAQ (mapeia principais objeções)
        document.querySelectorAll('.faq-item').forEach((item, idx) => {
            const questionBtn = item.querySelector('.faq-question');
            if (!questionBtn) return;
            questionBtn.addEventListener('click', () => {
                window.setTimeout(() => {
                    if (item.classList.contains('active')) {
                        const titleEl = questionBtn.querySelector('span');
                        const qText = titleEl ? titleEl.textContent.trim() : questionBtn.textContent.trim();
                        emitEvent('faq_open', {
                            question_index: idx + 1,
                            question_text: qText.slice(0, 120)
                        });
                    }
                }, 0);
            });
        });

        // 6. Tempo ativo de leitura na página (15s, 30s, 60s)
        window.setInterval(() => {
            if (document.visibilityState === 'hidden') return;
            state.engagedSeconds += 5;
            [15, 30, 60].forEach((sec) => {
                if (state.engagedSeconds >= sec && !state.timeMilestones.has(sec)) {
                    state.timeMilestones.add(sec);
                    emitEvent('engaged_time', {
                        seconds: sec,
                        last_section: state.lastSectionSeen
                    });
                }
            });
        }, 5000);
    });
})();
