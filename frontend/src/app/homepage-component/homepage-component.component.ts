import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TargetService } from 'src/app/_services/target.service';

// services
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-homepage-component',
  templateUrl: './homepage-component.component.html',
  styleUrls: ['./homepage-component.component.css'],
})
export class HomepageComponentComponent implements OnInit {
  searchForm: FormGroup = null;
  postalCodeForm: FormGroup = null;
  test = 'double';
  postalCode: number = null;
  showPostalCode: boolean = false;
  disable: boolean = false;
  loadingGif: boolean = false;

  private gcsAPI: string = null;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private targetService: TargetService,
    private http: HttpClient,
    private utilService: UtilService,
  ) { }

  ngOnInit(): void {
    let allLocalStorageItems = { ...localStorage };

    for (let item in allLocalStorageItems) {
      if (item.startsWith('recent_search')) {
        let val = localStorage.getItem(item).split(';');
        let dayMinusOne = new Date();
        dayMinusOne = new Date(dayMinusOne.setHours(dayMinusOne.getHours() - 6));
        if (new Date(Number(val[1])) < dayMinusOne) {
          localStorage.removeItem(item);
        }
      }
    }

    this.searchForm = this.formBuilder.group({
      searchQuery: [null, Validators.required],
      postalCode: [null, [Validators.maxLength(5), Validators.required]],
      mileRange: 25,
    });

    this.targetService.getAPIKey();
  }

  submit(): void {
    const formValues = this.searchForm.value;
    let { searchQuery, postalCode, mileRange } = formValues;

    // setting local storage
    let recentIdx = Number(localStorage.getItem('search_idx')) || 0;
    localStorage.setItem(
      `recent_search_${recentIdx}`,
      `${searchQuery};${Date.now()}`,
    );

    localStorage.setItem('search_idx', String(recentIdx + 1));

    this.disable = true;

    this.router.navigate(['/search'], {
      queryParams: {
        query: searchQuery,
        postal_code: postalCode,
        mile_range: mileRange,
      },
    });
  }
}
