import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkPermitPage } from './work-permit.page';

describe('WorkPermitPage', () => {
  let component: WorkPermitPage;
  let fixture: ComponentFixture<WorkPermitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkPermitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkPermitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
