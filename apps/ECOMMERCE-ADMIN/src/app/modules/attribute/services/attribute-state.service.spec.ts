import { TestBed } from '@angular/core/testing';

import { AttributeStateService } from './attribute-state.service';

describe('AttributeStateService', () => {
  let service: AttributeStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
