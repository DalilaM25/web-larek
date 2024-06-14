import { IAppState, IProduct, IOrder, FormErrors } from '../types';
import { IEvents } from './base/events';

export class AppState implements IAppState {
	cardList: IProduct[];
	basket: IProduct[] = [];
	protected formErrors: FormErrors = {};
	protected preview: string | null;
	protected order: IOrder = {
		payment: '',
		address: '',
		phone: '',
		email: '',
	};

	constructor(protected events: IEvents) {
	}

	emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }

	createCardList(cards: IProduct[]) {
		this.cardList = cards;
		this.emitChanges('cards:create');
	}

	totalPrice() {
		let totalPrice = 0;
		this.basket.forEach((card) => (totalPrice += card.price));
		return totalPrice;
	}

	addBasket(product: IProduct) {
		if (!this.basket.some((card) => card.id === product.id)) {
			this.basket = [...this.basket, product];
			this.emitChanges('basket:changed');
		} else {
			this.remBasket(product);
		}
	}

	remBasket(product: IProduct) {
		if (this.basket.some((card) => card.id === product.id)) {
			this.basket = this.basket.filter((card) => product.id !== card.id);
			this.emitChanges('basket:changed');
		}
		return;
	}

	getOrder() {
		return {
			...this.order,
			total: this.totalPrice(),
			items: this.basket.map((el) => el.id),
		};
	}

	clearBasket() {
		this.order = {
			email: '',
			phone: '',
			payment: '',
			address: '',
		};
		this.basket = [];
		this.emitChanges('basket:changed');
	}

	isBasketEmpty(): boolean {
		return this.basket.length === 0;
	}

	getItemsInBasket(): IProduct[] {
		return this.basket;
	}

	getBasketProductIndex(product: IProduct): number {
		return this.basket.indexOf(product) + 1;
	}

	setPayment(value: string) {
		if (this.order.payment !== value) this.order.payment = value;
	}

	setAddress(value: string) {
		this.order.address = value;
	}
	setPreview(product: IProduct) {
		this.preview = product.id;
		this.emitChanges('preview:changed', product);
	}

	setOrderField(
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>,
		value: string
	) {
		this.order[field] = value;
		this.validateOrder();
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
