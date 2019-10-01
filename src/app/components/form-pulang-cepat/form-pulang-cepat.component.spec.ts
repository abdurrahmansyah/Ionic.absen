import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPulangCepatComponent } from './form-pulang-cepat.component';

describe('FormPulangCepatComponent', () => {
  let component: FormPulangCepatComponent;
  let fixture: ComponentFixture<FormPulangCepatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPulangCepatComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPulangCepatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
