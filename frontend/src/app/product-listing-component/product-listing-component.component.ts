import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// services
import { TargetService } from 'src/app/_services/target.service';

@Component({
  selector: 'app-product-listing-component',
  templateUrl: './product-listing-component.component.html',
  styleUrls: ['./product-listing-component.component.css'],
})
export class ProductListingComponentComponent implements OnInit {

  @ViewChild('target', { read: ElementRef }) targetDiv: ElementRef;
  @ViewChild('walmart', { read: ElementRef }) walmartDiv: ElementRef;

  mileRange: number = 50;
  postalCode: number = null;
  searchQuery: string = null;
  allProducts: Object[] = [];

  constructor(
    private router: Router,
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

  ngOnInit(): void { }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  scrollTo(store): void {
    if (store == 'target') {
      this.targetDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    } else if (store == 'walmart') {
      this.walmartDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }
}
