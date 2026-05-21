"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, limit, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#F1F5F9] bg-[#F8FAFC]">
      <p className="text-xs text-[#64748B]">
        <span className="font-medium text-[#475569]">{from}–{to}</span> sur{" "}
        <span className="font-medium text-[#475569]">{total.toLocaleString("fr-FR")}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg text-[#64748B] hover:bg-white hover:text-[#0A1120] border border-transparent hover:border-[#E2E8F0] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-[#94A3B8] select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={`
                w-8 h-8 rounded-lg text-xs font-medium transition-all border
                ${page === p
                  ? "bg-[#1E5BB4] text-white border-[#1E5BB4] shadow-sm shadow-[#1E5BB4]/20"
                  : "text-[#64748B] border-transparent hover:bg-white hover:text-[#0A1120] hover:border-[#E2E8F0]"
                }
              `}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg text-[#64748B] hover:bg-white hover:text-[#0A1120] border border-transparent hover:border-[#E2E8F0] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Page suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
