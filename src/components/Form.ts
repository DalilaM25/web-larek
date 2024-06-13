import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {IForm} from "../types";
import {ensureElement} from "../utils/utils";

export class Form<T> extends Component<any> implements IForm<T> {
    protected submitButton: HTMLButtonElement;
    protected formErrors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.container.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.inputChange(field, value);
        });
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
        this.container.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }
 
    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this.formErrors, value);
    }

    protected inputChange(field: keyof T, value: string) {
        this.events.emit(`order:change`, {field,value});
    }

    render(data: Partial<T> & Pick<IForm<T>, 'errors' | 'valid'>) {
        const {  errors, valid, ...inputs } = data;
        super.render({ errors, valid });
        Object.assign(this, inputs);
        return this.container;
    }
}
