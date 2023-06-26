import { User } from '../entities'

export class UserCreatedEvent {
  public static readonly code = 'user.created'

  public user: User

  constructor(user: User) {
    this.user = user
  }
}
