import { TestBed } from '@angular/core/testing';

import { ServerLinkService } from './server-link.service';

describe('ServerLinkService', () => {
  let service: ServerLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
