import {IOrder, IOrderResult, ICardOfProduct} from '../types';
import {Api, ApiListResponse} from './base/api';
export interface IAppAPI {
    getList: () => Promise<ICardOfProduct[]>;
}
export class AppAPI extends Api implements IAppAPI {
    constructor(readonly cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getList(): Promise<ICardOfProduct[]> {
        return this.get('/product').then((data: ApiListResponse<ICardOfProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }
    
    makeOrder(value: IOrder): Promise<IOrderResult> {
		return this.post('/order', value).then((data: IOrderResult) => data);
	}
}


