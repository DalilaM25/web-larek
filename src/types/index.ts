export interface ICard {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number|null
}

export interface IUser {
    adress: string,
    email: string,
    telephone: string,
    paymentWay: string
}

export interface ICardData {
    cards: ICard[],
    preview: string|null,
}

export interface IBasketData {
    items: TBasket[],
}

export type TCardInfo = Pick<ICard,'description'|'image'|'title'|'category'|'price'>
export type TBasket = Pick<ICard,'title'|'price'>
export type TPayment = Pick<IUser,'paymentWay'|'adress'>
export type TUserData = Pick<IUser, 'telephone'|'email'>

//TODO тип главной страницы
