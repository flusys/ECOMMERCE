import { TestBed } from '@angular/core/testing';

import { AttributeApiService } from './attribute-api.service';

describe('AttributeApiService', () => {
  let service: AttributeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
