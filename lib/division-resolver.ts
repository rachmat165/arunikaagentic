/**
 * Division Resolver Helper
 * Resolves division UUID from name, slug, or partial match.
 * Used by all API routes to normalize the divisionId param.
 */
import { query } from '@/lib/database';

// Cache division lookups within the process lifecycle to avoid repeat queries
const divisionCache = new Map<string, string>();

/**
 * Given a raw divisionId (which may be a UUID, a slug like "ceo-office",
 * or a display name like "CEO Office"), return the actual UUID.
 * Falls back gracefully and returns null if not found.
 */
export async function resolveDivisionId(rawId: string): Promise<string | null> {
  if (!rawId) return null;

  // If it already looks like a UUID, return as-is
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(rawId)) return rawId;

  // Check cache first
  const cacheKey = rawId.toLowerCase().trim();
  if (divisionCache.has(cacheKey)) {
    return divisionCache.get(cacheKey)!;
  }

  try {
    // Try exact slug match first, then name match (case-insensitive)
    const result = await query(
      `SELECT id FROM divisions
       WHERE slug = $1
          OR LOWER(name) = LOWER($1)
          OR LOWER(slug) = LOWER(REPLACE($1, ' ', '-'))
          OR LOWER(name) LIKE LOWER($2)
       LIMIT 1`,
      [rawId, `%${rawId}%`]
    );

    if (result.rows.length > 0) {
      const uuid = result.rows[0].id;
      divisionCache.set(cacheKey, uuid);
      return uuid;
    }
  } catch (err) {
    console.error('Error resolving division ID:', err);
  }

  return null;
}

/**
 * Map common frontend division param values to DB slugs
 */
export const DIVISION_SLUG_MAP: Record<string, string> = {
  ceo: 'ceo-office',
  'ceo office': 'ceo-office',
  'ceo-office': 'ceo-office',
  sales: 'sales-marketing',
  'sales & marketing': 'sales-marketing',
  'sales-marketing': 'sales-marketing',
  'sales & marketing division': 'sales-marketing',
  ops: 'ops-finance',
  'operations & finance': 'ops-finance',
  'ops-finance': 'ops-finance',
  'operations & finance division': 'ops-finance',
};
