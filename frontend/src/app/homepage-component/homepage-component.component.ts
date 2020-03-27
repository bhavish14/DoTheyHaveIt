import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TargetService } from 'src/app/_services/target.service';

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private targetService: TargetService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchQuery: [null, Validators.required],
    });

    this.postalCodeForm = this.formBuilder.group({
      postalCode: [null, [Validators.maxLength(5), Validators.required]],
      mileRange: 25,
    });

    this.targetService.getAPIKey();
  }

  submit(): void {
    const formValues = this.searchForm.value;
    let { searchQuery } = formValues;

    // setting local storage
    let recentIdx = Number(localStorage.getItem('search_idx')) || 0;

    localStorage.setItem(
      `recent_search_${recentIdx}`,
      `${searchQuery};${Date.now()}`,
    );

    localStorage.setItem('search_idx', String(recentIdx + 1));

    this.disable = true;
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
    };

    let postalCodePromise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.http
            .get(
              'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC69VLLEsQMX4LEhmccHWVdqm68Ucl-bMk&latlng=' +
                pos.coords.latitude +
                ',' +
                pos.coords.longitude +
                '&sensor=true',
            )
            .subscribe((res: any) => {
              if (res.status === 'OK') {
                if (res.results[0]) {
                  let address = res.results[0].address_components;
                  address = address.filter(e => e.types[0] === 'postal_code');
                  resolve(Number(address[0].long_name));
                }
              }
            });
        },
        err => {
          this.showPostalCode = true;
          reject(0);
          console.log('failed to capture postal code');
        },
        options,
      );
    });

    postalCodePromise
      .then(res => {
        this.disable = false;
        console.log(res);
        this.router.navigate(['/search'], {
          queryParams: {
            query: searchQuery,
            postal_code: res,
            mile_range: 25,
          },
        });
      })
      .catch(err => {});
  }

  postalCodeSubmit(): void {
    let { searchQuery } = this.searchForm.value;
    let { postalCode, mileRange } = this.postalCodeForm.value;
    this.router.navigate(['/search'], {
      queryParams: {
        query: searchQuery,
        postal_code: postalCode,
        mile_range: mileRange,
      },
    });
  }
}
