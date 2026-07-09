"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Search, X, Info, Link2, Loader2 } from "lucide-react";
import { formatPercent, formatDate } from "@/lib/locale/formatters";
import {
  searchPublicFundsForMatchingAction,
  listGemelnetManagingCompaniesAction,
} from "@/lib/actions/public-fund-matching-actions";
import { linkManagedSavingsHoldingToPublicFund } from "@/lib/actions/public-fund-linking-actions";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";
import type { PublicFundMatchCandidate } from "@/lib/public-funds/search-types";

// Only the fields this modal actually reads. Loosened from the full
// ManagedSavingsInvestment type so the Add modal can pass a draft (no id
// yet, since the holding doesn't exist until save) alongside the Edit
// modal's real investment.
type PublicFundMatchInvestment = Pick<ManagedSavingsInvestment, "officialFundId"> & {
  id?: string;
};

interface PublicFundMatchModalProps {
  investment: PublicFundMatchInvestment;
  isOpen: boolean;
  onClose: () => void;
  // Edit flow (existing holding): links immediately via the dedicated
  // link action and returns the updated, serialized holding.
  onLinkSuccess?: (holding: ManagedSavingsInvestment) => void;
  // Add flow (no holding yet): select-only mode — the chosen candidate is
  // handed back to the caller and only persisted when the new holding is
  // saved. When provided, this takes priority over the immediate-link path.
  onSelectCandidate?: (candidate: PublicFundMatchCandidate) => void;
}

// Managed Savings products (Keren Hishtalmut, Kupat Gemel, Gemel LeHashkaa,
// Savings Policy) are non-pension. This modal only ever searches GemelNet —
// PensionNet is a separate, pension-related data source and is intentionally
// not selectable here. The backend (searchPublicFundsForMatching) still
// supports both sources for other future screens.
const MANAGED_SAVINGS_SOURCE = "gemelnet" as const;

const MAX_COMPANY_SUGGESTIONS = 20;

// Matches the search backend's MAX_SEARCH_LIMIT ceiling (src/lib/public-funds/search-types.ts).
// Previously 10 — too small when many funds from the same managing company
// tie on relevance score (e.g. 40 GemelNet "אנליסט" funds all score
// identically), pushing a relevant fund like fundId 963 just past the
// visible cutoff. 20 is the maximum the validated server action accepts.
const MAX_MODAL_RESULTS = 20;

// Default search query must never be prefilled with mock/internal track or
// company text (e.g. a generic mock track name) — it is very unlikely to
// match the actual public fund name and confuses users. Only a genuinely
// numeric officialFundId (which may be a real public fund number) is
// offered; otherwise the field starts empty and the user searches manually.
function buildInitialQuery(investment: PublicFundMatchInvestment): string {
  const officialId = investment.officialFundId?.trim();
  if (officialId && /^\d+$/.test(officialId)) {
    return officialId;
  }
  return "";
}

function isNumericFundNumber(value: string): boolean {
  return /^\d+$/.test(value.trim());
}

