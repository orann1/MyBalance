"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Search, X, Info, Link2, Loader2 } from "lucide-react";
import { formatPercent, formatDate } from "@/lib/locale/formatters";
import { searchPublicFundsForMatchingAction } from "@/lib/actions/public-fund-matching-actions";
import { linkManagedSavingsHoldingToPublicFund } from "@/lib/actions/public-fund-linking-actions";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";
import type { PublicFundMatchCandidate } from "@/lib/public-funds/search-types";

interface PublicFundMatchModalProps {
  investment: ManagedSavingsInvestment;
  isOpen: boolean;
  onClose: () => void;
  onLinkSuccess: (holding: ManagedSavingsInvestment) => void;
}

// Managed Savings products (Keren Hishtalmut, Kupat Gemel, Gemel LeHashkaa,
// Savings Policy) are non-pension. This modal only ever searches GemelNet —
// PensionNet is a separate, pension-related data source and is intentionally
// not selectable here. The backend (searchPublicFundsForMatching) still
// supports both sources for other future screens.
const MANAGED_SAVINGS_SOURCE = "gemelnet" as const;

function buildInitialQuery(investment: ManagedSavingsInvestment): string {
  return [investment.track, investment.managingCompany].filter(Boolean).join(" ").trim();
}

export function PublicFundMatchModal({
  investment,
  isOpen,
  onClose,
  onLinkSuccess,
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

  if (!isOpen) return null;

  const handleSearch = () => {
    setSearchError(false);
    setLinkError(false);
    startSearch(async () => {
      const result = await searchPublicFundsForMatchingAction({
        query: query || undefined,
        source: MANAGED_SAVINGS_SOURCE,
        limit: 10,
      });
      setHasSearched(true);
      if (result.ok) {
        setCandidates(result.candidates);
      } else {
        setCandidates([]);
        setSearchError(true);
      }
    });
  };

  const handleLink = (candidate: PublicFundMatchCandidate) => {
    setLinkError(false);
    setLinkingFundId(candidate.publicFundId);
    startLink(async () => {
      const result = await linkManagedSavingsHoldingToPublicFund({
        holdingId: investment.id,
        publicFundId: candidate.publicFundId,
      });
      setLinkingFundId(null);
      if (result.ok) {
        onLinkSuccess(result.holding);
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
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t("searchPlaceholder")}
              className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-asset rounded-lg hover:bg-asset/85 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {t("searchButton")}
            </button>
          </div>

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
