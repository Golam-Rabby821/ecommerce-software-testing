import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  FlaskConical,
  Bug,
  CheckCircle2,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Terminal,
  Play,
  Layers,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  dossierMeta,
  coverageMatrix,
  manualTestCases,
  defectCaseStudies,
  ciPipelineStages,
  testPlanSummary,
  ManualTestCase,
} from '@/data/qaDossier';
import { useQALab } from '@/contexts/QALabContext';
import { useToast } from '@/hooks/use-toast';

type CoverageFilter = 'all' | 'p0' | 'automated' | 'manual';
type ModuleFilter = 'All' | ManualTestCase['module'];

interface RunSummaryTest {
  title: string;
  status: string;
  durationMs: number;
}

interface RunSummarySuite {
  file: string;
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
  tests: RunSummaryTest[];
}

interface RunSummaryData {
  generatedAt: string;
  browser: string;
  status: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
  suites: RunSummarySuite[];
}

const modules: ModuleFilter[] = [
  'All',
  'Authentication',
  'Product Listing',
  'Product Details',
  'Cart',
  'Checkout',
  'Order Confirmation',
];

const QADossier: React.FC = () => {
  const { setDrawerOpen, setConfigFlag, config } = useQALab();
  const { toast } = useToast();

  const [coverageFilter, setCoverageFilter] = useState<CoverageFilter>('all');
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>('All');
  const [tcSearch, setTcSearch] = useState('');
  const [expandedTc, setExpandedTc] = useState<string | null>('TC-AUTH-008');
  const [runSummary, setRunSummary] = useState<RunSummaryData | null>(null);
  const [expandedSuite, setExpandedSuite] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/qa-run-summary.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: RunSummaryData | null) => {
        if (active && data) {
          setRunSummary(data);
        }
      })
      .catch(() => {
        // Gracefully fall back if artifact has not been generated yet
      });
    return () => {
      active = false;
    };
  }, []);

  const automatedTcCount = useMemo(
    () => manualTestCases.filter((tc) => tc.automated).length,
    []
  );

  const filteredCoverage = useMemo(() => {
    switch (coverageFilter) {
      case 'p0':
        return coverageMatrix.filter((row) => row.riskTier === 'P0 Critical');
      case 'automated':
        return coverageMatrix.filter((row) => row.automatedCoverage);
      case 'manual':
        return coverageMatrix.filter((row) => !row.automatedCoverage);
      default:
        return coverageMatrix;
    }
  }, [coverageFilter]);

  const filteredTestCases = useMemo(() => {
    return manualTestCases.filter((tc) => {
      const matchesModule = moduleFilter === 'All' || tc.module === moduleFilter;
      const q = tcSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        tc.id.toLowerCase().includes(q) ||
        tc.title.toLowerCase().includes(q) ||
        tc.module.toLowerCase().includes(q);
      return matchesModule && matchesQuery;
    });
  }, [moduleFilter, tcSearch]);

  const handleReplayLogoutBug = () => {
    setConfigFlag('simulateLogoutBug', true);
    setDrawerOpen(true);
    toast({
      title: 'BUG-001 / BUG-002 Replay Enabled',
      description: 'Sign in, add an item to Cart or Wishlist, then click Logout to observe the pre-fix leak.',
    });
  };

  return (
    <Layout>
      <div data-testid="qa-dossier-page">
        {/* Dark Architectural Engineering Header */}
        <section className="bg-[#111214] text-zinc-100 border-b border-zinc-800">
          <div className="container py-12 md:py-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-zinc-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#E04F26]" aria-hidden="true" />
                  QA Engineering Dossier · {dossierMeta.author}
                </div>
                <h1
                  className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white"
                  data-testid="qa-dossier-title"
                >
                  Risk-Based Quality Engineering Blueprint
                </h1>
                <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
                  {dossierMeta.executiveSummary}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <Button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  data-testid="dossier-launch-lab"
                  variant="accent"
                >
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  Launch QA Lab
                </Button>
                <a
                  href={dossierMeta.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800 transition-colors"
                  data-testid="dossier-github-link"
                >
                  <GitBranch className="h-4 w-4" aria-hidden="true" />
                  GitHub Repo
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Factual Telemetry Strip */}
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                  Manual Test Cases
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">
                  {manualTestCases.length}
                </p>
                <p className="mt-1 text-xs text-zinc-400">Across 6 storefront modules</p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                  Automated Traceability
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">
                  {automatedTcCount} / {manualTestCases.length}
                </p>
                <p className="mt-1 text-xs text-zinc-400">P0 flows + axe-core a11y</p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                  Resolved Defects
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">
                  {defectCaseStudies.length}
                </p>
                <p className="mt-1 text-xs text-zinc-400">Session-isolation postmortems</p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                  Playwright Specs
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">
                  6 Suites
                </p>
                <p className="mt-1 text-xs text-zinc-400">Plus shared auth.setup seed</p>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12 space-y-16">
          {/* Live Last-Run Playwright Report */}
          <section aria-labelledby="live-report-heading" data-testid="dossier-live-report">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
                    Live Execution Artifact · public/qa-run-summary.json
                  </p>
                  <h2 id="live-report-heading" className="font-display text-xl font-bold text-foreground">
                    Last Verified Playwright Run
                  </h2>
                </div>
                {runSummary ? (
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded bg-success/10 px-2.5 py-1 text-success font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {runSummary.passed}/{runSummary.total} PASSED
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded bg-secondary px-2.5 py-1 text-foreground">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                      {(runSummary.durationMs / 1000).toFixed(1)}s · {runSummary.browser}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(runSummary.generatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="font-mono text-xs text-muted-foreground">
                    Run npm run test:e2e to generate execution artifact
                  </span>
                )}
              </div>

              {runSummary && (
                <div className="mt-4 divide-y divide-border">
                  {runSummary.suites.map((suite) => {
                    const isOpen = expandedSuite === suite.file;
                    return (
                      <div key={suite.file}>
                        <button
                          type="button"
                          onClick={() => setExpandedSuite(isOpen ? null : suite.file)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-4 py-3 text-left hover:bg-secondary/30 px-2 rounded transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            ) : (
                              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            )}
                            <span className="font-mono text-xs font-semibold text-foreground truncate">
                              {suite.file}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                            <span className="text-success font-semibold">
                              {suite.passed} passed
                            </span>
                            <span className="text-muted-foreground tabular-nums">
                              {(suite.durationMs / 1000).toFixed(1)}s
                            </span>
                          </div>
                        </button>
                        {isOpen && (
                          <div className="pb-3 pl-8 pr-2 space-y-1.5">
                            {suite.tests.map((t, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-4 rounded border border-border bg-secondary/20 px-3 py-2 font-mono text-[11px]"
                              >
                                <span className="text-foreground truncate">{t.title}</span>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-success font-semibold uppercase">
                                    {t.status}
                                  </span>
                                  <span className="text-muted-foreground tabular-nums">
                                    {t.durationMs}ms
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Section 1: Risk-Based Regression Coverage Matrix */}
          <section aria-labelledby="coverage-heading" data-testid="dossier-coverage-section">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
                  01 · Risk-Based Strategy
                </p>
                <h2 id="coverage-heading" className="font-display text-2xl font-bold text-foreground">
                  Regression Coverage Matrix
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  Every feature is explicitly categorized into automated regression vs. manual-first exploratory coverage based on business impact and maintenance ROI.
                </p>
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter coverage matrix">
                {(
                  [
                    { id: 'all', label: 'All Flows' },
                    { id: 'p0', label: 'P0 Critical' },
                    { id: 'automated', label: 'Automated' },
                    { id: 'manual', label: 'Manual-First' },
                  ] as const
                ).map((item) => (
                  <Button
                    key={item.id}
                    size="sm"
                    variant={coverageFilter === item.id ? 'default' : 'outline'}
                    onClick={() => setCoverageFilter(item.id)}
                    data-testid={`coverage-filter-${item.id}`}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
              <table className="w-full text-left border-collapse" data-testid="dossier-coverage-table">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-4">Feature / Flow</th>
                    <th className="py-3 px-4">Risk Tier</th>
                    <th className="py-3 px-4">Manual</th>
                    <th className="py-3 px-4">Automated</th>
                    <th className="py-3 px-4">Spec / Traceability</th>
                    <th className="py-3 px-4">Engineering Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {filteredCoverage.map((row) => (
                    <tr key={row.flow} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-foreground">{row.flow}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 font-mono text-[11px] font-medium ${
                            row.riskTier === 'P0 Critical'
                              ? 'bg-accent/10 text-accent border border-accent/25'
                              : row.riskTier === 'P1 High'
                              ? 'bg-foreground/10 text-foreground border border-foreground/20'
                              : 'bg-secondary text-muted-foreground border border-border'
                          }`}
                        >
                          {row.riskTier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-foreground">
                        {row.manualCoverage ? 'YES' : 'NO'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        {row.automatedCoverage ? (
                          <span className="inline-flex items-center gap-1 text-success font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                            CI PASS
                          </span>
                        ) : (
                          <span className="text-muted-foreground">MANUAL</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                        {row.specFile ? row.specFile.replace('automation/playwright/tests/', '') : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{row.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Resolved Defect Case Studies */}
          <section aria-labelledby="defects-heading" data-testid="dossier-defects-section">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
                  02 · Defect Postmortems
                </p>
                <h2 id="defects-heading" className="font-display text-2xl font-bold text-foreground">
                  Resolved Session-Isolation Case Studies
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  Documented defects caught during exploratory QA, resolved in frontend state management, and locked behind automated Playwright regression guards.
                </p>
              </div>
              <Button
                type="button"
                variant={config.simulateLogoutBug ? 'accent' : 'outline'}
                onClick={handleReplayLogoutBug}
                data-testid="dossier-replay-logout-bug"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                {config.simulateLogoutBug ? 'Bug Replay Active in Lab' : 'Replay Logout Defect Live'}
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {defectCaseStudies.map((bug) => (
                <article
                  key={bug.id}
                  data-testid={`dossier-defect-${bug.id}`}
                  className="rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
                        <Bug className="h-4 w-4 text-accent" aria-hidden="true" />
                        {bug.id}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="rounded bg-secondary px-2 py-0.5 text-muted-foreground">
                          Severity: {bug.severity}
                        </span>
                        <span className="rounded bg-success/10 px-2 py-0.5 text-success font-semibold">
                          {bug.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {bug.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {bug.summary}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-md border border-border bg-secondary/40 p-3 space-y-1">
                        <p className="font-mono font-semibold uppercase text-muted-foreground">
                          Before Fix
                        </p>
                        <p className="text-foreground leading-relaxed">{bug.actualBeforeFix}</p>
                      </div>
                      <div className="rounded-md border border-border bg-success/5 p-3 space-y-1">
                        <p className="font-mono font-semibold uppercase text-success">
                          Root Cause &amp; Fix
                        </p>
                        <p className="text-foreground leading-relaxed">{bug.fixImplemented}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        Steps to Reproduce
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                        {bug.stepsToReproduce.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
                    <span>Guard: {bug.regressionSpec.replace('automation/playwright/tests/', '')}</span>
                    <span>Doc: {bug.sourceDoc}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Section 3: Interactive Manual Test Case Catalog */}
          <section aria-labelledby="catalog-heading" data-testid="dossier-tc-section">
            <div className="mb-6">
              <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
                03 · Manual Test Design
              </p>
              <h2 id="catalog-heading" className="font-display text-2xl font-bold text-foreground">
                Manual Test Case Catalog ({manualTestCases.length} Cases)
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Search and inspect preconditions, steps, expected outcomes, and automation traceability from{' '}
                <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">
                  qa/test-cases/manual-test-cases.md
                </code>
                .
              </p>
            </div>

            <div className="mb-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Search by TC ID or title (e.g. TC-CHK-002)..."
                  value={tcSearch}
                  onChange={(e) => setTcSearch(e.target.value)}
                  className="pl-9 bg-card"
                  data-testid="dossier-tc-search"
                  aria-label="Search manual test cases"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {modules.map((mod) => (
                  <Button
                    key={mod}
                    size="sm"
                    variant={moduleFilter === mod ? 'default' : 'outline'}
                    onClick={() => setModuleFilter(mod)}
                    data-testid={`tc-module-${mod.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {mod}
                  </Button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm" data-testid="dossier-tc-list">
              {filteredTestCases.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No test cases matched your filter.
                </div>
              ) : (
                filteredTestCases.map((tc) => {
                  const isOpen = expandedTc === tc.id;
                  return (
                    <div key={tc.id} data-testid={`dossier-tc-row-${tc.id}`}>
                      <button
                        type="button"
                        onClick={() => setExpandedTc(isOpen ? null : tc.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex flex-wrap items-center gap-3 min-w-0">
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          )}
                          <span className="font-mono text-xs font-semibold text-foreground shrink-0">
                            {tc.id}
                          </span>
                          <span className="text-sm font-medium text-foreground truncate">
                            {tc.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                          <span className="hidden sm:inline rounded bg-secondary px-2 py-0.5 text-muted-foreground">
                            {tc.module}
                          </span>
                          {tc.automated ? (
                            <span className="rounded bg-success/10 px-2 py-0.5 text-success font-semibold">
                              Automated
                            </span>
                          ) : (
                            <span className="rounded bg-secondary px-2 py-0.5 text-muted-foreground">
                              Manual
                            </span>
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-border bg-secondary/20 px-5 py-4 grid md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <p className="font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                              Preconditions
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-foreground">
                              {tc.preconditions.map((p, idx) => (
                                <li key={idx}>{p}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                              Test Steps
                            </p>
                            <ol className="list-decimal list-inside space-y-1 text-foreground">
                              {tc.steps.map((s, idx) => (
                                <li key={idx}>{s}</li>
                              ))}
                            </ol>
                          </div>
                          <div>
                            <p className="font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                              Expected Result
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-foreground">
                              {tc.expectedResult.map((r, idx) => (
                                <li key={idx}>{r}</li>
                              ))}
                            </ul>
                            {tc.specFile && (
                              <p className="mt-2 font-mono text-[11px] text-success">
                                Spec: {tc.specFile}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Section 4: Playwright & CI Pipeline Architecture */}
          <section aria-labelledby="pipeline-heading" data-testid="dossier-pipeline-section">
            <div className="mb-6">
              <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
                04 · Automation &amp; CI Architecture
              </p>
              <h2 id="pipeline-heading" className="font-display text-2xl font-bold text-foreground">
                Deterministic Playwright Pipeline
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Runs headless Chromium on every pull request and push to <code className="font-mono text-xs">main</code> with shared auth fixtures, Page Objects, zero <code className="font-mono text-xs">waitForTimeout</code> sleeps, and <code className="font-mono text-xs">@axe-core/playwright</code> accessibility gating.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ciPipelineStages.map((stage) => (
                <div
                  key={stage.step}
                  className="rounded-lg border border-border bg-card p-5 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div>
                    <p className="font-mono text-xs font-semibold text-accent mb-2">
                      {stage.step}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{stage.purpose}</p>
                  </div>
                  <div className="rounded border border-border bg-secondary/50 px-2.5 py-2 font-mono text-[11px] text-foreground break-all flex items-start gap-2">
                    <Terminal className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" aria-hidden="true" />
                    <span>{stage.command}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Test Plan Scope & Exit Criteria */}
          <section aria-labelledby="scope-heading" data-testid="dossier-scope-section">
            <div className="mb-6">
              <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
                05 · Test Plan Sign-Off
              </p>
              <h2 id="scope-heading" className="font-display text-2xl font-bold text-foreground">
                Scope &amp; Release Exit Criteria
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                  In Scope
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {testPlanSummary.inScope.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-xs text-foreground mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  Intentionally Out of Scope
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {testPlanSummary.outOfScope.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-xs text-foreground mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-accent" aria-hidden="true" />
                  Exit Criteria
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {testPlanSummary.exitCriteria.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-xs text-foreground mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-secondary/40 p-5">
              <div>
                <p className="font-display font-semibold text-foreground">
                  Ready to verify the storefront under live fault injection?
                </p>
                <p className="text-sm text-muted-foreground">
                  Jump back to the Shop and use the QA Lab drawer to inspect `data-testid` hooks or trigger chaos failures.
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <Link to="/">Return to Storefront</Link>
                </Button>
                <Button type="button" onClick={() => setDrawerOpen(true)}>
                  Open QA Control Lab
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default QADossier;
