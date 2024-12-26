import { TestBed } from '@angular/core/testing';

import { BrandStateService } from './brand-state.service';

describe('BrandStateService', () => {
  let service: BrandStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
