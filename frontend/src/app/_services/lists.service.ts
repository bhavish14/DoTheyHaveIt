import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ListsService {

  private itemsList: Object[] = [];
  private storeList: Object = {};

  getList(): Object {
    return this.storeList;
  }

  addToList(product: any, store: any): void {
    let storeId = store.store_id;
    product = {
      title: product.title,
      price: product.price,
      image: product.image_url,
    };

    store = {
      store_id: store.store_id,
      store_address: store.store_address,
      store_distance: store.distance,
      store_name: store.store_name,
      store_begin_time: store.begin_time,
      store_end_time: store.end_time,
      items: [
        product,
      ],
    };

    if (this.storeList[storeId]) {
      this.storeList[storeId].items.push(product);
    } else {
      this.storeList[storeId] = store;
    }
  };

  removeFromList(product: any, store: any): void {
  };

  emptyList(): void {
    this.storeList = {};
  };
}