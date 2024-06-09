# Проектная работа "Веб-ларек"

Проект - одностраничный сайт осуществляющий возможность просмотра карточек с товарами для веб-разработчиков и последующего оформления заказа. Реализует MVP паттерн.

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
export type CategoryColorsList =  'софт-скил' | 'хард-скил' | 'дополнительное' | 'другое' | 'кнопка';
```
товар
```
export interface IProduct {
    title: string;
    id: string;
    category: CategoryColorsList;
    description: string;
    image: string;
    price: number | null;
    selected: boolean;
}
```
карточка товара
```
export interface ICardOfProduct extends IProduct {
    selected: boolean; 
    index?: number;
}
```
Интерфейс данных приложения
```
interface IAppState {
    cardList: IProduct[]; 
    basket: IProduct[]; 
    order: IOrder | null;
}
```
Интерфейс окна формы
```
interface IForm {
    errors: string[]; 
    valid: boolean; 
}
```
Интерфейс модального окна заказа
```
interface IDeliveryForm {
    address: string; 
    payment: string; 
}
```
Интерфейс заполнения контактной информации
```
interface IContactForm {
    email: string; 
    phone: string; 
}
```
Интерфейс заказа
```
interface IOrder extends IDeliveryForm, IContactForm {
    items: string[]; 
    total: number; 
}
```

Интерфейс валидации формы
```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```
Интерфейс корзины
```
interface IBasket {
    basketList: HTMLElement[]; 
    totalCost: number; 
}
```
Интерфейс успешное оформление заказа
```
interface IOrderSuccess {
    id: string; 
    count: number; 
}
```
Интерфейс действий над карточкой
```
interface ICardOperation {
    Click: (event: MouseEvent) => void; 
}
```

Интерфейс действий окна успешного оформления заказа
```
interface ISuccessOperation {
    Click: () => void; 
}
```
интерфейс главной страницы
```
interface IPage {
    productList: HTMLElement[]; //список товаров
}
```
Интерфейс данных ответа сервера на создание заказа
```
interface IOrderResult {
	total: number; 
}
```


## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой данных, отвечает за хранение и изменение данных;
- слой представления, отвечает за отображение данных на странице;
- презентер, отвечает за связь представления и данных (index.ts).

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
Основа для наследования  классами реализующими слой представления. Реализует инструментарий для работы с DOM в дочерних компонентах.
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
Конструктор принимает данные `data: Partial<T>` и события `events: IEvents`. Есть метод `сhangeEmitter` - вызывает метод emit базового класса Events и сообщает об изменении данных.

### Слой данных (реализация слоя Model)

#### Класс AppState
Класс для хранения данных и работы с данными. Позволяет получать, хранить, удалять данные, а так же осуществлять другие необходимые действия, которые станут необходимы в ходе реализации приложения. Наследует класс Model.

Свойства:
- `cardList: IProduct[]` - массив товаров
- `basket: IProduct[]` - массив товаров в корзине
- `order: IOrder` - заказ для отправки на сервер

Методы:

  - `createCardList(cards: IProduct[]): void` - добавляет карточки товаров в массив
  - `addBasket(product: IProduct): void`- добавляет товар в корзину
   - `remBasket(product: IProduct): void`- удаляет товар из корзины
  -  `clearBasket(): void` - очищает всю корзину
   - `totalPrice(): void` - считает общую стоимость товаров в корзине
  -  `addOrder(product: IProduct)`- сохраняет данные заказа
  -  `remOrder(product: IProduct)`- удаляет данные заказа
  -  `get isBasketEmpty()`- проверяет пустоту корзины

#### Класс AppAPI
Класс для взаимодействия с сервером, наследуется от класса Api (реализация слоя Model). Методы класса используются для получения данных с сервера и предоставления данных в Presenter для отображения в компонентах (View)
Методы:
- `getList(): Promise<ICardOfProduct[]>` - получить список товаров
- `makeOrder(value: IOrder): Promise<IOrderResult>` - отправляет заказ


### Слой представления (реализация слоя View)

#### Класс Page

Добавляет список карточек и вешает слушатель на элемент корзины. Используется для управления состоянием страницы и отображением товаров на странице. Наследует класс Component.

Конструктор принимает:
- `container: HTMLElement` — контейнер для вставки карточек
- `events: IEvents` — объект событий

Метод:
- `set catalog(items: HTMLElement[])` — добавляет каталог товаров на главной странице
- `set counter(value: number)` - устанавливает счетчик товаров на корзину
- `set locked(value: boolean)` - устанавливает блокировку прокрутки
 
#### Класс CardOfProduct

Используется для управления отображением данных в карточке товара. Наследует класс Component.

Конструктор принимает:
- `container: HTMLElement` — контейнер для вставки карточки

Свойства:
- `_category: HTMLElement` — категория товара
- `_title: HTMLElement` — наименование товара
- `_text: HTMLElement | null;` - описание товара
- `_image: HTMLImageElement` — изображение товара
- `_price: HTMLElement | null` — цена товара
- `_button: HTMLButtonElement | null` - кнопка
Методы:
- `set price(price: number | null)` — установить цену
- `set category(text: CategoryColorsList)` — установить категорию 
- `set image(link: string)` — установить изображение
- `set title(value: string)` — установить название 
- `set description(text: string)` - установка описания в карточку
- `set selected(value: boolean) ` - установить выбран ли товар

#### Класс Basket

Компонент отображения корзины приложения. Устанавливает в разметку суммарную цену и элементы с товарами. Наследует класс Component. 

Конструктор принимает:
- `container: HTMLElement` — контейнер для вставки данных
- `events: EventEmitter` — объект событий

Свойства:
- `basketList: HTMLElement` — список товаров в корзине
- `numeration: HTMLElement` — элемент нумерации списка
- `totalCost: HTMLElement | null` — элемент с финальной ценой
- `basketButton: HTMLButtonElement | null;` — элемент кнопки

Методы:
- `set products(products: HTMLElement[])` — установить список товаров 
- `set cost(cost: number)` — установить общую стоимость
- `set selected(items: string[])` — блок кнопки в пустой корзине

#### Класс Form 

Класс для работы с формами. Предоставляет функционал для проверки форм, валидации, рендера результата.

Свойства:
- `submitButton: HTMLButtonElement` — кнопка отправки формы
- `formErrors: HTMLElement` — элемент для отображения ошибки

Методы:
- `set valid(value: boolean): void` - установка значения валидности
- `set valid(value: boolean): void` - делает кнопку неактивной при наличии ошибки в поле
- `set errors(value: string): void` - передача ошибок в форме
- `render(data: Partial<T> & IForm): void` - отрисовка формы

#### Класс DeliveryForm 

Класс для работы с формой заказа товара. Расширяет класс Form.

Свойства класса:
- `formButtons: HTMLButtonElement[];` — кнопки формы

Методы:
- `set address(text: string)` — устанавливает адрес доставки
- `set payment(value: string) ` — устанавливает способ оплаты

#### Класс ContactForm 

Класс для работы с формой заказа товара (2 этап - заполнения контактных данных). Расширяет класс Form.

Методы:
- `set email(text: string): void` — устанавливает email
- `set phone(value: string): void` — устанавливает телефон

#### Класс OrderSuccess

Используется для отображения финального сообщения об успешном оформлении заказа. 

Конструктор принимает:
- `container: HTMLFormElement`
- `events: IEvents`

Свойства:
- `closeButton: HTMLButtonElement` — кнопка закрытия окна
- `totalSpent: HTMLElement` — общее число синапсов

Методы:
- `set count(total: number | string)` — устанавливает списанное число синапсов

#### Класс Modal 

Класс для работы с модальными окнами. Класс используется для отображения, открытия и закрытия  модального окна.

Конструктор принимает:
- `container: HTMLFormElement` — контейнер для вставки данных
- `events: IEvents` — объект событий

Свойства:
- `button: HTMLButtonElement` 
- `сontent: HTMLElement`

Методы:
- `set content(content: HTMLElement): void` - устанавливает содержимое в модальном окне
- `render(content: IModal): HTMLElement ` - отрисовывает модальное окно
- `open(): void` - открыть модальное окно
- `close(): void` - закрыть модальное окно