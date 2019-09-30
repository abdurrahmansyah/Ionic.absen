import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRequestPage } from './form-request.page';

describe('FormRequestPage', () => {
  let component: FormRequestPage;
  let fixture: ComponentFixture<FormRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRequestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
