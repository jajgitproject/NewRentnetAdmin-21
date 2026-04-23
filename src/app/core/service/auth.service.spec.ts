import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { RuntimeConfigService } from './runtime-config.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: RuntimeConfigService,
          useValue: {
            getBaseUrl: (): string => 'https://test.example/',
            getImageUrl: (): string => 'https://test.example/',
            getFormUrl: (): string => 'http://localhost:4200/#',
            getUnlockEmployeeUrl: (): string => 'https://connect.example/',
            load: (): Promise<void> => Promise.resolve(),
          },
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
