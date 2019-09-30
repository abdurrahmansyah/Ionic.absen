import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDaily2Component } from './report-daily2.component';

describe('ReportDaily2Component', () => {
  let component: ReportDaily2Component;
  let fixture: ComponentFixture<ReportDaily2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDaily2Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDaily2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
