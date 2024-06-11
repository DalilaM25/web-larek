import {Component} from './base/Component';
import {ensureElement} from "../utils/utils";
import {IOrderSuccess, ISuccessOperation} from "../types";

export class OrderSuccess extends Component<IOrderSuccess> {
    protected closeButton: HTMLButtonElement;
    protected totalSpent: HTMLElement;

    constructor(container: HTMLElement, operation: ISuccessOperation) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.totalSpent = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (operation?.Click) {
                this.closeButton.addEventListener('click', operation.Click)
        }
    }

    set count(total: number | string) {
        this.totalSpent.textContent = `Списано ${total} синапсов`;
    }
}
