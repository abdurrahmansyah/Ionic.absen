import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardsPage } from './leaderboards.page';

describe('LeaderboardsPage', () => {
  let component: LeaderboardsPage;
  let fixture: ComponentFixture<LeaderboardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderboardsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
