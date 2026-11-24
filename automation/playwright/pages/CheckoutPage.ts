import { Page, expect } from "@playwright/test";

export interface ShippingDetails {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	phone: string;
}

export interface CardPaymentDetails {
	cardNumber: string;
	nameOnCard: string;
	expiryDate: string;
	cvv: string;
}

/** Page Object for multi-step shipping & payment checkout. */
export class CheckoutPage {
	constructor(private readonly page: Page) {}

	async fillShipping(details: ShippingDetails): Promise<void> {
		await this.page.getByTestId("shipping-first-name").fill(details.firstName);
		await this.page.getByTestId("shipping-last-name").fill(details.lastName);
		await this.page.getByTestId("shipping-address").fill(details.address);
		await this.page.getByTestId("shipping-city").fill(details.city);
		await this.page.getByTestId("shipping-state").fill(details.state);
		await this.page.getByTestId("shipping-zip").fill(details.zip);
		await this.page.getByTestId("shipping-phone").fill(details.phone);
	}

	async continueToPayment(): Promise<void> {
		await this.page.getByTestId("continue-to-payment-button").click();
	}

	async fillCardPayment(details: CardPaymentDetails): Promise<void> {
		await expect(this.page.getByTestId("payment-form")).toBeVisible();
		await this.page.getByTestId("card-number").fill(details.cardNumber);
		await this.page.getByTestId("name-on-card").fill(details.nameOnCard);
		await this.page.getByTestId("expiry-date").fill(details.expiryDate);
		await this.page.getByTestId("cvv").fill(details.cvv);
	}

	async placeOrder(): Promise<void> {
		await this.page.getByTestId("place-order-button").click();
	}
}
