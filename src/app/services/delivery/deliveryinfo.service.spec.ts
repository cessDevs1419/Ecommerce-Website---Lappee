import { TestBed } from '@angular/core/testing';

import { DeliveryinfoService } from './deliveryinfo.service';

describe('DeliveryinfoService', () => {
  let service: DeliveryinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
