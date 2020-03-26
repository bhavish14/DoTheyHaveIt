import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-component',
  templateUrl: './sidebar-component.component.html',
  styleUrls: ['./sidebar-component.component.css'],
})
export class SidebarComponentComponent implements OnInit {
  allSearchItems: Object[] = [];

  constructor() {}

  getSearchHistory(): void {
    this.allSearchItems = [];
    for (var i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).startsWith('recent')) {
        let searchRecord = localStorage.getItem(localStorage.key(i));
        let record = searchRecord.split(';');
        let date = new Date(Number(record[1]));
        this.allSearchItems.push([
          record[0],
          `${date.getMonth() +
            1}/${date.getDate()} at ${date.getHours()}:${date.getMinutes()}`,
        ]);

        this.allSearchItems = this.allSearchItems.slice(0, 7);

        this.allSearchItems = this.allSearchItems.sort((a, b) => {
          if (a[1] > b[1]) {
            return -1;
          } else {
            return 1;
          }
        });
      }
    }
  }

  ngOnInit(): void {
    let allSearchItems = [];
    this.getSearchHistory();
    setInterval(() => {
      this.getSearchHistory();
    }, 10000);
  }
}
