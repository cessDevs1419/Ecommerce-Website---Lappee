import { TestBed } from '@angular/core/testing';

import { SizeChartService } from './size-chart.service';

describe('SizeChartService', () => {
  let service: SizeChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SizeChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
