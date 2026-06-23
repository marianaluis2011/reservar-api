import userService from '../services/userService.js';
import accommodationService from '../services/accommodationService.js';

const userController = {
 crearAdmin: async (req, res) => {
  try {
    const { fullName, email, password, accommodationName, province, whatsapp } = req.body;

    if (!fullName || !email || !password || !accommodationName || !province || !whatsapp) {
      return res.status(400).json({ message: 'Faltan datos para crear el administrador y su hospedaje' });
    }

    const existingUser = await userService.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const user = await userService.createUser({
      fullName,
      email,
      password,
      role: 'host'
    });

    const accommodation = await accommodationService.crear({
      name: accommodationName,
      description: `Hospedaje administrado por ${fullName}`,
      province,
      mainImage: 'https://placehold.co/800x500?text=Hospedaje',
      gallery: [],
      services: [],
      contactEmail: email,
      whatsapp,
      depositPercentage: 0,
      status: 'aprobado',
      admin: user._id
    });

    res.status(201).json({
      message: 'Administrador y hospedaje creados correctamente',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      },
      accommodation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear administrador y hospedaje',
      error: error.message
    });
  }
},

  obtenerTodos: async (req, res) => {
    try {
      const users = await userService.obtenerTodos();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  },

  cambiarEstado: async (req, res) => {
    try {
      const { isActive } = req.body;
      const user = await userService.cambiarEstado(req.params.id, isActive);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      const estado = isActive ? 'habilitado' : 'deshabilitado';
      res.status(200).json({ message: `Usuario ${estado} correctamente`, user });
    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar el estado del usuario' });
    }
  },
};

export default userController;