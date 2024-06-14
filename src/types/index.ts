export type Category =
	| 'софт-скил'
	| 'хард-скил'
	| 'дополнительное'
	| 'другое'
	| 'кнопка';

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
export interface ICardOfProduct {
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
	isBasketEmpty(): boolean;
	createCardList(cards: IProduct[]): void;
	totalPrice(): number;
	addBasket(product: IProduct): void;
	remBasket(product: IProduct): void;
	getOrder(): void;
	clearBasket(): void;
	getItemsInBasket(): IProduct[];
	getBasketProductIndex(product: IProduct): number;
	setPayment(value: string): void;
	setAddress(value: string): void;
	setPreview(product: IProduct): void;
	setOrderField(
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>,
		value: string
	): void;
	validateOrder(): boolean;
}

//интерфейс окна формы
export interface IForm<T> {
	set errors(value: string);
	set valid(value: boolean);
	render(data: Partial<T> & IForm<T>): void;
}

//интерфейс модального окна заказа
export interface IDeliveryForm {
	payment: string;
	set address(value: string);
	addPayment(value: HTMLElement): void;
	remPayment(): void;
}

//Интерфейс заполнения контактной информации
export interface IContactForm {
	email: string;
	phone: string;
}

//Интерфейс заказа
export interface IOrder
	extends Omit<
			IDeliveryForm,
			'addPayment' | 'remPayment' | 'onlinePayment' | 'cashPayment'
		>,
		IContactForm {}

//интерфейс валидации формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//интерфейс корзины
export interface IBasket {
	set products(products: HTMLElement[]);
	set cost(cost: number);
}

//интерфейс успешное оформление заказа
export interface IOrderSuccess {
	set count(total: number | string);
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
	set catalog(items: HTMLElement[]);
	set counter(value: number);
	set locked(value: boolean);
}

// интерфейс данных ответа сервера на создание заказа
export interface IOrderResult {
	id: string;
	total: number;
}
// Модальное окно
export interface IModal {
	set content(content: HTMLElement);
	render(content: ModalRender): HTMLElement;
	open(): void;
	close(): void;
}

export type ModalRender = Pick<IModal, 'content'>;
