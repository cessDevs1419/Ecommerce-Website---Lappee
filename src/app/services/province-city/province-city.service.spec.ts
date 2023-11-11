import { TestBed } from '@angular/core/testing';

import { ProvinceCityService } from './province-city.service';

describe('ProvinceCityService', () => {
  let service: ProvinceCityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvinceCityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
