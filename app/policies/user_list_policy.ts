import User from '#models/user'

export default class UserListPolicy {
  /**
   * Only admins can create users
   */
  create(authUser: User) {
    return authUser.role === 'admin'
  }

  /**
   * Only admins can update users
   */
  update(authUser: User) {
    return authUser.role === 'admin'
  }

  /**
   * Only admins can delete users
   */
  delete(authUser: User) {
    return authUser.role === 'admin'
  }

  /**
   * Anyone logged in can view the user list
   */
  view(authUser: User) {
    return true
  }
}