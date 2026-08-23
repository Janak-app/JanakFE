"use client";

import React from "react";
import { ApiProduct } from "@/types/api";

type Props = {
  products: ApiProduct[];
};

function getPrimaryImage(p: ApiProduct): string {
  const sorted = [...p.images].sort((a, b) => a.sortOrder - b.sortOrder);
  return sorted.find((img) => img.isPrimary)?.url ?? sorted[0]?.url ?? "";
}

function formatPrice(price: string): string {
  const num = Math.round(parseFloat(price));
  return num > 0 ? "₹" + num.toLocaleString("en-IN") : "Get Quote";
}

export default function CompareTable({ products }: Props) {
  const n = products.length;

  // Collect all unique spec keys in order (first-seen wins)
  const allKeys = Array.from(
    new Set(
      products.flatMap((p) =>
        [...(p.specs ?? [])].sort((a, b) => a.sortOrder - b.sortOrder).map((s) => s.key)
      )
    )
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[400px] border-collapse">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            {/* Empty corner cell */}
            <th className="w-[130px] bg-white" />
            {products.map((p) => (
              <th key={p.id} className="bg-white border-l border-[#E5E7EB] px-2 py-2.5 font-normal align-top">
                <div className="flex flex-col items-center">
                  <div className="w-full h-20 bg-[#F5F5F7] rounded-lg overflow-hidden mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getPrimaryImage(p)}
                      alt={p.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <p className="text-[9px] font-bold text-[#6B7280] tracking-[1.2px] uppercase">
                    {p.brand?.name}
                  </p>
                  <p className="text-[11px] font-bold text-[#111827] text-center leading-tight mt-0.5 line-clamp-2 min-h-8">
                    {p.name}
                  </p>
                  <p className="text-[12px] font-bold text-accent mt-1">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allKeys.length === 0 ? (
            <tr>
              <td colSpan={n + 1} className="text-center py-10 text-[13px] text-[#9CA3AF]">
                No specification data available for these products.
              </td>
            </tr>
          ) : (
            allKeys.map((key, i) => (
              <React.Fragment key={key}>
                <tr className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}>
                  <td className="px-3 py-3 border-b border-[#E5E7EB] align-top w-[130px]">
                    <p className="text-[11px] font-semibold text-[#6B7280] leading-snug">{key}</p>
                  </td>
                  {products.map((p) => {
                    const val = p.specs?.find((s) => s.key === key)?.value ?? null;
                    return (
                      <td
                        key={p.id}
                        className="px-2 py-3 text-center border-b border-l border-[#E5E7EB] align-top"
                      >
                        <p className="text-[11px] font-medium text-[#111827] leading-snug">
                          {val ?? "—"}
                        </p>
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
