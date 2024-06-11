import {IBasket} from '../types';
import {Component} from './base/Component';
import {EventEmitter} from './base/events';
import {createElement, ensureElement} from "../utils/utils";

export class Basket extends Component<IBasket> {
    protected basketList: HTMLElement;
    protected totalCost: HTMLElement;
    protected basketButton: HTMLButtonElement;
  
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
            this.setDisabled(this.basketButton, false);
        } else {
            this.basketList.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'В корзине пусто',
                })
            );
            this.setDisabled(this.basketButton, true);
        }
    }

    set cost(cost: number) {
        this.setText(this.totalCost, `${cost} синапсов`);
    }
    
}
