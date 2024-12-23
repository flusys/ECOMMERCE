import { TestBed } from '@angular/core/testing';

import { BrandApiService } from './brand-api.service';

describe('BrandApiService', () => {
  let service: BrandApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
