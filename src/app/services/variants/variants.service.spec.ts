import { TestBed } from '@angular/core/testing';

import { VariantsService } from './variants.service';

describe('VariantsService', () => {
  let service: VariantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
