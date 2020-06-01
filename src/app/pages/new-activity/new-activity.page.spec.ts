import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActivityPage } from './new-activity.page';

describe('NewActivityPage', () => {
  let component: NewActivityPage;
  let fixture: ComponentFixture<NewActivityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewActivityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
