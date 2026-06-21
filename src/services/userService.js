import User from '../models/user.js';

const userService = {
  createUser: async (userData) => {
    const user = new User(userData);
    return user.save();
  },

  findUserByEmail: async (email) => {
    return User.findOne({ email });
  },

  obtenerTodos: async () => {
    return User.find().select('fullName email role isActive createdAt');
  },

  cambiarEstado: async (id, isActive) => {
    return User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('fullName email role isActive');
  },
};

export default userService;