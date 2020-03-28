import { Component, OnInit, Input } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

// service
import { TargetService } from 'src/app/_services/target.service';
import { WalmartService } from './../../_services/walmart.service';

@Component({
  selector: 'app-walmart',
  templateUrl: './walmart.component.html',
  styleUrls: ['./walmart.component.css']
})
export class WalmartComponent implements OnInit {
  @Input() mileRange: number = 0;
  @Input() postalCode: number = 0;
  @Input() searchQuery: string = null;

  allProducts: Object[] = [];
  loaded: boolean = false;
  errorMsg: string = null;
  page: number = 0;
  totalPages: number = 0;
  onPage: number[] = [1, 0, 0, 0];

  constructor(
    private router: Router,
    private targetService: TargetService,
    private walmartService: WalmartService,
  ) { }

  ngOnInit(): void {

    this.walmartService.getStores(this.postalCode, this.mileRange).pipe().subscribe(res => {
      let allStores = res.data?.payload?.storesData?.stores;
      if (allStores) {

        let storeIDS = [];
        let storeProductRequests = [];
        allStores.forEach(e => {
          storeIDS.push(e.id);
        });

        storeIDS = storeIDS.slice(0, 10);

        storeIDS.forEach(e => {
          storeProductRequests.push(
            this.walmartService
              .getProducts(e, this.searchQuery)
              .pipe(catchError(err => of(err.status)))
          );
        });

        forkJoin(storeProductRequests).subscribe((res: any) => {
          res = res.map((e, idx) => {
            e.store = allStores.filter(e => e.id == storeIDS[idx])[0];
            return e;
          });

          let products = [];
          let storeOne = res[0].results;
          storeOne.forEach(e => {
            products.push({
              id: e.productId.productId,
              name: e.name,
              image: e.images.thumbnailUrl,
              rating: String(e.ratings.rating).substring(0, 3),
              locations: [],
              out_of_stock: true,
            });
          });

          products = products.map(e => {
            let id = e.id;
            let productResultSet = [];
            let noStockExists = true;

            res.forEach(e => {
              let store = e.store;
              let results = e.results;
              results = results.filter(e => e.productId.productId == id);
              results = results[0];
              if (results) {
                results.store = store;
              }
              productResultSet.push(results);
            });

            productResultSet = productResultSet.filter(e => e);
            productResultSet = productResultSet.map(e => {
              if (e.inventory.quantity > 0) {
                noStockExists = false;
              } else {

              }
              return {
                store: e.store,
                inventory: e.inventory,
              };
            });

            productResultSet = productResultSet.slice(0, 3);

            e.out_of_stock = noStockExists;
            this.allProducts.push(e);
            e.locations = productResultSet;
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

          this.loaded = true;
        });
      }
    }, err => {
      console.log(err);
      this.errorMsg = 'uh-oh! Failed to load the results.'
    });
  }

  goBack(): void {
    this.errorMsg = null;
    this.router.navigate(['/home']);
  }

  navigatePage(page): void {
    this.onPage = [0, 0, 0, 0];
    this.page = page;
    this.onPage[page] = 1;
  }

}
