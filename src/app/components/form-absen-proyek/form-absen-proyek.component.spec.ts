import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAbsenProyekComponent } from './form-absen-proyek.component';

describe('FormAbsenProyekComponent', () => {
  let component: FormAbsenProyekComponent;
  let fixture: ComponentFixture<FormAbsenProyekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAbsenProyekComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAbsenProyekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
