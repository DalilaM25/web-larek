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
export type Category =
	| 'софт-скил'
	| 'хард-скил'
	| 'дополнительное'
	| 'другое'
	| 'кнопка';
```
товар
```
export interface IProduct {
    title: string;
    id?: string;
    category: Category;
    description?: string;
    image: string;
    price: number | null;
    buttonName?: string;
}
```
карточка товара
```
export interface ICardOfProduct {
    set price(price: number | null);
	set category(text: Category);
	set image(link: string);
	set title(text: string);
	set description(text: string);
	set buttonName(value: string);
}
```
Интерфейс данных приложения
```
interface IAppState {
    cardList: IProduct[];
	basket: IProduct[];
	order: IOrder | null;
	preview: string | null;
	formErrors: FormErrors;
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
```
Интерфейс окна формы
```
 interface IForm<T> {
	set errors(value: string);
	set valid(value: boolean);
	render(data: Partial<T> & IForm<T>): void;
 }
```
Интерфейс модального окна заказа
```
interface IDeliveryForm {
    get onlinePayment(): HTMLButtonElement;
	get cashPayment(): HTMLButtonElement;
	set address(value: string);
	payment: string;
	addPayment(value: HTMLElement): void;
	remPayment(): void;
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
interface IOrder
	extends Omit<
			IDeliveryForm,
			'addPayment' | 'remPayment' | 'onlinePayment' | 'cashPayment'
		>,
		IContactForm {}
```

Интерфейс валидации формы
```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```
Интерфейс корзины
```
interface IBasket {
    set products(products: HTMLElement[]);
	set cost(cost: number);
}
```
Интерфейс успешное оформление заказа
```
interface IOrderSuccess {
    set count(total: number | string);
}
```
Интерфейс действий над карточкой
```
interface IOperation {
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
    set catalog(items: HTMLElement[]);
	set counter(value: number);
	set locked(value: boolean);
}
```
Интерфейс данных ответа сервера на создание заказа
```
interface IOrderResult {
	id: string;
	total: number;
}
```
Интерфейс модального окна
```
interface IModal {
	set content(content: HTMLElement);
	render(content: IModal): HTMLElement;
	open(): void;
	close(): void;
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


### Слой данных (реализация слоя Model)

#### Класс AppState
Класс для хранения данных и работы с данными. Позволяет получать, хранить, удалять данные, а так же осуществлять другие необходимые действия, которые станут необходимы в ходе реализации приложения. 
Конструктор принимает:
- `events: IEvents` — объект событий
Свойства:
- `cardList: IProduct[]` - массив товаров
- `basket: IProduct[]` - массив товаров в корзине 
- `protected formErrors: FormErrors` - ошибки валидации форм 
- `protected preview: string | null` - id карточки для превью 
- `protected order: IOrder` - информация заказа 
Методы:
- `isBasketEmpty(): boolean` - проверяет пустоту корзины
- `createCardList(cards: IProduct[]) : void` - добавляет карточки товаров в массив
- `totalPrice(): number` - считает общую стоимость товаров в корзине
- `addBasket(product: IProduct): void` - добавляет товар в корзину
- `remBasket(product: IProduct): void` - удаляет товар из корзины
- `getOrder(): void` - создает объект заказа 
- `clearBasket(): void` - очищает всю корзину
- `getItemsInBasket(): IProduct[]` - получить продукты в корзине
- `getBasketProductIndex(product: IProduct): number` - получить индекс продукта в корзине
- `setPayment(value: string):void` - установить способ оплаты
- `setAddress(value: string):void` - установить адресс
- `setPreview(product: IProduct) :void` - устаналивает в параметре превью id выбранной карточки
- `setOrderField(field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>,value: string):void` - устанавливает значения заказа полей address, phone и email
- `validateOrder():void` - выводит подсказки о пустых полях заказа

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

Свойства:

- `protected _wrapper: HTMLElement` - контейнер для блока скролла при открытом модальном окне
- `protected _basket: HTMLElement` - элемент корзины
- `protected _counter: HTMLElement` - элемент счетчика корзины
- `protected _catalog: HTMLElement` - контейнер для отображения карточек

Методы:
- `set catalog(items: HTMLElement[])` — добавляет каталог товаров на главной странице
- `set counter(value: number)` - устанавливает счетчик товаров на корзину
- `set locked(value: boolean)` - устанавливает блокировку прокрутки
 
#### Класс CardOfProduct

Используется для управления отображением данных в карточке товара. Наследует класс Component.

Конструктор принимает:

- `container: HTMLElement` — контейнер для вставки карточки
- `operation?: IOperation` — действие над карточкой

Свойства:
- `protected _category: HTMLElement` — категория товара
- `protected _title: HTMLElement` — наименование товара
- `protected _text: HTMLElement | null;` - описание товара
- `protected _image: HTMLImageElement` — изображение товара
- `protected _price: HTMLElement | null` — цена товара
- `protected _button: HTMLButtonElement | null` - кнопка
Методы:
- `set price(price: number | null)` — установить цену
- `set category(text: CategoryColorsList)` — установить категорию 
- `set image(link: string)` — установить изображение
- `set title(value: string)` — установить название 
- `set description(text: string)` - установка описания в карточку
- `set buttonName(value: string)` - установить текст на кнопке

#### Класс Basket

Компонент отображения корзины приложения. Устанавливает в разметку суммарную цену и элементы с товарами. Наследует класс Component. 

Конструктор принимает:
- `container: HTMLElement` — контейнер для вставки данных
- `events: EventEmitter` — объект событий

Свойства:
- `protected basketList: HTMLElement` — список товаров в корзине
- `protected totalCost: HTMLElement | null` — элемент с финальной ценой
- `protected basketButton: HTMLButtonElement` — элемент кнопки

Методы:
- `set products(products: HTMLElement[])` — установить список товаров 
- `set cost(cost: number)` — установить общую стоимость

#### Класс Form 

Класс для работы с формами. Предоставляет функционал для проверки форм, валидации, рендера результата.

Свойства:
- `protected submitButton: HTMLButtonElement` — кнопка отправки формы
- `protected formErrors: HTMLElement` — элемент для отображения ошибки

Методы:
- `set valid(value: boolean)` - установка значения валидности
- `set errors(value: string)` - передача ошибок в форме
- `render(data: Partial<T> & IForm): void` - отрисовка формы
- `protected inputChange(field: keyof T, value: string):void`- валидация поля

#### Класс DeliveryForm 

Класс для работы с формой заказа товара. Расширяет класс Form.

Свойства класса:
- `protected _onlinePayment: HTMLButtonElement` — элемент выбора оплаты онлайн
- `protected _cashPayment: HTMLButtonElement` — элемент выбора оплаты при получении
- `payment: string` — название способа оплаты
Методы:
- `set address(text: string)` — устанавливает адрес доставки
- `addPayment(value: HTMLElement): void ` — устанавливает способ оплаты
- `remPayment():void ` — снимает способ оплаты

#### Класс ContactForm 

Класс для работы с формой заказа товара (2 этап - заполнения контактных данных). Расширяет класс Form.

Конструктор принимает:
- `container: HTMLFormElement`
- `events: IEvents`

Методы:
- `set email(text: string): void` — устанавливает email
- `set phone(value: string): void` — устанавливает телефон

#### Класс OrderSuccess

Используется для отображения финального сообщения об успешном оформлении заказа. 

Конструктор принимает:
- `container: HTMLFormElement`
- `events: IEvents`

Свойства:
- `protected closeButton: HTMLButtonElement` — кнопка закрытия окна
- `protected totalSpent: HTMLElement` — общее число синапсов

Методы:
- `set count(total: number | string)` — устанавливает списанное число синапсов

#### Класс Modal 

Класс для работы с модальными окнами. Класс используется для отображения, открытия и закрытия  модального окна.

Конструктор принимает:
- `container: HTMLFormElement` — контейнер для вставки данных
- `events: IEvents` — объект событий

Свойства:
- `protected button: HTMLButtonElement` - кнопка модального окна
- `protected сontent: HTMLElement` - содержимое модального окна

Методы:
- `set content(content: HTMLElement): void` - устанавливает содержимое в модальном окне
- `render(content: ModalRender): HTMLElement ` - отрисовывает модальное окно
- `open(): void` - открыть модальное окно
- `close(): void` - закрыть модальное окно