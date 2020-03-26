import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// services
import { TargetService } from 'src/app/_services/target.service';

@Component({
  selector: 'app-product-listing-component',
  templateUrl: './product-listing-component.component.html',
  styleUrls: ['./product-listing-component.component.css'],
})
export class ProductListingComponentComponent implements OnInit {
  mileRange: number = 50;
  postalCode: number = null;
  searchQuery: string = null;
  allProducts: Object[] = [];

  constructor(
    private route: ActivatedRoute,
    private targetservice: TargetService,
  ) {
    this.mileRange = Number(
      this.route.snapshot.queryParamMap.get('mile_range'),
    );

    this.postalCode = Number(
      this.route.snapshot.queryParamMap.get('postal_code'),
    );

    this.searchQuery = this.route.snapshot.queryParamMap.get('query');
  }

  ngOnInit(): void {}
}
