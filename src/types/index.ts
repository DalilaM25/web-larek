export type Category =  'софт-скил' | 'хард-скил' | 'дополнительное' | 'другое' | 'кнопка' ;

//товар
export interface IProduct {
    title: string;
    id?: string;
    category: Category;
    description?: string;
    image: string;
    price: number | null;
    buttonName?: string;
}

//Карточка товара
export interface ICardOfProduct extends IProduct{
    _category: HTMLElement;
    _title: HTMLElement;
    _text: HTMLElement | null;
    _image: HTMLImageElement;
    _price: HTMLElement | null;
    _button: HTMLButtonElement | null;
    set price(price: number | null);
    set category(text: Category);
    set image(link: string);
    set title(text: string);
    set description(text: string);
    set buttonName(value: string);
}

//Интерфейс данных приложения
export interface IAppState {
    cardList: IProduct[]; 
    basket: IProduct[]; 
    order: IOrder | null; 
    preview: string | null;
    formErrors: FormErrors;
    isBasketEmpty(): boolean;
    createCardList(cards: IProduct[]) : void;
    totalPrice(): number;
    addBasket(product: IProduct): void;
    remBasket(product: IProduct): void;
    addOrder(): void;
    clearBasket(): void;
    getItemsInBasket(): IProduct[];
    getBasketProductIndex(product: IProduct): number;
    setButtonText(product: IProduct):string;
    setPayment(value: string):void;
    setAddress(value: string):void;
	setPreview(product: IProduct) :void;
    setOrderField(field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>,value: string):void;
    validateOrder():void;
}

//интерфейс окна формы
export interface IForm<T> {
    errors: string[]; 
    valid: boolean;
    render?(data: Partial<T> & IForm<T>):void;
    inputChange?(field: keyof T, value: string):void;
}

//интерфейс модального окна заказа
export interface IDeliveryForm {
    onlinePayment?: HTMLButtonElement;
	cashPayment?: HTMLButtonElement;
    address: string; 
    payment: string; 
    addPayment?(value: HTMLElement):void;
    remPayment?():void;
}

//Интерфейс заполнения контактной информации
export interface IContactForm {
    email: string; 
    phone: string; 
}

//Интерфейс заказа
export interface IOrder extends IDeliveryForm, IContactForm {
    items: string[];
    total: number; 
}

//интерфейс валидации формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//интерфейс корзины
export interface IBasket {
    basketList: HTMLElement; 
    totalCost: number; 
    basketButton: HTMLButtonElement;
    products: HTMLElement[];
    cost: number;
}

//интерфейс успешное оформление заказа
export interface IOrderSuccess {
    closeButton: HTMLButtonElement;
    totalSpent: HTMLElement;
    count: number; 
}

//интерфейс действий над карточкой
export interface IOperation {
    Click: (event: MouseEvent) => void; 
}

//интерфейс действий окна успешного оформления заказа
export interface ISuccessOperation {
    Click: () => void;
}

//интерфейс главной страницы
export interface IPage {
    _wrapper: HTMLElement;
    _basket: HTMLElement;
    _counter: HTMLElement;
    _catalog: HTMLElement;
    catalog: HTMLElement[];
    counter: number;
    locked: boolean;
}

// интерфейс данных ответа сервера на создание заказа
export interface IOrderResult {
	id: string;
	total: number;
}
// Модальное окно
export interface IModal {
	content: HTMLElement;
    button?: HTMLButtonElement;
    render?(content: IModal): HTMLElement;
    open?():void;
    close?():void;
}