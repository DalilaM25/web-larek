import {IEvents} from './events';

/**
 * Класс для слоя данных. Связывает данные и события о которых нужно уведомлять подписчиков.
Конструктор принимает данные `data: Partial<T>` и события `events: IEvents`. Есть метод `emitChanges` - вызывает метод emit базового класса Events и сообщает об изменении данных.
 */
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }
    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }
}
