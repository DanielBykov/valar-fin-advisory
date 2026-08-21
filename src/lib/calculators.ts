/**
 * Visibility switch for the standalone /calculators section, mirroring
 * INSIGHTS_LIVE in ./insights.ts. Calculator pages 404 in production until this
 * is flipped, but always render locally so the work can be reviewed before it
 * goes public. Flip to true and add the routes to sitemap.ts in the same commit.
 */
export const CALCULATORS_LIVE = false;
