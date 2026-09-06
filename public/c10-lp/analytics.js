(function () {
  'use strict';

  const PAGE = '/c10-lp/';
  const ENDPOINT = '/analytics/track';
  const VISIT_KEY = 'analytics_visit_tracked:' + PAGE;
  const SCROLL_MILESTONES = [25, 50, 75, 90];
  const trackedScrolls = new Set();
  const trackedSections = new Set();
  const params = new URLSearchParams(window.location.search);

  function eventId() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }

    return Date.now() + '-' + Math.random().toString(36).slice(2, 11);
  }

  function externalReferrer() {
    if (!document.referrer) return 'direct';

    try {
      return new URL(document.referrer).hostname === window.location.hostname
        ? 'direct'
        : document.referrer;
    } catch (_) {
      return 'direct';
    }
  }

  const referralSource = params.get('ref') || externalReferrer();

  function track(eventType, eventData) {
    const payload = {
      event_type: eventType,
      event_data: Object.assign({
        landing_source: PAGE,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      }, eventData || {}),
      referral_source: referralSource,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
    };

    return fetch(ENDPOINT, {
      method: 'POST',
      credentials: 'same-origin',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(function () {
      // Analytics must never interfere with the landing-page experience.
      return null;
    });
  }

  if (sessionStorage.getItem(VISIT_KEY) !== 'tracked') {
    sessionStorage.setItem(VISIT_KEY, 'pending');
    track('visit', { event_id: eventId() }).then(function (response) {
      if (response && response.ok) {
        sessionStorage.setItem(VISIT_KEY, 'tracked');
      } else {
        sessionStorage.removeItem(VISIT_KEY);
      }
    });
  }

  window.setTimeout(function () {
    track('engagement', { type: 'dwell_ping', duration: 15000, is_initial: true });
  }, 15000);

  window.addEventListener('scroll', function () {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    if (available <= 0) return;

    const depth = Math.round((window.scrollY / available) * 100);
    SCROLL_MILESTONES.forEach(function (milestone) {
      if (depth >= milestone && !trackedScrolls.has(milestone)) {
        trackedScrolls.add(milestone);
        track('scroll', { depth: milestone });
      }
    });
  }, { passive: true });

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const rawHref = link.getAttribute('href') || '';
    const destination = link.href || rawHref;
    const text = (link.textContent || link.getAttribute('aria-label') || '').trim().slice(0, 255);
    let url;

    try { url = new URL(destination, window.location.href); } catch (_) { return; }

    const isWhatsApp = url.hostname === 'wa.me' || url.hostname.endsWith('.whatsapp.com');
    const isCheckout = url.hostname === 'member.fullbrightindonesia.com';
    const isPricingCta = rawHref === '#pricing';

    if (!isWhatsApp && !isCheckout && !isPricingCta) return;

    const location = link.closest('[id]')?.id || (isWhatsApp ? 'whatsapp' : 'landing_page');
    track('cta_click', { location: location, text: text, destination: destination });

    if (isCheckout) {
      track('initiate_checkout', {
        type: 'external_payment_redirect',
        location: location,
        destination: destination,
        payment_url: destination,
        package: text,
        event_id: eventId(),
      });
    } else if (isWhatsApp) {
      track('conversion', { type: 'wa_inquiry', location: location, destination: destination });
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        const section = entry.target.id;
        if (!entry.isIntersecting || trackedSections.has(section)) return;

        trackedSections.add(section);
        track('section_view', { section: section });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    document.querySelectorAll('section[id]').forEach(function (section) {
      observer.observe(section);
    });
  }
})();
