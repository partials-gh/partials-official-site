/**
 * cleanup-shares.js
 * Runs daily via GitHub Actions.
 * Reads the index bin, deletes any entries older than 24h,
 * deletes their corresponding HTML bins, and writes the cleaned index back.
 */

const API_KEY      = process.env.JSONBIN_API_KEY;
const INDEX_BIN_ID = process.env.JSONBIN_INDEX_BIN_ID;
const BASE         = 'https://api.jsonbin.io/v3';
const EXPIRY_MS    = 24 * 60 * 60 * 1000; // 24 hours

if (!API_KEY || !INDEX_BIN_ID) {
  console.error('❌  Missing JSONBIN_API_KEY or JSONBIN_INDEX_BIN_ID env vars.');
  console.error('    Set them as GitHub Actions secrets (see README).');
  process.exit(1);
}

const HEADERS = {
  'Content-Type': 'application/json',
  'X-Master-Key':    API_KEY,
  'X-Bin-Versioning': 'false'
};

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { headers: HEADERS, ...options });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
  return JSON.parse(text);
}

async function main() {
  console.log('🔍  Fetching share index…');
  const data  = await fetchJSON(`${BASE}/b/${INDEX_BIN_ID}/latest`);
  const index = data.record || {};

  const now     = Date.now();
  const entries = Object.entries(index);
  console.log(`📦  Found ${entries.length} share code(s) in index.`);

  const expired = entries.filter(([, v]) => now - v.ts > EXPIRY_MS);
  const kept    = entries.filter(([, v]) => now - v.ts <= EXPIRY_MS);

  if (expired.length === 0) {
    console.log('✅  Nothing to clean up — all codes are still fresh.');
    return;
  }

  console.log(`🗑️   Deleting ${expired.length} expired code(s)…`);

  // Delete each expired HTML bin (best-effort, don't fail if one is already gone)
  for (const [code, entry] of expired) {
    try {
      await fetch(`${BASE}/b/${entry.binId}`, {
        method: 'DELETE',
        headers: HEADERS
      });
      console.log(`  ✓ Deleted bin for code ${code} (binId: ${entry.binId})`);
    } catch (err) {
      console.warn(`  ⚠ Could not delete bin for ${code}: ${err.message}`);
    }
  }

  // Write cleaned index back
  const cleanedIndex = Object.fromEntries(kept);
  await fetchJSON(`${BASE}/b/${INDEX_BIN_ID}`, {
    method: 'PUT',
    body: JSON.stringify(cleanedIndex)
  });

  console.log(`✅  Done. Removed ${expired.length} expired code(s), kept ${kept.length}.`);
}

main().catch(err => {
  console.error('❌  Cleanup failed:', err.message);
  process.exit(1);
});
