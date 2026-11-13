const API = process.env.NEXT_PUBLIC_API_URL;

const VISITOR_KEY = 'aleef_vid';
const SESSION_KEY = 'aleef_sid';

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


const HUMAN_EVENTS = ['pointermove', 'scroll', 'keydown', 'touchstart', 'click'];
let human = false;
let listening = false;
const queue: Array<() => void> = [];

function markHuman() {
  if (human) return;
  human = true;
  HUMAN_EVENTS.forEach((e) => window.removeEventListener(e, markHuman));
  queue.splice(0).forEach((fn) => fn());
}

function whenHuman(fn: () => void) {
  if (human) {
    fn();
    return;
  }
  queue.push(fn);
  if (!listening) {
    listening = true;
    HUMAN_EVENTS.forEach((e) => window.addEventListener(e, markHuman, { passive: true }));
  }
}

export function track(path: string = location.pathname) {
  if (!API || typeof window === 'undefined') return;
  if (navigator.webdriver) return;

  const data = {
    path,
    title: document.title,
    referrer: document.referrer,
    screen: `${screen.width}x${screen.height}`,
    language: navigator.language,
    utm: getUTM(),
  };

  whenHuman(() =>
    post('/track/pageview', { visitorId: getVisitorId(), sessionId: getSessionId(), ...data }),
  );
}

export function trackEvent(name: string, metadata?: Record<string, unknown>) {
  if (!API || typeof window === 'undefined') return;
  if (navigator.webdriver) return;

  markHuman();

  post('/track/event', {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    name,
    path: location.pathname,
    metadata,
  });
}