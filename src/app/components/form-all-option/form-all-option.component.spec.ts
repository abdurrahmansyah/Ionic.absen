import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAllOptionComponent } from './form-all-option.component';

describe('FormAllOptionComponent', () => {
  let component: FormAllOptionComponent;
  let fixture: ComponentFixture<FormAllOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAllOptionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAllOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
