import { TestBed } from '@angular/core/testing';

import { GetInfosService } from './get-infos.service';

describe('GetInfosService', () => {
  let service: GetInfosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetInfosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
