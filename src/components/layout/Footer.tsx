import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { BrandMark } from '@/components/layout/BrandMark';
import { useQALab } from '@/contexts/QALabContext';
import { dossierMeta } from '@/data/qaDossier';

export const Footer: React.FC = () => {
  const { setDrawerOpen } = useQALab();

  return (
    <footer
      className="border-t border-border bg-card py-10 mt-auto"
      data-testid="footer"
    >
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <BrandMark compact />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Precision hardware storefront engineered as a deterministic System Under Test for manual QA &amp; Playwright automation.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Storefront
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-shop-link"
                >
                  Shop Catalog
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-cart-link"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-account-link"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              QA Engineering
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/qa-dossier"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-dossier-link"
                >
                  QA Dossier &amp; Matrix
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Launch QA Control Lab
                </button>
              </li>
              <li>
                <a
                  href={dossierMeta.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Sandbox Credentials
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              Frontend-only mock catalog. No real charges or backend persistence occur.
            </p>
            <div className="rounded-md border border-border bg-secondary/50 p-2.5 font-mono text-xs space-y-1 text-foreground">
              <div>
                <span className="text-muted-foreground">email: </span>
                <span>test@example.com</span>
              </div>
              <div>
                <span className="text-muted-foreground">pass:  </span>
                <span>Password123!</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p data-testid="footer-copyright">
            © 2026 TechStore · Quality Engineering Showcase by {dossierMeta.author}
          </p>
          <p className="font-mono">Deterministic E2E · WCAG 2.1 AA · Zero-Sleep CI</p>
        </div>
      </div>
    </footer>
  );
};
