import { TestBed } from '@angular/core/testing';

import { CollectionsServiceService } from './collections-service.service';

describe('CollectionsServiceService', () => {
  let service: CollectionsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
