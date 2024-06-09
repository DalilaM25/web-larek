import { IAppState, IProduct, IOrder, IContactForm, IDeliveryForm, FormErrors } from "../types";
import {Model} from './base/Model';


export class AppState extends Model<IAppState> {
    cardList: IProduct[];
    formErrors: FormErrors = {};
    basket: IProduct[] = [];
    order: IOrder = {
        total: 0,
        items: [],
        payment: '',
        address: '',
        phone: '',
        email: '',
    };
    
    createCardList(cards: IProduct[]) {
        this.cardList = cards;
        this.emitChanges('cards:create');
    }

    addOrder(product: IProduct) {
        this.order.items.push(product.id);
    }

    remOrder(product: IProduct) {
        const index = this.order.items.indexOf(product.id);
		if (index >= 0) {
			this.order.items.splice(index, 1);
		}
    }

    totalPrice() {
        return this.order.items.reduce(
			(a, c) => a + this.cardList.find((item) => item.id === c).price,
			0
		);
    }

    addBasket(product: IProduct) {
		this.basket.push(product);
	}

    remBasket(product: IProduct) {
		const index = this.basket.indexOf(product);
		if (index >= 0) {
			this.basket.splice(index, 1);
		}
	}
    
    clearBasket() {
        this.basket = [];
        this.order.items = [];
    }

    get isBasketEmpty(): boolean {
		return this.basket.length === 0;
	}

    setDelyveryField(field: keyof IDeliveryForm, value: string) {
		this.order[field] = value;
		if (this.validateDelivery()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactField(field: keyof IContactForm, value: string) {
		this.order[field] = value;
		if (this.validateContact()) {
			this.events.emit('order:ready', this.order);
		}
	}
 
	validateDelivery() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		} else if (!this.order.payment) {
			errors.address = 'Необходимо выбрать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

}