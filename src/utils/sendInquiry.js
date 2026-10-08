// Sends the contact form to the API and reports what really happened, so the page can show
// "received" only when the server did receive it (and a clear error otherwise).

const TIMEOUT_MS = 60000; // a sleeping free-tier server can take close to a minute to wake up

/**
 * @param {{ name: string, email: string, country?: string, service?: string, message: string }} fields
 * @returns {Promise<{ ok: true } | { ok: false, error: string }>}
 */
export const sendInquiry = async (fields) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
      signal: controller.signal,
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      /* not JSON (e.g. a proxy error page) */
    }

    if (res.ok && data?.success) return { ok: true };
    // The server's own message is written for visitors (validation, rate limit); anything else is generic.
    if (res.status === 400 || res.status === 429) {
      return { ok: false, error: data?.error || "Please check the form and try again." };
    }
    return { ok: false, error: "We couldn't send your message right now." };
  } catch (err) {
    return {
      ok: false,
      error: err?.name === "AbortError" ? "The server took too long to respond." : "We couldn't reach the server.",
    };
  } finally {
    clearTimeout(timer);
  }
};
