import { CustomRepository, TypeOrmMongoRepository } from '@core/database'
import { UserForgotPassword } from '../entities'

@CustomRepository(UserForgotPassword)
export class UsersForgotPasswordRepository extends TypeOrmMongoRepository<UserForgotPassword> {}
