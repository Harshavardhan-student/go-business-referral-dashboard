// Single source of truth for API endpoints.
// Spec requires these exact host/path values — don't tweak per-call.

export const AUTH_SIGNIN_URL =
  "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin";

export const REFERRALS_BASE_URL =
  "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals";

// Performs an authenticated GET against the referrals API.
// queryParams is a plain object, e.g. { search: "pm", sort: "asc" }
export async function fetchReferrals(token, queryParams = {}) {
  const url = new URL(REFERRALS_BASE_URL);

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();

  return { response, responseJson };
}

// Spec: parser must work whether metrics/serviceSummary/referral/referrals
// live under `data` (the documented shape) OR sit flat beside each other
// at the top level (the "reference implementation" shape).
export function extractReferralsPayload(responseJson) {
  const container = responseJson?.data ?? responseJson ?? {};

  return {
    metrics: container.metrics ?? [],
    serviceSummary: container.serviceSummary ?? null,
    referral: container.referral ?? null,
    referrals: container.referrals ?? [],
  };
}


// Spec: the single-referral response can be the row itself sitting directly
// under `data` (most common), OR an entry inside a `referrals` array, OR
// (defensively) the raw payload could itself be an array. We try all three
// before declaring "not found." Compared as strings since URL params are
// always strings but API ids might be numbers.
export function extractSingleReferral(responseJson, id) {
  const container = responseJson?.data ?? responseJson ?? {};

  if (container && typeof container === "object" && "id" in container) {
    if (String(container.id) === String(id)) {
      return container;
    }
  }

  if (Array.isArray(container.referrals)) {
    const match = container.referrals.find((row) => String(row.id) === String(id));
    if (match) return match;
  }

  if (Array.isArray(container)) {
    const match = container.find((row) => String(row.id) === String(id));
    if (match) return match;
  }

  return null;
}