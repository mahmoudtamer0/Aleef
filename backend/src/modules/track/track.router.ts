import express, { Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import pool from '../../db';

const router = express.Router();

router.use(cors({ origin: true }));
router.use(express.json({ type: ['application/json', 'text/plain'], limit: '10kb' }));

router.post(
  ['/pageview', '/event'],
  rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }),
);

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const BOT =
  /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|monitor|uptime|curl|wget/i;

const clip = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.length ? v.slice(0, max) : null;

function clientInfo(req: Request) {
  const ua = String(req.headers['user-agent'] ?? '');
  const ip = (req.ip ?? '').replace('::ffff:', '');
  const geo = ip ? geoip.lookup(ip) : null;
  const parsed = new UAParser(ua).getResult();

  return {
    ua,
    isBot: !ua || BOT.test(ua),
    country: geo?.country ?? null,
    city: geo?.city || null,
    device: parsed.device.type ?? 'desktop',
    browser: parsed.browser.name ?? null,
    os: parsed.os.name ?? null,
  };
}

function hostOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '').slice(0, 100);
  } catch {
    return null;
  }
}


router.post('/pageview', async (req: Request, res: Response): Promise<void> => {
  const b = req.body ?? {};
  const c = clientInfo(req);

  if (c.isBot || !UUID.test(b.visitorId) || !UUID.test(b.sessionId) || typeof b.path !== 'string') {
    res.sendStatus(204);
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // visitor: create or refresh
    await client.query(
      `INSERT INTO visitors (id, country, city, device_type, browser, os, screen, language)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         last_seen   = now(),
         country     = COALESCE(EXCLUDED.country, visitors.country),
         city        = COALESCE(EXCLUDED.city, visitors.city),
         device_type = EXCLUDED.device_type,
         browser     = EXCLUDED.browser,
         os          = EXCLUDED.os,
         screen      = COALESCE(EXCLUDED.screen, visitors.screen),
         language    = COALESCE(EXCLUDED.language, visitors.language)`,
      [b.visitorId, c.country, c.city, c.device, c.browser, c.os, clip(b.screen, 20), clip(b.language, 20)],
    );

    // session (xmax = 0 means the row was just inserted = a new visit)
    const s = await client.query(
      `INSERT INTO visit_sessions
         (id, visitor_id, landing_path, referrer_host, utm_source, utm_medium, utm_campaign,
          user_agent, language, page_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1)
       ON CONFLICT (id) DO UPDATE SET
         last_activity_at = now(),
         page_count       = visit_sessions.page_count + 1
       RETURNING (xmax = 0) AS is_new`,
      [
        b.sessionId,
        b.visitorId,
        clip(b.path, 500),
        hostOf(clip(b.referrer, 500)),
        clip(b.utm?.source, 100),
        clip(b.utm?.medium, 100),
        clip(b.utm?.campaign, 100),
        c.ua.slice(0, 400),
        clip(b.language, 20),
      ],
    );

    if (s.rows[0]?.is_new) {
      await client.query('UPDATE visitors SET visit_count = visit_count + 1 WHERE id = $1', [b.visitorId]);
    }

    await client.query(
      `INSERT INTO page_views (session_id, visitor_id, path, title) VALUES ($1, $2, $3, $4)`,
      [b.sessionId, b.visitorId, clip(b.path, 500), clip(b.title, 200)],
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[track] pageview failed:', err);
  } finally {
    client.release();
  }

  res.sendStatus(204);
});

/* ----------------------------- POST /event ----------------------------- */

router.post('/event', async (req: Request, res: Response): Promise<void> => {
  const b = req.body ?? {};
  const c = clientInfo(req);

  if (
    c.isBot ||
    !UUID.test(b.visitorId) ||
    !UUID.test(b.sessionId) ||
    typeof b.name !== 'string' ||
    !/^[a-z0-9_]{1,50}$/.test(b.name)
  ) {
    res.sendStatus(204);
    return;
  }

  let metadata: string | null = null;
  if (b.metadata && typeof b.metadata === 'object') {
    try {
      const json = JSON.stringify(b.metadata);
      if (json.length <= 2000) metadata = json;
    } catch {
      metadata = null;
    }
  }

<<<<<<< HEAD
  try {
    await pool.query(
      `INSERT INTO track_events (session_id, visitor_id, name, path, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [b.sessionId, b.visitorId, b.name, clip(b.path, 500), metadata],
    );
    await pool.query('UPDATE visit_sessions SET last_activity_at = now() WHERE id = $1', [b.sessionId]);
  } catch (err) {
    console.error('[track] event failed:', err);
  }
=======


// function requireAdmin(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void {
//   const key = process.env['TRACKING_ADMIN_KEY'] ?? '';
//   const sent = String(req.headers['x-admin-key'] ?? '');
>>>>>>> 1e7723a2f3b298bc55ab24f0d8723d2c4b7f1977

  res.sendStatus(204);
});

/* ----------------------------- GET /visitors ----------------------------- */
// ?range=today | 2d | week | month | all   (rolling windows, based on last visit)

const RANGE_HOURS: Record<string, number> = { today: 24, '2d': 48, week: 24 * 7, month: 24 * 30 };

router.get('/visitors', async (req: Request, res: Response): Promise<void> => {
  const hours = RANGE_HOURS[String(req.query['range'] ?? 'today')];
  const since = hours ? new Date(Date.now() - hours * 60 * 60 * 1000) : null; // null = all

  try {
    const { rows } = await pool.query(
      `SELECT v.id, v.country, v.city, v.device_type, v.browser, v.os, v.screen, v.language,
              v.visit_count, v.first_seen, v.last_seen,
              fs.utm_source, fs.referrer_host,
              (SELECT COUNT(*) FROM page_views p WHERE p.visitor_id = v.id)::int
                + (SELECT COUNT(*) FROM track_events e WHERE e.visitor_id = v.id)::int AS actions,
              COUNT(*) OVER()::int AS total
         FROM visitors v
         LEFT JOIN LATERAL (
           SELECT utm_source, referrer_host
             FROM visit_sessions s
            WHERE s.visitor_id = v.id
            ORDER BY s.started_at
            LIMIT 1
         ) fs ON true
        WHERE ($1::timestamptz IS NULL OR v.last_seen >= $1)
        ORDER BY v.last_seen DESC
        LIMIT 500`,
      [since],
    );

    res.json({ total: rows[0]?.total ?? 0, visitors: rows });
  } catch (err) {
    console.error('[track] visitors failed:', err);
    res.status(500).json({ error: 'visitors_failed' });
  }
});

/* -------------------------- GET /visitors/:id -------------------------- */
// everything one visitor did: page views + events, oldest first

router.get('/visitors/:id', async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params['id']);
  if (!UUID.test(id)) {
    res.sendStatus(400);
    return;
  }

  try {
    const [pages, events] = await Promise.all([
      pool.query(
        `SELECT 'page' AS type, path AS label, title AS detail, viewed_at AS at
           FROM page_views WHERE visitor_id = $1 ORDER BY viewed_at DESC LIMIT 300`,
        [id],
      ),
      pool.query(
        `SELECT 'event' AS type, name AS label, path AS detail, created_at AS at, metadata
           FROM track_events WHERE visitor_id = $1 ORDER BY created_at DESC LIMIT 300`,
        [id],
      ),
    ]);

    const timeline = [...pages.rows, ...events.rows].sort(
      (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
    );

    res.json({ timeline });
  } catch (err) {
    console.error('[track] visitor detail failed:', err);
    res.status(500).json({ error: 'visitor_failed' });
  }
});

export default router;