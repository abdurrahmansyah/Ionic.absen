import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyActivityPage } from './my-activity.page';

describe('MyActivityPage', () => {
  let component: MyActivityPage;
  let fixture: ComponentFixture<MyActivityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyActivityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
