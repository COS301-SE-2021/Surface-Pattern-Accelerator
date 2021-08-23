import { TestBed } from '@angular/core/testing';

import { GLoginService } from './g-login.service';

describe('GLoginService', () => {
  let service: GLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
