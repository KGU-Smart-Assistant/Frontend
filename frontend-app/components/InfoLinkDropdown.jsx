"use client";

import { useState } from "react";
import { Check, ChevronDown, ExternalLink, Link2 } from "lucide-react";

import { kguInfoLinks } from "@/data/kguInfoLinks";

const totalLinkCount = kguInfoLinks.reduce(
  (sum, group) => sum + group.links.length,
  0,
);

export default function InfoLinkDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroupId, setOpenGroupId] = useState(kguInfoLinks[0]?.id ?? "");

  return (
    <div className="relative px-4 pb-3">
      {isOpen ? (
        <div className="absolute bottom-full left-4 right-4 z-40 mb-3 max-h-[min(58vh,440px)] overflow-hidden rounded-[24px] border border-[#d6dbe6] bg-white text-[#202739] shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
          <div className="flex items-center gap-3 border-b border-[#d6dbe6] px-4 py-3">
            <Check className="h-5 w-5 shrink-0 text-[#003876]" />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">
                더 많은 정보 알아보기
              </p>
              <p className="text-[11px] font-semibold text-[#69748a]">
                {kguInfoLinks.length}개 분류 · {totalLinkCount}개 바로가기
              </p>
            </div>
          </div>

          <div className="max-h-[calc(min(58vh,440px)-64px)] overflow-y-auto [scrollbar-width:none]">
            {kguInfoLinks.map((group) => {
              const isGroupOpen = openGroupId === group.id;

              return (
                <section key={group.id} className="border-b border-[#edf0f5] last:border-b-0">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroupId((currentId) =>
                        currentId === group.id ? "" : group.id,
                      )
                    }
                    aria-expanded={isGroupOpen}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-[#f4f7fb]"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C6C9D4] text-[#003876]">
                        <Link2 className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-extrabold text-[#202739]">
                          {group.title}
                        </span>
                        <span className="text-xs font-semibold text-[#7b8498]">
                          {group.links.length}개 링크
                        </span>
                      </span>
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#69748a] transition ${
                        isGroupOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isGroupOpen ? (
                    <div className="bg-[#f8fafc] px-3 pb-3">
                      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white">
                        {group.links.map((link) => (
                          <a
                            key={`${group.id}-${link.label}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between gap-3 border-b border-[#eef1f6] px-4 py-3 text-sm font-bold text-[#202739] transition last:border-b-0 hover:bg-[#eef3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#003876]"
                          >
                            <span className="min-w-0 truncate">{link.label}</span>
                            <ExternalLink className="h-4 w-4 shrink-0 text-[#003876]" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex h-12 w-full items-center justify-between rounded-[18px] border-2 border-white/80 bg-white px-4 text-left text-sm font-extrabold text-[#003876] shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition hover:bg-[#eef3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span>더 많은 정보 알아보기</span>
        <ChevronDown
          className={`h-6 w-6 shrink-0 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}
