import { TestBed } from '@angular/core/testing';

import { AuthCodeService } from './auth-code.service';

describe('AuthCodeService', () => {
  let service: AuthCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
