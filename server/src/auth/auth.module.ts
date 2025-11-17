import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminGuard } from './guards/admin.guard';

@Module({
  providers: [AuthService, AdminGuard],
  controllers: [AuthController],
  exports: [AuthService, AdminGuard],
})
export class AuthModule {}
