import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamActivityPage } from './team-activity.page';

describe('TeamActivityPage', () => {
  let component: TeamActivityPage;
  let fixture: ComponentFixture<TeamActivityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamActivityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
