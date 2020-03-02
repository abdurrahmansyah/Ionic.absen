import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningLocationsPage } from './warning-locations.page';

describe('WarningLocationsPage', () => {
  let component: WarningLocationsPage;
  let fixture: ComponentFixture<WarningLocationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningLocationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningLocationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
