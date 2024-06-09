import {IBasket} from '../types';
import {Component} from './base/Component';
import {EventEmitter} from './base/events';
import {createElement, ensureElement, formatNumber} from "../utils/utils";

export class Basket extends Component<IBasket> {
    protected basketList: HTMLElement;
    protected numeration: HTMLElement;
    protected totalCost: HTMLElement | null;
    basketButton: HTMLButtonElement | null;
  
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalCost = this.container.querySelector('.basket__price');
        this.basketButton = this.container.querySelector('.basket__button');
    
        if (this.basketButton) {
            this.basketButton.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
        this.products = [];
    }

    set products(products: HTMLElement[]) {
        if (products.length) {
            this.basketList.replaceChildren(...products);
        } else {
            this.basketList.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'В корзине пусто',
                })
            );
        }
    }

    set cost(cost: number) {
        this.setText(this.totalCost, formatNumber(cost) + ' ' + 'синапсов');
    }
    
    set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this.basketButton, false);
		} else {
			this.setDisabled(this.basketButton, true);
		}
	}
    
}
