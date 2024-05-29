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

Тип для описания категории товара

```
export type Category =  'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
```
Интерфейс карточки товара
```
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: Category;
    price: number|null;
    selected?: boolean; 
}
```
Интерфейс данных пользователя
```
export interface IUser {
    adress: string;
    email: string;
    telephone: string;
    paymentWay: string
}
```
Интерфейс данных приложения
```
export interface IAppData {
    catalog: ICard[]; 
    basket: ICard[]; 
    order: IOrder | null; 
}
```
Интерфейс модального окна оформления заказа
```
export interface IOrderForm {
    address: string; 
    payment: string; 
}
```
Интерфейс 2 шага оформления заказа
```
export interface IContactForm {
    email: string; 
    phone: string; 
}
```
Интерфейс заказа
```
export interface IOrder extends IOrderForm, IContactForm {
    items: string[]; 
    total: number; 
}
```
Интерфейс корзины
```
export interface IBasket {
    items: HTMLElement[]; 
    price: number; 
}
```
Интерфейс успешное оформление заказа
```
export interface IOrderSuccess {
    id: string; 
    count: number; 
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой данных, отвечает за хранение и изменение данных;
- слой представления, отвечает за отображение данных на странице;
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Реализует взаимодействие с сервером. Позволяет осуществлять варианты запросов на сервер. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер.
- `post` — принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter 
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе.  Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

#### Класс Component
Основа для наследования другими классами приложения. Реализует инструментарий для работы с DOM в дочерних компонентах.
Конструктор принимает элемент разметки, в который будет вставлен компонент. Имеет следующие методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` — переключает класс у элемента
- `setText(element: HTMLElement, value: unknown)` — устанавливает текстовое содержимое элемента, проверяя наличие переданного элемента
- `setDisabled(element: HTMLElement, state: boolean)` — Сменить статус блокировки (делает элемент недоступным для взаимодействия)
- `setHidden(element: HTMLElement)` — делает элемент скрытым
- `setVisible(element: HTMLElement)` — делает элемент видимым
- `setImage(element: HTMLImageElement, src: string, alt?: string)` — Установить изображение с альтернативным текстом
- `render(data?: Partial<T>)` — Вернуть корневой DOM-элемент

#### Класс Model 
Класс для слоя данных. Связывает данные и события о которых нужно уведомлять подписчиков.

### Слой данных

#### Класс AppData
Класс для хранения данных и работы с данными. Позволяет получать, хранить, удалять данные, а так же осуществлять другие необходимые действия, которые станут необходимы в ходе реализации приложения.

### Слой представления

#### Класс Page

Добавляет список карточек и вешает слушатель на элемент корзины. Используется для управления состоянием страницы и отображением товаров на странице. Наследует класс Component.
Конструктор принимает:
- `container: HTMLElement` — контейнер для вставки карточек
- `events: IEvents` — объект событий

#### Класс Card

Используется для управления отображением данных в карточке товара. Наследует класс Component. 

#### Класс Basket

Компонент отображения корзины приложения. Устанавливает в разметку суммарную цену и элементы с товарами. Наследует класс Component. 

#### Класс Form 

Класс для работы с формами. Предоставляет функционал для проверки форм, валидации, рендера результата.

#### Класс OrderForm 

Класс для работы с формой заказа товара. Расширяет класс Form.

#### Класс ContactForm 

Класс для работы с формой заказа товара (2 этап - заполнения контактных данных). Расширяет класс Form.

#### Класс OrderSuccess

Используется для отображения финального сообщения об успешном оформлении заказа. 

#### Класс Modal 

Класс для работы с модальными окнами. Класс используется для отображения, открытия и закрытия  модального окна.