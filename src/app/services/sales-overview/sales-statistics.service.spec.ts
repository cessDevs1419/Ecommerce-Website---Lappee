import { TestBed } from '@angular/core/testing';

import { SalesStatisticsService } from './sales-statistics.service';

describe('SalesStatisticsService', () => {
  let service: SalesStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
