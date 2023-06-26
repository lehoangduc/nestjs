import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseInterceptors,
} from '@nestjs/common'
import { getClientIp } from '@supercharge/request-ip'

import { ParsedQuery } from '@core/common'
import { CaslAbilityFactory } from '@core/casl'
import { Public } from '@core/auth/decorators'
import { SettingsService } from '@core/settings/services'

@Controller('settings')
@UseInterceptors(ClassSerializerInterceptor)
export default class SettingsController {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly settingsService: SettingsService
  ) {}

  @Public()
  @Get('info')
  info(@Req() req) {
    return {
      version: '1',
      env: process.env.NODE_ENV,
      ip: getClientIp(req),
      url: req.url,
    }
  }

  @Get()
  async findAll(@Req() req, @ParsedQuery() query) {
    const ability = this.caslAbilityFactory.createForUser(req.user)

    return this.settingsService.findAll(query, ability)
  }

  @Get(':code')
  async find(@Req() req, @Param('code') code: string) {
    const ability = this.caslAbilityFactory.createForUser(req.user)

    return this.settingsService.findByCode(code, ability)
  }

  @Patch()
  async update(@Req() req, @Body() body: object) {
    const ability = this.caslAbilityFactory.createForUser(req.user)

    return this.settingsService.update(body, ability)
  }
}
