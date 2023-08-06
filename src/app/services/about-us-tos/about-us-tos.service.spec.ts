import { TestBed } from '@angular/core/testing';

import { AboutUsTosService } from './about-us-tos.service';

describe('AboutUsTosService', () => {
  let service: AboutUsTosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AboutUsTosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
