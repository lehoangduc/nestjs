import { User } from '../entities'

export class UserUpdatedEvent {
  public static readonly code = 'user.updated'

  public prevUser: User
  public user: User

  constructor(prevUser: User, user: User) {
    this.prevUser = prevUser
    this.user = user
  }
}
