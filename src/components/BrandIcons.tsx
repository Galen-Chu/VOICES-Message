/**
 * 品牌圖像(來源=個人品牌設計系統 Uniconsign,galen-chu/uniconsign)。
 * BrandMark=品牌符號字母版「V」(綠底+青圓+白字母+黃點,SVG 造型逐字複製自
 * icons/brand/logo-v.svg,僅補 React 屬性與唯一 clipPath id)。
 */
import { useId } from 'react';

export function BrandMark({ size = 36, title }: { size?: number; title?: string }) {
  const clipId = `brand-v-${useId()}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="32" height="32" rx="8" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="32" height="32" fill="#167839" />
        <circle cx="22" cy="10" r="10" fill="#009CAD" />
        <path
          d="M8.5 9L14.5 23L20.5 9"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="25" cy="25" r="2.5" fill="#E7D24E" />
      </g>
    </svg>
  );
}
