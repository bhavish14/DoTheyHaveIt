import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class WalmartService {
  constructor(private http: HttpClient, private cookie: CookieService) { }

  getStores(postalCode: number, range: number): Observable<any> {
    let body = {
      postal_code: postalCode,
      mile_range: range
    };
    return this.http.post(
      `/api/walmart/stores`,
      body
    );
  }

  getProducts(storeID: number, query: string): Observable<any> {
    return this.http.get<any>(
      `http://search.mobile.walmart.com/search?store=${storeID}&query=${query}`,
    );
  }
}