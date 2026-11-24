import { Page, expect } from "@playwright/test";

/** Page Object for the TechStore catalog storefront. */
export class ShopPage {
	constructor(private readonly page: Page) {}

	async goto(): Promise<void> {
		await this.page.goto("/");
		await expect(this.page.getByTestId("product-grid")).toBeVisible();
	}

	async openProduct(productId: string): Promise<void> {
		await this.page.getByTestId(`product-card-${productId}`).click();
		await expect(this.page).toHaveURL(new RegExp(`/product/${productId}`));
	}

	async search(query: string): Promise<void> {
		await this.page.getByTestId("search-input").fill(query);
	}

	async selectCategory(category: string): Promise<void> {
		const slug = category.toLowerCase().replace(" ", "-");
		await this.page.getByTestId(`category-filter-${slug}`).click();
	}

	async filterInStockOnly(): Promise<void> {
		await this.page.getByTestId("in-stock-filter").click();
	}
}
