import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningUpdatesPage } from './warning-updates.page';

describe('WarningUpdatesPage', () => {
  let component: WarningUpdatesPage;
  let fixture: ComponentFixture<WarningUpdatesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningUpdatesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningUpdatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
