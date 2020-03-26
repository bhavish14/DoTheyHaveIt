import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListingComponentComponent } from './product-listing-component.component';

describe('ProductListingComponentComponent', () => {
  let component: ProductListingComponentComponent;
  let fixture: ComponentFixture<ProductListingComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListingComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
