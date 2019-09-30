import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLemburComponent } from './form-lembur.component';

describe('FormLemburComponent', () => {
  let component: FormLemburComponent;
  let fixture: ComponentFixture<FormLemburComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLemburComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLemburComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
