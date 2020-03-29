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
  funText: String[] = [
    'Hey you! Please don\'t be that guy we all read about in math textbooks. No! No one can possibly eat 50 dozens of bananas',
    'Don\'t buy all the soap; other people have to wash their hands to prevent spreading it too, ya know?',
  ];
  interval: any = null;
  selectedTextIdx: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.mileRange = Number(
      this.route.snapshot.queryParamMap.get('mile_range'),
    );

    this.postalCode = Number(
      this.route.snapshot.queryParamMap.get('postal_code'),
    );

    this.searchQuery = this.route.snapshot.queryParamMap.get('query');
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.selectedTextIdx = this.selectedTextIdx + 1;
      if (this.selectedTextIdx >= this.funText.length) {
        this.selectedTextIdx = 0;
      }
    }, 10000);
  }

  goBack(): void {
    this.router.navigate(['/home']);
    clearInterval(this.interval);
  }

  scrollTo(store): void {
    if (store == 'target') {
      this.targetDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    } else if (store == 'walmart') {
      this.walmartDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }
}
