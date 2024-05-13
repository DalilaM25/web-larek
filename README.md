# Проектная работа "Веб-ларек"

Проект - одностраничный сайт осуществляющий возможность просмотра карточек с товарами для веб-разработчиков и последующего оформления. Реализует MVP паттерн.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

Карточка

```
 interface ICard {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number|null
}
```
Пользователь

```
interface IUser {
    adress: string,
    email: string,
    telephone: string,
    paymentWay: string
}
```
Коллекция карточек

```
interface ICardData {
    cards: ICard[],
    preview: string|null,
}
```
Коллекция товаров в корзине
```
interface IBasketData {
    items: TBasket[],
}
```
Данные карточки в окне просмотра карточки
 ```
 type TCardInfo = Pick<ICard,'description'|'image'|'title'|'category'|'price'>
 ```
Данные товара в корзине
 ```
 type TBasket = Pick<ICard,'title'|'price'>
 ```
 Данные способа оплаты и адреса в окне оформления товара
 ```
 type TPayment = Pick<IUser,'paymentWay'|'adress'>
 ```
 Данные пользователя в окне заказа
 ```
 type TUserData = Pick<IUser, 'telephone'|'email'>
 ```
