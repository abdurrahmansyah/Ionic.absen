import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfowfhPlanningPage } from './wfowfh-planning.page';

describe('WfowfhPlanningPage', () => {
  let component: WfowfhPlanningPage;
  let fixture: ComponentFixture<WfowfhPlanningPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfowfhPlanningPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfowfhPlanningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
