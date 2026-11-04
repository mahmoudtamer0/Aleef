
import express, { Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import pool from '../../db';

const router = express.Router();

router.use(
  cors({
    origin: true,
    allowedHeaders: ['Content-Type', 'x-admin-key'],
  }),
);

router.use(
  express.json({
    type: ['application/json', 'text/plain'],
    limit: '10kb',
  }),
);

const limiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(['/pageview', '/event', '/leave'], limiter);


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

    ipHash: crypto
      .createHash('sha256')
      .update(ip + (process.env['TRACKING_IP_SALT'] ?? ''))
      .digest('hex'),

    country:
      (req.headers['cf-ipcountry'] as string | undefined)?.slice(0, 2) ??
      geo?.country ??
      null,

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


router.post(
  '/pageview',
  async (req: Request, res: Response): Promise<void> => {
    const b = req.body ?? {};
    const c = clientInfo(req);

    if (
      c.isBot ||
      !UUID.test(b.visitorId) ||
      !UUID.test(b.sessionId) ||
      typeof b.path !== 'string'
    ) {
      res.sendStatus(204);
      return;
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO visitors
          (id, country, city, device_type, browser, os)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           last_seen = now(),
           country = COALESCE(EXCLUDED.country, visitors.country),
           city = COALESCE(EXCLUDED.city, visitors.city),
           device_type = EXCLUDED.device_type,
           browser = EXCLUDED.browser,
           os = EXCLUDED.os`,
        [
          b.visitorId,
          c.country,
          c.city,
          c.device,
          c.browser,
          c.os,
        ],
      );

      const s = await client.query(
        `INSERT INTO visit_sessions
          (
            id,
            visitor_id,
            landing_path,
            referrer_host,
            utm_source,
            utm_medium,
            utm_campaign,
            ip_hash,
            user_agent,
            screen_width,
            language,
            page_count
          )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 1)
         ON CONFLICT (id) DO UPDATE SET
           last_activity_at = now(),
           page_count = visit_sessions.page_count + 1
         RETURNING (xmax = 0) AS is_new`,
        [
          b.sessionId,
          b.visitorId,
          clip(b.path, 500),
          hostOf(clip(b.referrer, 500)),
          clip(b.utm?.source, 100),
          clip(b.utm?.medium, 100),
          clip(b.utm?.campaign, 100),
          c.ipHash,
          c.ua.slice(0, 400),
          Number.isInteger(b.screenWidth) ? b.screenWidth : null,
          clip(b.language, 20),
        ],
      );

      if (s.rows[0]?.is_new) {
        await client.query(
          `UPDATE visitors
           SET visit_count = visit_count + 1
           WHERE id = $1`,
          [b.visitorId],
        );
      }

      // 4. Insert page view.
      const pv = await client.query(
        `INSERT INTO page_views
          (session_id, visitor_id, path, title)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [
          b.sessionId,
          b.visitorId,
          clip(b.path, 500),
          clip(b.title, 200),
        ],
      );

      await client.query('COMMIT');

      res.json({
        pageViewId: String(pv.rows[0].id),
      });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});

      console.error('[track] pageview failed:', err);

      res.sendStatus(204);
    } finally {
      client.release();
    }
  },
);


