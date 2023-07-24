import { TestBed } from '@angular/core/testing';

import { FormsDataService } from './forms-data.service';

describe('FormsDataService', () => {
  let service: FormsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
