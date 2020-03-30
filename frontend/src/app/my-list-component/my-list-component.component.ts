import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// services
import { ListsService } from 'src/app/_services/lists.service';

@Component({
  selector: 'app-my-list-component',
  templateUrl: './my-list-component.component.html',
  styleUrls: ['./my-list-component.component.css']
})
export class MyListComponentComponent implements OnInit {

  @Input() redirectTo: string = '';
  myList = {};
  length: number = 0;

  constructor(
    private router: Router,
    private listService: ListsService,
  ) { }

  ngOnInit(): void {
    this.myList = this.listService.getList();
    this.length = Object.keys(this.myList).length;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  emptyList(): void {
    this.myList = {};
    this.listService.emptyList();
  }
}
