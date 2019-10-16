import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAbsenDiluarComponent } from './form-absen-diluar.component';

describe('FormAbsenDiluarComponent', () => {
  let component: FormAbsenDiluarComponent;
  let fixture: ComponentFixture<FormAbsenDiluarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAbsenDiluarComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAbsenDiluarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
