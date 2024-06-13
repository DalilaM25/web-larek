import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { IOrder, IProduct } from './types';
import { EventEmitter } from './components/base/events';
import { AppAPI } from './components/AppAPI';
import { AppState } from './components/AppState';
import { CardOfProduct, BasketItem } from './components/CardOfProduct';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { Modal } from './components/Modal';
import { DeliveryForm } from './components/DeliveryForm';
import { ContactForm } from './components/ContactForm';
import { OrderSuccess } from './components/OrderSuccess';

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
const appState = new AppState(events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new DeliveryForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactForm(cloneTemplate(contactsTemplate), events);
const success = new OrderSuccess(cloneTemplate(successTemplate), {
	Click: () => {
		modal.close();
	},
});

//Запрос данных с сервера
api
	.getList()
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

// Отправить в превью карточку
events.on('card:select', (product: IProduct) => {
	appState.setPreview(product);
});

// Открыть превью карточки товара
events.on('preview:changed', (product: IProduct) => {
	const card = new CardOfProduct(cloneTemplate(cardPreviewTemplate), {
		Click: () => {
			events.emit('product:add', product);
			events.emit('preview:changed', product);
		},
	});
	modal.render({
		content: card.render({
			title: product.title,
			description: product.description,
			category: product.category,
			image: product.image,
			price: product.price,
			id: product.id,
			buttonName: appState.basket.map((el) => el.id).includes(product.id)
				? 'Уже в корзине'
				: 'В корзину',
		}),
	});
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Изменились товары в корзине
events.on('basket:changed', () => {
	page.counter = appState.getItemsInBasket().length;
	basket.products = appState.getItemsInBasket().map((product) => {
		const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
			Click: () => {
				events.emit('product:delete', product);
			},
		});

		basketItem.index = appState.getBasketProductIndex(product);

		return basketItem.render({
			title: product.title,
			price: product.price,
		});
	});
	basket.cost = appState.totalPrice();
});

//Добавить товар в корзину
events.on('product:add', (product: IProduct) => {
	appState.addBasket(product);
});

//Удалить товар из корзины
events.on('product:delete', (product: IProduct) => {
	appState.remBasket(product);
});

// Модальное окно заказа
events.on('order:open', () => {
	modal.render({
		content: delivery.render({
			address: '',
			payment: '',
			errors: '',
			valid: false,
		}),
	});
});

// Модальное окно заполнения контактной информации
events.on('order:submit', () => {
	appState.getOrder().total = appState.totalPrice();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: '',
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
events.on(
	'payment:change',
	(data: { payment: string; button: HTMLElement }) => {
		appState.setPayment(data.payment);
		delivery.addPayment(data.button);
		appState.validateOrder();
	}
);

// Изменение поля доставки
events.on(
	'order:change',
	(data: {
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
		value: string;
	}) => {
		appState.setOrderField(data.field, data.value);
	}
);

// Изменение поля контактов
events.on(
	'contacts:change',
	(data: {
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
		value: string;
	}) => {
		appState.setOrderField(data.field, data.value);
	}
);

//Отправляем форму контактов и открываем окно с успешным заказом
events.on('contacts:submit', () => {
	api
		.makeOrder(appState.getOrder())
		.then((res) => {
			success.count = res.total; // Обновляем контент в существующем инстансе
			modal.render({ content: success.render() });
			appState.clearBasket();
		})
		.catch((error) => {
			console.error(error);
		});
});
