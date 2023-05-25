import { TestBed } from '@angular/core/testing';

import { EntrepreneursService } from './entrepreneurs.service';

describe('EntrepreneursService', () => {
  let service: EntrepreneursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntrepreneursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
