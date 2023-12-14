import { TestBed } from '@angular/core/testing';

import { RestocksService } from './restocks.service';

describe('RestocksService', () => {
  let service: RestocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
