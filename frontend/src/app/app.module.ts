import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// components
import { AppComponent } from 'src/app/app.component';
import { HomepageComponentComponent } from 'src/app/homepage-component/homepage-component.component';
import { SidebarComponentComponent } from 'src/app/sidebar-component/sidebar-component.component';
import { ProductListingComponentComponent } from 'src/app/product-listing-component/product-listing-component.component';
import { TargetComponent } from 'src/app/stores/target/target.component';
import { NavbarComponentComponent } from './navbar-component/navbar-component.component';
import { WalmartComponent } from './stores/walmart/walmart.component';
import { MyListComponentComponent } from './my-list-component/my-list-component.component';

const appRoutes: Routes = [
  { path: 'home', component: HomepageComponentComponent },
  { path: 'search', component: ProductListingComponentComponent },
  { path: 'my-list', component: MyListComponentComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponentComponent,
    SidebarComponentComponent,
    ProductListingComponentComponent,
    TargetComponent,
    NavbarComponentComponent,
    WalmartComponent,
    MyListComponentComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [MatIconModule, MatButtonModule],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule { }
