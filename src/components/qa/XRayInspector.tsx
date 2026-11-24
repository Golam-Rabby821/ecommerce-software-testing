import React, { useEffect, useState, useRef } from 'react';
import { ScanEye, Copy } from 'lucide-react';
import { useQALab } from '@/contexts/QALabContext';
import { useToast } from '@/hooks/use-toast';

interface HoveredTargetInfo {
  testId: string;
  tag: string;
  playwrightLocator: string;
  ariaLocator: string | null;
  snippet: string;
  x: number;
  y: number;
}

const inferRole = (el: HTMLElement): string | null => {
  const explicit = el.getAttribute('role');
  if (explicit) return explicit;
  const tag = el.tagName.toLowerCase();
  if (tag === 'button') return 'button';
  if (tag === 'a' && el.hasAttribute('href')) return 'link';
  if (tag === 'input') {
    const type = (el.getAttribute('type') || 'text').toLowerCase();
    if (type === 'checkbox') return 'checkbox';
    if (type === 'radio') return 'radio';
    return 'textbox';
  }
  if (tag === 'select') return 'combobox';
  if (/^h[1-6]$/.test(tag)) return 'heading';
  return null;
};

const getAccessibleName = (el: HTMLElement): string => {
  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel.trim();
  const placeholder = el.getAttribute('placeholder');
  if (placeholder) return placeholder.trim();
  const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  return text.slice(0, 42);
};

const buildSnippet = (el: HTMLElement, testId: string): string => {
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea') {
    return `await page.getByTestId('${testId}').fill('value');`;
  }
  if (tag === 'select') {
    return `await page.getByTestId('${testId}').selectOption('...');`;
  }
  if (tag === 'button' || tag === 'a' || el.getAttribute('role') === 'switch') {
    return `await page.getByTestId('${testId}').click();`;
  }
  return `await expect(page.getByTestId('${testId}')).toBeVisible();`;
};

/**
 * Interactive Playwright Locator Inspector when X-Ray mode is enabled.
 * Renders a single clamped hover tooltip instead of overlapping static badges,
 * and copies Playwright snippets on Alt+Click.
 */
export const XRayInspector: React.FC = () => {
  const { config, logEvent } = useQALab();
  const { toast } = useToast();
  const [hovered, setHovered] = useState<HoveredTargetInfo | null>(null);
  const lastNodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const clearHoverAttr = () => {
      if (lastNodeRef.current) {
        lastNodeRef.current.removeAttribute('data-qa-xray-hovered');
        lastNodeRef.current = null;
      }
    };

    if (!config.xrayMode) {
      clearHoverAttr();
      setHovered(null);
      return;
    }

    const resolveTarget = (raw: EventTarget | null): HTMLElement | null => {
      if (!(raw instanceof HTMLElement)) return null;
      if (raw.closest('[data-qa-lab-ui]')) return null;
      return raw.closest<HTMLElement>('[data-testid]');
    };

    const handlePointerMove = (e: MouseEvent) => {
      const target = resolveTarget(e.target);
      if (!target) {
        clearHoverAttr();
        setHovered(null);
        return;
      }

      if (lastNodeRef.current && lastNodeRef.current !== target) {
        lastNodeRef.current.removeAttribute('data-qa-xray-hovered');
      }
      target.setAttribute('data-qa-xray-hovered', 'true');
      lastNodeRef.current = target;

      const testId = target.getAttribute('data-testid') || '';
      const role = inferRole(target);
      const name = getAccessibleName(target);
      const escapedName = name.replace(/'/g, "\\'");
      const ariaLocator =
        role && name
          ? `page.getByRole('${role}', { name: '${escapedName}' })`
          : null;

      setHovered({
        testId,
        tag: target.tagName.toLowerCase(),
        playwrightLocator: `page.getByTestId('${testId}')`,
        ariaLocator,
        snippet: buildSnippet(target, testId),
        x: Math.min(e.clientX + 16, window.innerWidth - 340),
        y: Math.min(e.clientY + 18, window.innerHeight - 135),
      });
    };

    const handleAltClick = async (e: MouseEvent) => {
      if (!e.altKey) return;
      const target = resolveTarget(e.target);
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();

      const testId = target.getAttribute('data-testid') || '';
      const snippet = buildSnippet(target, testId);

      try {
        await navigator.clipboard.writeText(snippet);
        logEvent('LAB', 'XRAY_LOCATOR_COPIED', snippet);
        toast({
          title: 'Playwright snippet copied',
          description: snippet,
        });
      } catch {
        toast({
          title: 'Locator inspected',
          description: snippet,
        });
      }
    };

    document.addEventListener('mousemove', handlePointerMove, true);
    document.addEventListener('click', handleAltClick, true);

    return () => {
      document.removeEventListener('mousemove', handlePointerMove, true);
      document.removeEventListener('click', handleAltClick, true);
      clearHoverAttr();
    };
  }, [config.xrayMode, logEvent, toast]);

  if (!config.xrayMode || !hovered) {
    return null;
  }

  return (
    <div
      data-qa-lab-ui="true"
      data-testid="qa-xray-tooltip"
      style={{ left: Math.max(12, hovered.x), top: Math.max(12, hovered.y) }}
      className="pointer-events-none fixed z-50 w-[324px] rounded-lg border border-zinc-700 bg-[#111214]/95 p-3 text-zinc-100 shadow-2xl backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#ff8663]">
          <ScanEye className="h-3 w-3" aria-hidden="true" />
          &lt;{hovered.tag}&gt; · {hovered.testId}
        </span>
      </div>
      <div className="space-y-1 font-mono text-[11px]">
        <div className="rounded bg-zinc-900 px-2 py-1 text-emerald-300 truncate">
          {hovered.playwrightLocator}
        </div>
        {hovered.ariaLocator && (
          <div className="rounded bg-zinc-900/70 px-2 py-1 text-zinc-300 truncate">
            {hovered.ariaLocator}
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-zinc-400">
        <Copy className="h-3 w-3" aria-hidden="true" />
        <span>Alt + Click to copy Playwright command</span>
      </div>
    </div>
  );
};
