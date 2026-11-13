// src/lib/tracker.ts

const API = process.env.NEXT_PUBLIC_API_URL;

const VISITOR_KEY = 'aleef_vid';
const SESSION_KEY = 'aleef_sid';
const MIN_DWELL_MS = 3000; 

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


let automated: boolean | null = null;

function looksAutomated(): boolean {
  if (automated !== null) return automated;
  automated = check();
  return automated;
}

function check(): boolean {
  const ua = navigator.userAgent;
  const platform = navigator.platform || '';

  if (navigator.webdriver) return true;
  if (/HeadlessChrome|PhantomJS|Lighthouse/i.test(ua)) return true;

  if (/Macintosh/.test(ua) && !/Mac/.test(platform)) return true;
  if (/Windows NT/.test(ua) && !/Win/.test(platform)) return true;

  try {
    const gl = document.createElement('canvas').getContext('webgl');
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    if (gl && ext) {
      const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
      if (/SwiftShader|llvmpipe/i.test(renderer)) return true;
    }
  } catch {
    /* ignore */
  }

  return false;
}


const HUMAN_EVENTS = ['pointermove', 'scroll', 'keydown', 'touchstart', 'click'];
const loadedAt = typeof window === 'undefined' ? 0 : Date.now();
let human = false;
let listening = false;
const queue: Array<() => void> = [];

function release() {
  if (human) return;
  human = true;
  HUMAN_EVENTS.forEach((e) => window.removeEventListener(e, onInteract));

  const wait = Math.max(0, MIN_DWELL_MS - (Date.now() - loadedAt));
  setTimeout(() => queue.splice(0).forEach((fn) => fn()), wait); 
}

function onInteract(e: Event) {
  if (!e.isTrusted) return; 
  release();
}

function whenHuman(fn: () => void) {
  if (human) {
    fn();
    return;
  }
  queue.push(fn);
  if (!listening) {
    listening = true;
    HUMAN_EVENTS.forEach((e) => window.addEventListener(e, onInteract, { passive: true }));
  }
}


export function track(path: string = location.pathname) {
  if (!API || typeof window === 'undefined') return;
  if (looksAutomated()) return;

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
  if (looksAutomated()) return;

  release();

  whenHuman(() =>
    post('/track/event', {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      name,
      path: location.pathname,
      metadata,
    }),
  );
}