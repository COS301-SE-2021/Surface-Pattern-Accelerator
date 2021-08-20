import { TestBed } from '@angular/core/testing';

import { CollectionsServiceService } from './collections-service.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('myService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [CollectionsServiceService]
  }));

  it('Collection service should be created', () => {
    const service: CollectionsServiceService = TestBed.inject(CollectionsServiceService);
    expect(service).toBeTruthy();
  });

  it('should have getCollections function', () => {
    const service: CollectionsServiceService = TestBed.inject(CollectionsServiceService);
    expect(service.getCollections).toBeTruthy();
  });

  it('should have createCollection function', () => {
    const service: CollectionsServiceService = TestBed.inject(CollectionsServiceService);
    expect(service.createNewCollection).toBeTruthy();
  });

});