router.post(
  '/event',
  async (req: Request, res: Response): Promise<void> => {
    const b = req.body ?? {};
    const c = clientInfo(req);

    if (
      c.isBot ||
      !UUID.test(b.visitorId) ||
      !UUID.test(b.sessionId)
    ) {
      res.sendStatus(204);
      return;
    }

    if (
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

        if (json.length <= 2000) {
          metadata = json;
        }
      } catch {
        metadata = null;
      }
    }

    try {
      await pool.query(
        `INSERT INTO track_events
          (session_id, visitor_id, name, path, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          b.sessionId,
          b.visitorId,
          b.name,
          clip(b.path, 500),
          metadata,
        ],
      );

      await pool.query(
        `UPDATE visit_sessions
         SET last_activity_at = now()
         WHERE id = $1`,
        [b.sessionId],
      );
    } catch (err) {
      console.error('[track] event failed:', err);
    }

    res.sendStatus(204);
  },
);



router.post(
  '/leave',
  async (req: Request, res: Response): Promise<void> => {
    const b = req.body ?? {};

    if (
      !UUID.test(b.sessionId) ||
      !/^\d{1,18}$/.test(String(b.pageViewId))
    ) {
      res.sendStatus(204);
      return;
    }

    const seconds = Math.min(
      Math.max(Math.round(Number(b.seconds) || 0), 0),
      1800,
    );

    try {
      await pool.query(
        `UPDATE page_views
         SET duration_seconds =
           COALESCE(duration_seconds, 0) + $1
         WHERE id = $2 AND session_id = $3`,
        [seconds, b.pageViewId, b.sessionId],
      );

      await pool.query(
        `UPDATE visit_sessions
         SET last_activity_at = now()
         WHERE id = $1`,
        [b.sessionId],
      );
    } catch (err) {
      console.error('[track] leave failed:', err);
    }

    res.sendStatus(204);
  },
);




// function requireAdmin(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void {
//   const key = process.env['TRACKING_ADMIN_KEY'] ?? '';
//   const sent = String(req.headers['x-admin-key'] ?? '');

//   const a = Buffer.from(sent);
//   const b = Buffer.from(key);

//   if (
//     !key ||
//     a.length !== b.length ||
//     !crypto.timingSafeEqual(a, b)
//   ) {
//     res.status(401).json({
//       error: 'unauthorized',
//     });
//     return;
//   }

//   next();
// }

router.get(
  '/stats',
  async (req: Request, res: Response): Promise<void> => {
    const days = Math.min(
      Math.max(parseInt(String(req.query['days']), 10) || 30, 1),
      365,
    );

    const since = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000,
    );

    const TZ = 'Africa/Cairo';

    const breakdown = (col: 'device_type' | 'browser' | 'os') =>
      pool.query(
        `SELECT
           COALESCE(v.${col}, 'Unknown') AS label,
           COUNT(*)::int AS value
         FROM visit_sessions s
         JOIN visitors v ON v.id = s.visitor_id
         WHERE s.started_at >= $1
         GROUP BY 1
         ORDER BY 2 DESC
         LIMIT 8`,
        [since],
      );

    try {
      const [
        totals,
        daily,
        pages,
        referrers,
        countries,
        devices,
        browsers,
        systems,
        events,
        recent,
        live,
      ] = await Promise.all([
        // Totals.
        pool.query(
          `SELECT
             COUNT(DISTINCT s.visitor_id)::int AS visitors,
             COUNT(*)::int AS sessions,
             COALESCE(SUM(s.page_count), 0)::int AS pageviews,
             COALESCE(
               ROUND(
                 AVG(
                   EXTRACT(
                     EPOCH FROM (
                       s.last_activity_at - s.started_at
                     )
                   )
                 )
               ),
               0
             )::int AS avg_duration,
             COALESCE(
               ROUND(
                 100.0 * COUNT(*) FILTER (
                   WHERE s.page_count <= 1
                 ) / NULLIF(COUNT(*), 0)
               ),
               0
             )::int AS bounce_rate,
             COUNT(DISTINCT s.visitor_id)
               FILTER (WHERE v.first_seen >= $1)::int AS new_visitors
           FROM visit_sessions s
           JOIN visitors v ON v.id = s.visitor_id
           WHERE s.started_at >= $1`,
          [since],
        ),

        // Daily statistics.
        pool.query(
          `WITH days AS (
             SELECT generate_series(
               ($1::timestamptz AT TIME ZONE '${TZ}')::date,
               (now() AT TIME ZONE '${TZ}')::date,
               interval '1 day'
             )::date AS d
           )
           SELECT
             to_char(days.d, 'YYYY-MM-DD') AS day,
             COALESCE(s.visitors, 0)::int AS visitors,
             COALESCE(s.sessions, 0)::int AS sessions,
             COALESCE(p.views, 0)::int AS pageviews
           FROM days
           LEFT JOIN (
             SELECT
               (started_at AT TIME ZONE '${TZ}')::date AS d,
               COUNT(DISTINCT visitor_id) AS visitors,
               COUNT(*) AS sessions
             FROM visit_sessions
             WHERE started_at >= $1
             GROUP BY 1
           ) s ON s.d = days.d
           LEFT JOIN (
             SELECT
               (viewed_at AT TIME ZONE '${TZ}')::date AS d,
               COUNT(*) AS views
             FROM page_views
             WHERE viewed_at >= $1
             GROUP BY 1
           ) p ON p.d = days.d
           ORDER BY days.d`,
          [since],
        ),

        // Top pages.
        pool.query(
          `SELECT
             path,
             COUNT(*)::int AS views,
             COUNT(DISTINCT visitor_id)::int AS visitors,
             COALESCE(ROUND(AVG(duration_seconds)), 0)::int AS avg_seconds
           FROM page_views
           WHERE viewed_at >= $1
           GROUP BY path
           ORDER BY views DESC
           LIMIT 10`,
          [since],
        ),

        // Referrers.
        pool.query(
          `SELECT
             COALESCE(referrer_host, 'Direct') AS label,
             COUNT(*)::int AS value
           FROM visit_sessions
           WHERE started_at >= $1
           GROUP BY 1
           ORDER BY 2 DESC
           LIMIT 10`,
          [since],
        ),

        // Countries.
        pool.query(
          `SELECT
             COALESCE(v.country, '??') AS label,
             COUNT(*)::int AS value
           FROM visit_sessions s
           JOIN visitors v ON v.id = s.visitor_id
           WHERE s.started_at >= $1
           GROUP BY 1
           ORDER BY 2 DESC
           LIMIT 10`,
          [since],
        ),

        // Devices, browsers and operating systems.
        breakdown('device_type'),
        breakdown('browser'),
        breakdown('os'),

        // Events.
        pool.query(
          `SELECT
             name,
             COUNT(*)::int AS total,
             COUNT(DISTINCT visitor_id)::int AS visitors
           FROM track_events
           WHERE created_at >= $1
           GROUP BY name
           ORDER BY total DESC`,
          [since],
        ),

        // Recent sessions.
        pool.query(
          `SELECT
             s.id,
             s.started_at,
             s.landing_path,
             COALESCE(s.referrer_host, 'Direct') AS source,
             s.page_count,
             EXTRACT(
               EPOCH FROM (
                 s.last_activity_at - s.started_at
               )
             )::int AS duration,
             v.country,
             v.city,
             v.device_type,
             v.browser,
             v.os,
             v.visit_count
           FROM visit_sessions s
           JOIN visitors v ON v.id = s.visitor_id
           ORDER BY s.started_at DESC
           LIMIT 15`,
        ),

        // Live visitors (last 5 minutes).
        pool.query(
          `SELECT COUNT(*)::int AS n
           FROM visit_sessions
           WHERE last_activity_at > now() - interval '5 minutes'`,
        ),
      ]);

      res.json({
        days,
        totals: totals.rows[0],
        daily: daily.rows,
        pages: pages.rows,
        referrers: referrers.rows,
        countries: countries.rows,
        devices: devices.rows,
        browsers: browsers.rows,
        systems: systems.rows,
        events: events.rows,
        recent: recent.rows,
        live: live.rows[0].n,
      });
    } catch (err) {
      console.error('[track] stats failed:', err);

      res.status(500).json({
        error: 'stats_failed',
      });
    }
  },
);

export default router;
