import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
		<footer
			className="border-t border-border bg-secondary/30 py-8 mt-auto"
			data-testid="footer"
		>
			<div className="container">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<img
							src="/logo-ts.svg"
							alt="TechStore logo"
							className="w-[150px] rounded-lg object-contain"
						/>
						<p className="text-sm text-muted-foreground mt-2">
							Your trusted destination for premium tech products. Quality
							guaranteed.
						</p>
					</div>
					<div>
						<h4 className="font-semibold mb-3">Quick Links</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									to="/"
									className="text-muted-foreground hover:text-foreground transition-colors"
									data-testid="footer-shop-link"
								>
									Shop
								</Link>
							</li>
							<li>
								<Link
									to="/cart"
									className="text-muted-foreground hover:text-foreground transition-colors"
									data-testid="footer-cart-link"
								>
									Cart
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
						<h4 className="font-semibold mb-3">Testing Info</h4>
						<p className="text-sm text-muted-foreground">
							This app is designed for software testing practice. All data is
							mock data and no real transactions occur.
						</p>
						<p className="text-sm text-muted-foreground mt-2">
							Test account:{" "}
							<code className="bg-muted px-1 rounded">test@example.com</code> /{" "}
							<code className="bg-muted px-1 rounded">Password123!</code>
						</p>
					</div>
				</div>
				<div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
					<p data-testid="footer-copyright">
						© 2024 TechStore. Built for testing practice.
					</p>
				</div>
			</div>
		</footer>
	);
};
