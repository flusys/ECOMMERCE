import { TestBed } from '@angular/core/testing';

import { AttributeValueFormService } from './attribute-value-form.service';

describe('AttributeValueFormService', () => {
  let service: AttributeValueFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeValueFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
