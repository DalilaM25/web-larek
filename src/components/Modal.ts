import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Component } from './base/Component';
import { IModal, ModalRender} from '../types';

export class Modal extends Component<ModalRender> implements IModal {
	protected button: HTMLButtonElement;
	protected сontent: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.сontent = ensureElement<HTMLElement>('.modal__content', container);
		this.button = ensureElement<HTMLButtonElement>('.modal__close', container);
		this.сontent.addEventListener('click', (event) => event.stopPropagation());
		this.container.addEventListener('click', this.close.bind(this));
		this.button.addEventListener('click', this.close.bind(this));
	}

	set content(content: HTMLElement) {
		this.сontent.replaceChildren(content);
	}

	render(content: ModalRender): HTMLElement {
		super.render(content);
		this.open();
		return this.container;
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
		this.content = null;
	}
}
