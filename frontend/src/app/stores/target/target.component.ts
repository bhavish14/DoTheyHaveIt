import { Component, OnInit, Input } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

// services
import { TargetService } from 'src/app/_services/target.service';
@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.css'],
})
export class TargetComponent implements OnInit {
  @Input() mileRange: number = 0;
  @Input() postalCode: number = 0;
  @Input() searchQuery: string = null;

  allProducts: Object[] = [];
  loaded: boolean = false;
  errorMsg: string = null;
  page: number = 0;
  totalPages: number = 0;
  onPage: number[] = [1, 0, 0, 0];
  constructor(private targetService: TargetService, private router: Router) { }

  ngOnInit(): void {

    this.targetService
      .getStores(this.postalCode, this.mileRange)
      .pipe()
      .subscribe(store_object => {
        let stores = store_object;
        let allStoreIds = [];
        stores = stores[0].locations;
        stores = stores.map(e => {
          allStoreIds.push(e.location_id);
          return {
            store_id: e.location_id,
            sub_type_code: e.sub_type_code,
            address: e.address,
            distance: e.distance,
            begin_time:
              e.rolling_operating_hours.regular_event_hours.days[0].hours[0]
                .begin_time,
            end_time:
              e.rolling_operating_hours.regular_event_hours.days[0].hours[0]
                .end_time,
          };
        });
        let pricingStoreId = stores[0]?.store_id;

        if (pricingStoreId) {
          this.targetService
            .getProducts(pricingStoreId, this.searchQuery)
            .pipe()
            .subscribe(
              products_object => {
                let productsCall = [];
                let productIds = [];

                if (products_object.search_response.items) {
                  let products = products_object.search_response.items.Item;
                  products = products.map(e => {
                    productIds.push(e.tcin);
                    return {
                      title: e.title,
                      tcin: e.tcin,
                      price: e.price.current_retail,
                      description: e.description,
                      image_url: `${e.images[0].base_url}${e.images[0].primary}`,
                      average_rating: e.average_rating,
                      url: `https://www.target.com${e.url}`,
                    };
                  });

                  productIds.forEach(e => {
                    productsCall.push(
                      this.targetService
                        .getProductStocks(e, this.mileRange, this.postalCode)
                        .pipe(catchError(err => of(err.status))),
                    );
                  });

                  forkJoin(productsCall).subscribe(res => {
                    res.map((e: any) => {
                      if (e.data) {
                        let productId = e.data.product_id;
                        let data = e.data.locations;
                        let thisProduct = products.filter(
                          e => e.tcin == productId,
                        )[0];
                        let productObject = {
                          title: thisProduct.title,
                          price: thisProduct.price,
                          image_url: thisProduct.image_url,
                          rating: thisProduct.average_rating,
                          locations: [],
                          out_of_stock: true,
                          url: thisProduct.url,
                        };

                        data = data.map(store => {
                          let storeID = store.location_id;
                          let thisStore = stores.filter(
                            e => e.store_id == storeID,
                          );
                          if (
                            store.location_available_to_promise_quantity > 0
                          ) {
                            productObject.out_of_stock = false;
                            productObject.locations.push({
                              distance: store.distance,
                              store_address: store.store_address,
                              store_name: store.store_name,
                              stock:
                                store.location_available_to_promise_quantity,
                              begin_time: thisStore[0]?.begin_time.substring(
                                0,
                                2,
                              ),
                              end_time: thisStore[0]?.end_time.substring(0, 2),
                            });
                          }
                          return store;
                        });
                        productObject.locations = productObject.locations.slice(0, 3);

                        this.allProducts.push(productObject);
                        this.loaded = true;
                      }
                      return e;
                    });

                    let testArray = [
                      this.allProducts.slice(0, 6),
                      this.allProducts.slice(6, 12),
                      this.allProducts.slice(12, 18),
                      this.allProducts.slice(18, 24),
                      // this.allProducts.slice(20, 24),
                    ];

                    testArray = testArray.filter(e => e.length > 0);
                    this.allProducts = testArray;
                    this.totalPages = testArray.length;
                  });
                } else {
                  this.errorMsg = 'Uh-oh! No products found';
                }
              },
              err => {
                this.errorMsg = 'Uh-oh! No products found';
              },
            );
        } else {
          console.log('no stores found nearby');
          this.errorMsg = 'Uh-oh! No stores found nearby';
        }
      });
  }


  navigatePage(page): void {
    this.onPage = [0, 0, 0, 0];
    this.page = page;
    this.onPage[page] = 1;
  }
}
