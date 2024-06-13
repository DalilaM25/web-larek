import { Form } from './Form';
import { IEvents } from './base/events';
import { IDeliveryForm } from '../types';

export class DeliveryForm extends Form<IDeliveryForm> implements IDeliveryForm {
	protected _onlinePayment: HTMLButtonElement;
	protected _cashPayment: HTMLButtonElement;
	payment = '';

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._onlinePayment = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._cashPayment = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;

		if (this.onlinePayment) {
			this.onlinePayment.addEventListener('click', () => {
				events.emit(`payment:change`, {
					payment: this.onlinePayment.name,
					button: this.onlinePayment,
				});
			});
		}

		if (this._cashPayment) {
			this._cashPayment.addEventListener('click', () => {
				events.emit(`payment:change`, {
					payment: this._cashPayment.name,
					button: this._cashPayment,
				});
			});
		}
	}

	get onlinePayment(){
		return this._onlinePayment
	}

	get cashPayment(){
		return this._cashPayment
	}
	
	set address(text: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			text;
	}

	addPayment(value: HTMLElement) {
		this.remPayment();
		this.toggleClass(value, 'button_alt-active', true);
	}

	remPayment() {
		this.toggleClass(this._onlinePayment, 'button_alt-active', false);
		this.toggleClass(this._cashPayment, 'button_alt-active', false);
	}
}
