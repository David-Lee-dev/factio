import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  /**
   * 환경 변수에서 관리자 자격증명 검증
   * @param username 관리자 사용자명
   * @param password 관리자 비밀번호 (평문)
   * @returns 검증 성공 여부
   */
  async validateCredentials(username: string, password: string): Promise<boolean> {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    const adminPasswordHash = this.configService.get<string>('ADMIN_PASSWORD_HASH');

    if (!adminUsername || !adminPasswordHash) {
      throw new Error('Admin credentials not configured');
    }

    // 사용자명 검증
    if (username !== adminUsername) {
      return false;
    }

    // 비밀번호 해시 비교
    const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);
    return isPasswordValid;
  }

  /**
   * 로그인 처리 (검증만 수행, 토큰 발급 없음)
   * @param username 관리자 사용자명
   * @param password 관리자 비밀번호
   * @throws UnauthorizedException 인증 실패 시
   */
  async login(
    username: string,
    password: string,
  ): Promise<{ message: string; authenticated: boolean }> {
    const isValid = await this.validateCredentials(username, password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      authenticated: true,
    };
  }
}
