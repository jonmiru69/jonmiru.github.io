import { getStore } from "@netlify/blobs";

const STATE_KEY = "portfolio_state";
const OWNER_KEY = process.env.OWNER_KEY || "04270427";

// ── helpers ──────────────────────────────────────────────────────────────────
function isBase64Image(v) {
  return typeof v === "string" && v.startsWith("data:image");
}
function isBase64(v) {
  return typeof v === "string" && v.startsWith("data:");
}

/**
 * Strip all base64 blobs from state and collect them separately.
 * Returns { lean, blobs } where:
 *   lean  = state with base64 replaced by blob-key references "__blob:<key>"
 *   blobs = Map<key, base64string>
 */
function extractBlobs(state) {
  const blobs = new Map();
  const lean = JSON.parse(JSON.stringify(state)); // deep clone

  const blobKey = (prefix) => `${prefix}_${Date.now().toString(36)}`;

  // profile photo
  if (isBase64(lean.profile?.photo)) {
    const k = "photo__profile";
    blobs.set(k, lean.profile.photo);
    lean.profile.photo = `__blob:${k}`;
  }

  // category items: logo + attachment urls
  for (const cat of lean.categories || []) {
    for (const item of cat.items || []) {
      if (isBase64(item.logo)) {
        const k = `logo__${cat.id}__${item.id}`;
        blobs.set(k, item.logo);
        item.logo = `__blob:${k}`;
      }
      for (const att of item.attachments || []) {
        if (isBase64(att.url)) {
          const k = `att__${cat.id}__${item.id}__${att.id}`;
          blobs.set(k, att.url);
          att.url = `__blob:${k}`;
        }
      }
    }
  }

  return { lean, blobs };
}

/**
 * Re-inflate state by replacing __blob:<key> references with actual data.
 */
async function inflateBlobs(lean, store) {
  const state = JSON.parse(JSON.stringify(lean));

  async function resolve(v) {
    if (typeof v === "string" && v.startsWith("__blob:")) {
      const k = v.slice(7);
      try {
        const data = await store.get(k);
        return data || v;
      } catch {
        return v;
      }
    }
    return v;
  }

  if (state.profile?.photo) state.profile.photo = await resolve(state.profile.photo);

  for (const cat of state.categories || []) {
    for (const item of cat.items || []) {
      item.logo = await resolve(item.logo);
      for (const att of item.attachments || []) {
        att.url = await resolve(att.url);
      }
    }
  }

  return state;
}

// ── handler ──────────────────────────────────────────────────────────────────
export default async function handler(req) {
  const store = getStore("portfolio");

  // ── GET — load state ──────────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const lean = await store.get(STATE_KEY, { type: "json" });
      if (!lean) {
        return new Response(JSON.stringify({ state: null }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      const state = await inflateBlobs(lean, store);
      return new Response(JSON.stringify({ state }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // ── POST — save state ─────────────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      let body;
      try {
        body = await req.json();
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const { ownerKey, state } = body;
      if (ownerKey !== OWNER_KEY) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (!state) {
        return new Response(JSON.stringify({ error: "No state provided." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 1. Extract blobs to store separately
      const { lean, blobs } = extractBlobs(state);

      // 2. Save each blob independently (parallel, fire-and-wait)
      const blobSaves = [];
      for (const [k, v] of blobs.entries()) {
        blobSaves.push(store.set(k, v));
      }
      await Promise.all(blobSaves);

      // 3. Save lean state JSON (tiny — no base64)
      await store.set(STATE_KEY, JSON.stringify(lean));

      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || "Save failed." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed." }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}

export const config = { path: "/.netlify/functions/portfolio-state" };
