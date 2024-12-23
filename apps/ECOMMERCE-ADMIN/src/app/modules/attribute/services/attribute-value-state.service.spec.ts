import { TestBed } from '@angular/core/testing';

import { AttributeValueStateService } from './attribute-value-state.service';

describe('AttributeValueStateService', () => {
  let service: AttributeValueStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeValueStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
