import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import * as _ from 'lodash'
import { subject } from '@casl/ability'

import { AppErrors, ParsedQuery, Pagination } from '@core/common'
import { CaslAbilityFactory, UserAction } from '@core/casl'
import { User, CreateUserDto, UpdateUserDto, UsersRole, UsersService } from '@core/users'

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export default class UsersController {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly usersService: UsersService
  ) {}

  @Get('roles')
  async findRoles(@Req() req) {
    const ability = this.caslAbilityFactory.createForUser(req.user)

    return Object.values(UsersRole).filter((role) =>
      ability.pure.can(UserAction.Manage, subject('Role', { role }))
    )
  }

  @Get('users')
  async findAll(@Req() req, @ParsedQuery() query) {
    const ability = this.caslAbilityFactory.createForUser(req.user)
    const result = await this.usersService.findAll(query, ability)

    return plainToInstance(Pagination, result)
  }

  @Get('users/:id')
  async find(@Req() req, @Param('id') id: string): Promise<User> {
    const ability = this.caslAbilityFactory.createForUser(req.user)
    const user = await this.usersService.findById(id, ability)
    if (!user) throw AppErrors.EntityNotFoundError.create('User')

    return user
  }

  @Post('users')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Req() req, @Body() body: CreateUserDto): Promise<User> {
    const ability = this.caslAbilityFactory.createForUser(req.user)

    return this.usersService.create(body, ability)
  }

  @Patch('users/:id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(@Req() req, @Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
    const ability = this.caslAbilityFactory.createForUser(req.user)

    return this.usersService.update(id, body, ability)
  }

  @Delete('users/:id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async delete(@Req() req, @Param('id') id: string): Promise<User> {
    const ability = this.caslAbilityFactory.createForUser(req.user)

    return this.usersService.delete(id, ability)
  }
}
