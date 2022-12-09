import { TestBed, async, inject } from '@angular/core/testing';

import { AutoLoginGuard } from './auto-login.guard';

describe('AutoLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutoLoginGuard]
    });
  });

  it('should ...', inject([AutoLoginGuard], (guard: AutoLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
