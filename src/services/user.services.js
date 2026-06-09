import User from '../models/user.js';

class UserService {
  static async createUser(userData) {
    const user = new User(userData);
    return user.save();
  }

  static async findUserByEmail(email) {
    return User.findOne({ email });
  }
}

export default UserService;