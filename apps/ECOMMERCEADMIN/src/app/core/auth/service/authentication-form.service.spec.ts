import { TestBed } from '@angular/core/testing';

import { AuthenticationFormService } from './authentication-form.service';

describe('AuthenticationFormService', () => {
  let service: AuthenticationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
