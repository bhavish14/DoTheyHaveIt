import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyListComponentComponent } from './my-list-component.component';

describe('MyListComponentComponent', () => {
  let component: MyListComponentComponent;
  let fixture: ComponentFixture<MyListComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyListComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
