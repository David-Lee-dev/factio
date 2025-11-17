import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

// bcrypt 모킹
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // 기본 설정값
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'ADMIN_USERNAME') {
        return 'admin';
      }
      if (key === 'ADMIN_PASSWORD_HASH') {
        return '$2b$10$hashedpassword';
      }
      return undefined;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateCredentials', () => {
    it('올바른 자격증명이면 true를 반환해야 함', async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const bcrypt = require('bcrypt');
      bcrypt.compare.mockResolvedValue(true);

      const result = await service.validateCredentials('admin', 'password123');

      expect(result).toBe(true);
      expect(mockConfigService.get).toHaveBeenCalledWith('ADMIN_USERNAME');
      expect(mockConfigService.get).toHaveBeenCalledWith('ADMIN_PASSWORD_HASH');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', '$2b$10$hashedpassword');
    });

    it('잘못된 사용자명이면 false를 반환해야 함', async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const bcrypt = require('bcrypt');
      bcrypt.compare.mockClear();

      const result = await service.validateCredentials('wronguser', 'password123');

      expect(result).toBe(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('잘못된 비밀번호이면 false를 반환해야 함', async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const bcrypt = require('bcrypt');
      bcrypt.compare.mockResolvedValue(false);

      const result = await service.validateCredentials('admin', 'wrongpassword');

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalled();
    });

    it('환경 변수가 설정되지 않으면 에러를 throw해야 함', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      await expect(service.validateCredentials('admin', 'password123')).rejects.toThrow(
        'Admin credentials not configured',
      );
    });
  });

  describe('login', () => {
    it('올바른 자격증명이면 성공 메시지를 반환해야 함', async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const bcrypt = require('bcrypt');
      bcrypt.compare.mockResolvedValue(true);

      const result = await service.login('admin', 'password123');

      expect(result).toEqual({
        message: 'Login successful',
        authenticated: true,
      });
    });

    it('잘못된 자격증명이면 UnauthorizedException을 throw해야 함', async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const bcrypt = require('bcrypt');
      bcrypt.compare.mockResolvedValue(false);

      await expect(service.login('admin', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
      await expect(service.login('admin', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });
});
