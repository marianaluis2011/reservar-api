import Hospedaje from '../models/accommodation.js';

const hospedajeService = {
  registrar: async (datos) => {
    // ID de prueba hasta tener el sistema de usuarios real
    const administradorId = datos.administrador || "64f1a2b3c4d5e6f7a8b9c0d1";
    
    const nuevoHospedaje = new Hospedaje({
      ...datos,
      administrador: administradorId
    });
    return await nuevoHospedaje.save();
  },

  listarPublico: async () => {
    return await Hospedaje.find({ estado: 'aprobado' });
  },

  obtenerDetalle: async (id) => {
    return await Hospedaje.findById(id);
  },

  actualizar: async (id, datos) => {
    return await Hospedaje.findOneAndUpdate({ _id: id }, datos, { returnDocument: 'after' });
  }
};

export default hospedajeService;