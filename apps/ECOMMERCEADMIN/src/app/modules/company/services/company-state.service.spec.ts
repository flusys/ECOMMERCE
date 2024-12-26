import { TestBed } from '@angular/core/testing';

import { CompanyStateService } from './company-state.service';

describe('CompanyStateService', () => {
  let service: CompanyStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
