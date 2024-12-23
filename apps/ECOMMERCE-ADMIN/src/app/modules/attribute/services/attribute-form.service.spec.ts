import { TestBed } from '@angular/core/testing';

import { AttributeFormService } from './attribute-form.service';

describe('AttributeFormService', () => {
  let service: AttributeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
