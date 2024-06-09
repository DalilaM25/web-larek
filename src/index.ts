import './scss/styles.scss';
import {cloneTemplate, ensureElement} from "./utils/utils";
import {API_URL, CDN_URL} from "./utils/constants";
import {IContactForm, IDeliveryForm, IOrder, IProduct} from "./types";
import {EventEmitter} from "./components/base/events";
import {AppAPI} from "./components/AppAPI";
import {AppState} from "./components/AppState";
import {CardOfProduct} from "./components/CardOfProduct";
import {Page} from "./components/Page";
import {Basket} from "./components/Basket";
import {Modal} from "./components/Modal";
import {DeliveryForm} from "./components/DeliveryForm";
import {ContactForm} from "./components/ContactForm";
import {OrderSuccess} from "./components/OrderSuccess";

const api = new AppAPI(CDN_URL, API_URL);
const events = new EventEmitter();

// Шаблоны
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//Модель данных
const appState = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new DeliveryForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactForm(cloneTemplate(contactsTemplate), events);


//Запрос данных с сервера
api.getList()
  .then(appState.createCardList.bind(appState))
  .catch((error) => {
       console.error(error);
  });

//Рендерим товары на странице
events.on('cards:create', () => {
    page.catalog = appState.cardList.map((card) => {
        const cardTemplate = new CardOfProduct(cloneTemplate(cardCatalogTemplate), {
            Click: () => events.emit('card:select', card),
        });
        return cardTemplate.render({
            title: card.title,
            description: card.description,
            category: card.category,
            image: card.image,
            price: card.price,
            id: card.id,
        });
    });
});

//Посмотреть товар в модальном окне
events.on('card:select', (product: IProduct) => {
    events.emit('modal:open');
    const card = new CardOfProduct(cloneTemplate(cardPreviewTemplate), {
        Click: () => { events.emit('product:add', product) },
    });
    modal.render({
        content: card.render({
            title: product.title,
            description: product.description,
            category: product.category,
            image: product.image,
            price: product.price,
            id: product.id,
            selected: product.selected,
        }),
    });
});

//Открыть корзину
events.on('basket:open', () => {
    events.emit('modal:open');
    basket.cost = appState.totalPrice()
	basket.setDisabled(basket.basketButton, appState.isBasketEmpty);
	let i = 1;
	basket.products = appState.basket.map((product) => {
		const card = new CardOfProduct(cloneTemplate(cardBasketTemplate), {
			Click: () => events.emit('product:delete', product),
		});
		return card.render({
			title: product.title,
			price: product.price,
			index: i++,
		});
	});
	modal.render({
		content: basket.render(),
	});

});

//Добавить товар в корзину
events.on('product:add', (product: IProduct) => {
    appState.addOrder(product);
    appState.addBasket(product);
    page.counter = appState.basket.length;
    product.selected = true;
    modal.close();
});

//Удалить товар из корзины
events.on('product:delete', (product: IProduct) => {
    appState.remOrder(product);
    appState.remBasket(product);
    page.counter = appState.basket.length;
    basket.cost = appState.totalPrice();
    basket.setDisabled(basket.basketButton, appState.isBasketEmpty);
    product.selected = false;
    events.emit('basket:open');
});

// Модальное окно заказа
events.on('order:open', () => {
    modal.render({
        content: delivery.render({
            address: '',
			payment: '',
            errors: [],
            valid: false,
        }),
    });
});

// Модальное окно заполнения контактной информации
events.on('order:submit', () => {
	appState.order.total = appState.totalPrice();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

//Блок прокрутки страницы при открытой модалке
events.on('modal:open', () => {
    page.locked = true;
});

//Разблокировка прокрутки со страницы
events.on('modal:close', () => {
    page.locked = false;
});

// Запуск валидации
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	delivery.valid = !address && !payment;
	contacts.valid = !email && !phone;
	delivery.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Выбор способа оплаты
events.on('payment:change', (item: HTMLButtonElement) => {
	appState.order.payment = item.name;
	appState.validateDelivery();
});

// Изменение поля доставки
events.on('order:change', (data: { field: keyof IDeliveryForm; value: string }) => {
		appState.setDelyveryField(data.field, data.value);
	}
);

// Изменение поля контактов
events.on('contacts:change', (data: { field: keyof IContactForm; value: string }) => {
		appState.setContactField(data.field, data.value);
	}
);

//Отправляем форму контактов и открываем окно с успешным заказом
events.on('contacts:submit', () => {
	api
		.makeOrder(appState.order)
		.then((res) => {
			const success = new OrderSuccess(cloneTemplate(successTemplate), {
				Click: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
				count: res.total,
				}),
			});

			page.counter = 0;
			appState.clearBasket();
		})
		.catch((error) => {console.error(error)});
});