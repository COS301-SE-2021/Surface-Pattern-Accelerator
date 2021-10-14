import { TestBed } from '@angular/core/testing';

import { MotifServiceService } from './motif-service.service';

describe('MotifServiceService', () => {
  let service: MotifServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotifServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