export function PublicFundMatchModal({
  investment,
  isOpen,
  onClose,
  onLinkSuccess,
  onSelectCandidate,
}: PublicFundMatchModalProps) {
  const t = useTranslations("managedSavings.publicFundLinking.modal");
  const tSource = useTranslations("managedSavings.publicFundLinking.sourceLabels");

  const [query, setQuery] = useState(() => buildInitialQuery(investment));
  const [candidates, setCandidates] = useState<PublicFundMatchCandidate[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [linkError, setLinkError] = useState(false);
  const [linkingFundId, setLinkingFundId] = useState<string | null>(null);
  const [isSearching, startSearch] = useTransition();
  const [isLinking, startLink] = useTransition();

  const [companies, setCompanies] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [possiblyTruncated, setPossiblyTruncated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listGemelnetManagingCompaniesAction().then((result) => {
      if (!cancelled && result.ok) setCompanies(result.companies);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSuggestions = useMemo(() => {
    const trimmed = query.trim();
    const pool = trimmed ? companies.filter((company) => company.includes(trimmed)) : companies;
    return pool.slice(0, MAX_COMPANY_SUGGESTIONS);
  }, [companies, query]);

  if (!isOpen) return null;

  const runSearch = (rawQuery: string) => {
    setSearchError(false);
    setLinkError(false);
    setShowSuggestions(false);
    setPossiblyTruncated(false);
    const trimmed = rawQuery.trim();
    startSearch(async () => {
      // Numeric-only input is treated as a fund number (fundId), not a
      // free-text query — fund numbers never appear in fundName/company text.
      const result = await searchPublicFundsForMatchingAction(
        isNumericFundNumber(trimmed)
          ? { fundId: trimmed, source: MANAGED_SAVINGS_SOURCE, limit: MAX_MODAL_RESULTS }
          : { query: trimmed || undefined, source: MANAGED_SAVINGS_SOURCE, limit: MAX_MODAL_RESULTS }
      );
      setHasSearched(true);
      if (result.ok) {
        setCandidates(result.candidates);
        // Heuristic: hitting the requested limit means there may be more
        // matches than shown (e.g. a managing company with many funds).
        // Not shown for exact fund-number lookups, which return at most one
        // match per source and would never legitimately hit this ceiling.
        setPossiblyTruncated(
          !isNumericFundNumber(trimmed) && result.candidates.length >= MAX_MODAL_RESULTS
        );
      } else {
        setCandidates([]);
        setSearchError(true);
      }
    });
  };

  const handleSearch = () => runSearch(query);

  const handleSelectSuggestion = (company: string) => {
    setQuery(company);
    runSearch(company);
  };

  const handleLink = (candidate: PublicFundMatchCandidate) => {
    // Add flow (no holding yet): hand the selection back to the caller.
    // Nothing is persisted here — the holding doesn't exist until save.
    if (onSelectCandidate) {
      onSelectCandidate(candidate);
      return;
    }

    // Edit flow (existing holding): link immediately.
    if (!investment.id) return;
    setLinkError(false);
    setLinkingFundId(candidate.publicFundId);
    startLink(async () => {
      const result = await linkManagedSavingsHoldingToPublicFund({
        holdingId: investment.id!,
        publicFundId: candidate.publicFundId,
      });
      setLinkingFundId(null);
      if (result.ok) {
        onLinkSuccess?.(result.holding);
      } else {
        setLinkError(true);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-md modal-backdrop-in">
      <div className="rounded-3xl bg-white border border-border/40 shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto modal-panel-in">
        {/* Header — fully opaque so scrolling results never show through */}
        <div className="sticky top-0 z-20 border-b border-border/60 bg-white px-6 py-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="rounded-lg bg-asset/20 p-2">
                  <Link2 className="h-5 w-5 text-asset" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>
              </div>
              <p className="text-sm text-muted-foreground ms-11">{t("subtitle")}</p>
            </div>
            <button
              onClick={onClose}
              disabled={isLinking}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg p-2 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Search controls — GemelNet only, no source selector (Managed Savings is non-pension) */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder={t("searchPlaceholder")}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-border/50 bg-white shadow-lg">
                  <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    {t("companySuggestionsTitle")}
                  </p>
                  {filteredSuggestions.map((company) => (
                    <button
                      key={company}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(company);
                      }}
                      className="block w-full text-start px-3 py-2 text-xs text-foreground hover:bg-secondary/40 transition-colors"
                    >
                      {company}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-asset rounded-lg hover:bg-asset/85 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-50 shrink-0"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {t("searchButton")}
            </button>
          </div>

          <p className="text-xs text-muted-foreground -mt-2">{t("searchHelper")}</p>

          {/* Disclaimer */}
          <div className="rounded-xl bg-blue-50/60 border border-blue-200/40 p-4 space-y-1.5">
            <div className="flex items-start gap-2">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-600" />
              <p className="text-xs text-blue-900">{t("gemelnetOnlyNote")}</p>
            </div>
            <div className="flex items-start gap-2">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-600" />
              <p className="text-xs text-blue-900">{t("note1")}</p>
            </div>
            <div className="flex items-start gap-2">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-600" />
              <p className="text-xs text-blue-900">{t("note2")}</p>
            </div>
          </div>

          {/* Link error */}
          {linkError && (
            <div className="rounded-xl bg-red-50 border border-red-200/60 p-4">
              <p className="text-xs text-red-800">{t("errorLink")}</p>
            </div>
          )}

          {/* Results */}
          <div className="space-y-3">
            {isSearching && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("loading")}
              </div>
            )}

            {!isSearching && searchError && (
              <div className="rounded-xl bg-red-50 border border-red-200/60 p-4">
                <p className="text-xs text-red-800">{t("errorSearch")}</p>
              </div>
            )}

            {!isSearching && !searchError && hasSearched && candidates.length === 0 && (
              <div className="rounded-xl border border-border/40 bg-secondary/20 p-6 text-center">
                <p className="text-sm text-muted-foreground">{t("emptyResults")}</p>
              </div>
            )}

            {!isSearching && !searchError && possiblyTruncated && candidates.length > 0 && (
              <div className="flex items-start gap-2 rounded-xl bg-blue-50/60 border border-blue-200/40 p-3">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-600" />
                <p className="text-xs text-blue-900">{t("truncatedResultsNote")}</p>
              </div>
            )}

            {!isSearching &&
              candidates.map((candidate) => (
                <div
                  key={candidate.publicFundId}
                  className="rounded-xl border border-border/40 bg-card p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm text-foreground">{candidate.fundName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {candidate.managingCompany}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-secondary/80 text-foreground border border-border/40 shrink-0">
                      {tSource(candidate.source)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">{t("candidate.fundId")}: </span>
                      <span className="font-mono">{candidate.fundId}</span>
                    </div>
                    {candidate.latestReportPeriod && (
                      <div>
                        <span className="text-muted-foreground">
                          {t("candidate.latestReportPeriod")}:{" "}
                        </span>
                        <span className="font-mono">
                          {formatDate(candidate.latestReportPeriod, undefined, {
                            year: "numeric",
                            month: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                    {candidate.latestMonthlyReturn !== null && (
                      <div>
                        <span className="text-muted-foreground">
                          {t("candidate.monthlyReturn")}:{" "}
                        </span>
                        <span className="font-mono">
                          {formatPercent(candidate.latestMonthlyReturn)}
                        </span>
                      </div>
                    )}
                    {candidate.latestYtdReturn !== null && (
                      <div>
                        <span className="text-muted-foreground">
                          {t("candidate.ytdReturn")}:{" "}
                        </span>
                        <span className="font-mono">
                          {formatPercent(candidate.latestYtdReturn)}
                        </span>
                      </div>
                    )}
                    {candidate.latestAnnualized3YrReturn !== null && (
                      <div>
                        <span className="text-muted-foreground">
                          {t("candidate.annualized3Yr")}:{" "}
                        </span>
                        <span className="font-mono">
                          {formatPercent(candidate.latestAnnualized3YrReturn)}
                        </span>
                      </div>
                    )}
                    {candidate.latestAnnualized5YrReturn !== null && (
                      <div>
                        <span className="text-muted-foreground">
                          {t("candidate.annualized5Yr")}:{" "}
                        </span>
                        <span className="font-mono">
                          {formatPercent(candidate.latestAnnualized5YrReturn)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleLink(candidate)}
                      disabled={isLinking}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-asset rounded-lg hover:bg-asset/85 active:scale-95 transition-all duration-150 disabled:opacity-50"
                    >
                      {isLinking && linkingFundId === candidate.publicFundId ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          {t("linking")}
                        </>
                      ) : (
                        t("confirmLinkButton")
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border/20 bg-gradient-to-t from-secondary/10 to-transparent px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLinking}
            className="px-4 py-2.5 text-sm font-medium text-foreground border border-border/40 rounded-lg hover:bg-secondary/30 transition-colors duration-150 disabled:opacity-50"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
