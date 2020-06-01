import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWfoNewNormalComponent } from './form-wfo-new-normal.component';

describe('FormWfoNewNormalComponent', () => {
  let component: FormWfoNewNormalComponent;
  let fixture: ComponentFixture<FormWfoNewNormalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormWfoNewNormalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormWfoNewNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
