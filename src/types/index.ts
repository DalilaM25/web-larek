export type Category =  'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

//Интерфейс карточки товара
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: Category;
    price: number|null;
    selected?: boolean; 
}
//Интерфейс данных пользователя
export interface IUser {
    adress: string;
    email: string;
    telephone: string;
    paymentWay: string
}

//Интерфейс данных приложения
export interface IAppData {
    catalog: ICard[]; 
    basket: ICard[]; 
    order: IUser | null; 
}

//интерфейс окна формы
export interface IForm {
    valid: boolean; 
    errors: string[]; 
}

//интерфейс модального окна оформления заказа
export interface IOrderForm {
    address: string; 
    payment: string; 
}

//интерфейс 2 шага оформления заказа
export interface IContactForm {
    email: string; 
    phone: string; 
}

export interface IOrder extends IOrderForm, IContactForm {
    items: string[]; //список id товаров
    total: number; //общая сумма заказа
}

//интерфейс корзины
export interface IBasket {
    items: HTMLElement[]; //список товаров
    price: number; //итоговая стоимость заказа
}

//интерфейс успешное оформление заказа
export interface IOrderSuccess {
    id: string; 
    count: number; //списано синапсов
}