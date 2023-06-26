import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'

import { AuthService, Public, LocalAuthGuard } from '@core/auth'
import { RegisterDto, ResetPasswordDto } from '@core/auth/dtos'

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  register(@Body() body: RegisterDto): Promise<object> {
    return this.authService.register(body)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): Promise<object> {
    return this.authService.login(req.user)
  }

  @Get('me')
  info(@Request() req): Promise<object> {
    return req.user
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() body: any): Promise<void> {
    return this.authService.sendEmailForgotPassword(body.email)
  }

  @Public()
  @Post('reset-password')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  public async resetPassord(@Body() body: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(body)
  }
}
