import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTerlambatComponent } from './form-terlambat.component';

describe('FormTerlambatComponent', () => {
  let component: FormTerlambatComponent;
  let fixture: ComponentFixture<FormTerlambatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTerlambatComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTerlambatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
