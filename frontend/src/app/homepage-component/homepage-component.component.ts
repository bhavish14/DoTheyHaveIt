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
  test = 'double';
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private targetService: TargetService,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchQuery: null,
      postalCode: [null, Validators.maxLength(5)],
      mileRange: [null],
    });

    this.targetService.getAPIKey();

    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
    };

    navigator.geolocation.getCurrentPosition(
      pos => {
        console.log(pos);
        // this.http
        //   .get(
        //     'http://maps.googleapis.com/maps/api/geocode/json?latlng=' +
        //       pos.coords.latitude +
        //       ',' +
        //       pos.coords.longitude +
        //       '&sensor=true',
        //   )
        //   .subscribe(res => {
        //     console.log(res);
        //   });
      },
      err => {
        console.log(err);
      },
      options,
    );
  }

  submit(): void {
    const formValues = this.searchForm.value;
    let { searchQuery, postalCode, mileRange } = formValues;
    mileRange = mileRange || 50;

    if (searchQuery && postalCode) {
      let recentIdx = Number(localStorage.getItem('search_idx')) || 0;

      localStorage.setItem(
        `recent_search_${recentIdx}`,
        `${searchQuery};${Date.now()}`,
      );

      localStorage.setItem('search_idx', String(recentIdx + 1));

      this.router.navigate(['/search'], {
        queryParams: {
          query: searchQuery,
          postal_code: postalCode,
          mile_range: mileRange,
        },
      });
    }
  }
}
