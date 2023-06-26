import { User } from '../entities'

export class UserDeletedEvent {
  public static readonly code = 'user.deleted'
  
  public user: User

  constructor(user: User) {
    this.user = user
  }
}
