import { TestBed } from '@angular/core/testing';

import { AttributeValueApiService } from './attribute-value-api.service';

describe('AttributeValueApiService', () => {
  let service: AttributeValueApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeValueApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
