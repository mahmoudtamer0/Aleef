// src/lib/tracker.ts

const API = process.env.NEXT_PUBLIC_API_URL;

const VISITOR_KEY = 'aleef_vid';
const SESSION_KEY = 'aleef_sid';

// visitor id: lives in localStorage, so it's the same person across visits
function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

// session id: sessionStorage, so every new visit (new tab / browser reopened) is a new session.
// (with localStorage it never changed, so "Visits" would stay 1 forever)
function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function getUTM() {
  const params = new URLSearchParams(location.search);

  return {
    source: params.get('utm_source') ?? params.get('ref'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
  };
}

function post(path: string, body: unknown) {
  fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

export function track(path: string = location.pathname) {
  if (!API || typeof window === 'undefined') return;

  post('/track/pageview', {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    path,
    title: document.title,
    referrer: document.referrer,
    screen: `${screen.width}x${screen.height}`,
    language: navigator.language,
    utm: getUTM(),
  });
}

// custom actions, e.g. trackEvent('create_account_click')
// name: lowercase letters, numbers and _ only
export function trackEvent(name: string, metadata?: Record<string, unknown>) {
  if (!API || typeof window === 'undefined') return;

  post('/track/event', {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    name,
    path: location.pathname,
    metadata,
  });
}