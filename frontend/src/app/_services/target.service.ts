import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class TargetService {
  constructor(private http: HttpClient, private cookie: CookieService) {}

  getAPIKey(): void {
    this.http
      .get('/api/key/target')
      .pipe()
      .subscribe((res: any) => {
        this.cookie.set('tgt_key', res.data.redsky_key);
        this.cookie.set('tgt_api_key', res.data.api_key);
      });
  }

  getStores(postalCode: number, range: number): Observable<any> {
    if (!this.cookie.check('tgt_key')) {
      this.getAPIKey();
    }

    const key = this.cookie.get('tgt_key');

    return this.http.get(
      `https://redsky.target.com/v3/stores/nearby/${postalCode}?key=${key}&limit=25&within=${range}&unit=mile`,
    );
  }

  getProducts(storeID: number, query: string): Observable<any> {
    const key = this.cookie.get('tgt_key');
    const count = 24;
    return this.http.get<any>(
      `https://redsky.target.com/v2/plp/search/?channel=web&count=${count}&keyword=${query}&pricing_store_id=${storeID}&key=${key}`,
    );
  }

  getProductStocks(
    tcin: number,
    range: number,
    postalCode: number,
  ): Observable<any> {
    let body = {
      tcin: tcin,
      mile_range: range,
      postal_code: postalCode,
    };
    return this.http.post<any>(`/api/target`, body);
  }
}
