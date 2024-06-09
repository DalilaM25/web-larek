export type CategoryColorsList =  'софт-скил' | 'хард-скил' | 'дополнительное' | 'другое' | 'кнопка' ;

//товар
export interface IProduct {
    title: string;
    id: string;
    category: CategoryColorsList;
    description: string;
    image: string;
    price: number | null;
    selected: boolean;
}
// карточка товара
export interface ICardOfProduct extends IProduct {
    selected: boolean; 
    index?: number;
}

//Интерфейс данных приложения
export interface IAppState {
    cardList: IProduct[]; 
    basket: IProduct[]; 
    order: IOrder | null; 
}

//интерфейс окна формы
export interface IForm {
    errors: string[]; 
    valid: boolean; 
}

//интерфейс модального окна заказа
export interface IDeliveryForm {
    address: string; 
    payment: string; 
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
    basketList: HTMLElement[]; 
    totalCost: number; 
}

//интерфейс успешное оформление заказа
export interface IOrderSuccess {
    id: string; 
    count: number; //списано синапсов
}

//интерфейс действий над карточкой
export interface ICardOperation {
    Click: (event: MouseEvent) => void; 
}

//интерфейс действий окна успешного оформления заказа
export interface ISuccessOperation {
    Click: () => void; //по клику
}

//интерфейс главной страницы
export interface IPage {
    productList: HTMLElement[]; 
}

// интерфейс данных ответа сервера на создание заказа
export interface IOrderResult {
	total: number; 
}
