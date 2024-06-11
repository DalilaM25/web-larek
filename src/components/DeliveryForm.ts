import {Form} from "./Form";
import {IEvents} from './base/events';
import {IDeliveryForm} from '../types';
import { ensureAllElements } from '../utils/utils';

export class DeliveryForm extends Form<IDeliveryForm> {
    protected formButtons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.formButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
		this.formButtons.forEach((button) => {
			button.addEventListener('click', () => {
				events.emit('payment:change', button);
			});
		});
	}

    set address(text: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			text;
	}

	set payment(value: string) {
		this.formButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === value);
		});
	}

}
