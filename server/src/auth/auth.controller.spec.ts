import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

// bcrypt 모킹 (AuthService에서 사용)
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('올바른 자격증명이면 성공 응답을 반환해야 함', async () => {
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'password123',
      };
      const expectedResult = {
        message: 'Login successful',
        authenticated: true,
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith('admin', 'password123');
    });

    it('잘못된 자격증명이면 UnauthorizedException을 throw해야 함', async () => {
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(authService.login).toHaveBeenCalledWith('admin', 'wrongpassword');
    });
  });
});
