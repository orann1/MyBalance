// Minimal typed client for the Data.gov.il CKAN `datastore_search` endpoint.
// `datastore_search_sql` is blocked/unreliable on Data.gov.il and must not be used.
// See Context/api-data-sources.md for endpoint notes.

const DATASTORE_SEARCH_URL = "https://data.gov.il/api/3/action/datastore_search";
const DEFAULT_TIMEOUT_MS = 20_000;

export class DataGovApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataGovApiError";
  }
}

export interface DatastoreSearchParams {
  resourceId: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, string | number>;
  q?: string;
}

export interface DatastoreSearchField {
  id: string;
  type: string;
}

export interface DatastoreSearchResult<T> {
  records: T[];
  total: number;
  fields: DatastoreSearchField[];
}

interface CkanDatastoreSearchResponse<T> {
  success: boolean;
  error?: unknown;
  result?: {
    records?: T[];
    total?: number;
    fields?: DatastoreSearchField[];
  };
}

function safeErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return "unknown CKAN error";
}

/**
 * Calls the CKAN `datastore_search` action only. A 200 response can still carry
 * `{ success: false }` — that is treated as an error here so callers never have
 * to re-check `success` themselves.
 */
export async function datastoreSearch<T = Record<string, unknown>>(
  params: DatastoreSearchParams,
  options: { timeoutMs?: number } = {},
): Promise<DatastoreSearchResult<T>> {
  const url = new URL(DATASTORE_SEARCH_URL);
  url.searchParams.set("resource_id", params.resourceId);
  if (params.limit !== undefined) url.searchParams.set("limit", String(params.limit));
  if (params.offset !== undefined) url.searchParams.set("offset", String(params.offset));
  if (params.q) url.searchParams.set("q", params.q);
  if (params.filters) url.searchParams.set("filters", JSON.stringify(params.filters));

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url.toString(), { signal: controller.signal });
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    throw new DataGovApiError(
      isAbort
        ? `Data.gov.il request timed out after ${timeoutMs}ms for resource ${params.resourceId}`
        : `Data.gov.il request failed for resource ${params.resourceId}: ${
            err instanceof Error ? err.message : "unknown network error"
          }`,
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new DataGovApiError(
      `Data.gov.il returned HTTP ${response.status} for resource ${params.resourceId}`,
    );
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new DataGovApiError(
      `Data.gov.il returned an invalid JSON response for resource ${params.resourceId}`,
    );
  }

  const parsed = json as CkanDatastoreSearchResponse<T>;
  if (!parsed || parsed.success !== true || !parsed.result) {
    throw new DataGovApiError(
      `Data.gov.il datastore_search failed for resource ${params.resourceId}: ${safeErrorMessage(parsed?.error)}`,
    );
  }

  return {
    records: parsed.result.records ?? [],
    total: parsed.result.total ?? parsed.result.records?.length ?? 0,
    fields: parsed.result.fields ?? [],
  };
}

/**
 * Sequential page-by-page iterator over a resource's records. Sequential by
 * design — avoid aggressive parallelism against a public, non-SLA API.
 */
export async function* paginateDatastoreSearch<T = Record<string, unknown>>(
  resourceId: string,
  pageSize: number,
  options: { timeoutMs?: number } = {},
): AsyncGenerator<T[]> {
  let offset = 0;

  for (;;) {
    const page = await datastoreSearch<T>(
      { resourceId, limit: pageSize, offset },
      options,
    );

    if (page.records.length === 0) {
      return;
    }

    yield page.records;

    offset += page.records.length;
    if (page.records.length < pageSize) {
      return;
    }
    if (page.total > 0 && offset >= page.total) {
      return;
    }
  }
}
