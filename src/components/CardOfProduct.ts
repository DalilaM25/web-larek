import {Component} from './base/Component';
import {ensureElement} from "../utils/utils";
import {CategoryColorsList, ICardOfProduct, ICardOperation} from "../types";

const CategoryColorsList: Record<string, string> = {
    'софт-скил': 'soft',
    'хард-скил': 'hard',
    'дополнительное': 'additional',
    'другое': 'other',
    'кнопка': 'button',
};

export class CardOfProduct extends Component<ICardOfProduct> {
    protected _category: HTMLElement | null;
    protected _title: HTMLElement;
    protected _text: HTMLElement | null;
    protected _image: HTMLImageElement;
    protected _price: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, operation?: ICardOperation) {
        super(container);
        this._category = container.querySelector(`.card__category`);
        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._text = container.querySelector(`.card__text`);
        this._image = container.querySelector(`.card__image`);
        this._price = container.querySelector(`.card__price`);
        this._button = container.querySelector(`.card__button`);

        if (operation?.Click) {
            container.addEventListener('click', operation.Click);
        }
    }


    set price(price: number | null) {
        price === null 
        ? this.setText(this._price, `Бесценно`) 
        : this.setText(this._price, `${price} синапсов`)}

    set category(text: CategoryColorsList) {
        this.setText(this._category, text);
        this._category.classList.add(`card__category_${CategoryColorsList[text]}`);
    }
    set image(link: string) {
        this.setImage(this._image, link, this.title);
        }
        
    set title(text: string) {
        this.setText(this._title, text);
    }

    set description(text: string) {
        this.setText(this._text, text);
    }   
 
    set selected(value: boolean) {
        if (!this._button.disabled) {
            this._button.disabled = value;
        }
    }
}
