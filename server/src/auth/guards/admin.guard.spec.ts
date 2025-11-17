import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../auth.service';

// bcrypt 모킹 (AuthService에서 사용)
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: AuthService;

  const mockAuthService = {
    validateCredentials: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn(),
    }),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminGuard,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('올바른 Basic Auth 헤더이면 true를 반환해야 함', async () => {
      const base64Credentials = Buffer.from('admin:password123').toString('base64');
      const request = {
        headers: {
          authorization: `Basic ${base64Credentials}`,
        },
      };

      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(request);
      mockAuthService.validateCredentials.mockResolvedValue(true);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(authService.validateCredentials).toHaveBeenCalledWith('admin', 'password123');
    });

    it('Authorization 헤더가 없으면 UnauthorizedException을 throw해야 함', async () => {
      const request = {
        headers: {},
      };

      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(request);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        'Missing or invalid authorization header',
      );
    });

    it('Basic Auth 형식이 아니면 UnauthorizedException을 throw해야 함', async () => {
      const request = {
        headers: {
          authorization: 'Bearer token123',
        },
      };

      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(request);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
    });

    it('잘못된 자격증명이면 UnauthorizedException을 throw해야 함', async () => {
      const base64Credentials = Buffer.from('admin:wrongpassword').toString('base64');
      const request = {
        headers: {
          authorization: `Basic ${base64Credentials}`,
        },
      };

      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(request);
      mockAuthService.validateCredentials.mockResolvedValue(false);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow('Invalid credentials');
    });

    it('Base64 디코딩 실패 시 UnauthorizedException을 throw해야 함', async () => {
      const request = {
        headers: {
          authorization: 'Basic invalid-base64',
        },
      };

      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(request);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
    });
  });
});
