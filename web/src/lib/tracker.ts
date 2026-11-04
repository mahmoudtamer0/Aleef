
// src/lib/tracker.ts

const API =process.env.NEXT_PUBLIC_API_URL ;

const VISITOR_KEY = 'aleef_vid';
const SESSION_KEY = 'aleef_sid';

function getId(key: string): string {
  try {
    let id = localStorage.getItem(key);

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }

    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function getVisitorId(): string {
  return getId(VISITOR_KEY);
}

function getSessionId(): string {
  return getId(SESSION_KEY);
}

function getUTM() {
  const params = new URLSearchParams(location.search);

  return {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
  };
}

export function track(path: string = location.pathname) {
  if (!API || typeof window === 'undefined') return;

  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  fetch(`${API}/track/pageview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      visitorId,
      sessionId,
      path,
      title: document.title,
      referrer: document.referrer,
      screenWidth: screen.width,
      language: navigator.language,
      utm: getUTM(),
    }),
    keepalive: true,
  }).catch(() => {});
}
