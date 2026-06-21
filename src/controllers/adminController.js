class AdminController {
  static async getStats(req, res) {
    try {
      // Ejemplo: datos ficticios, reemplazá con tu lógica real
      res.json({
        users: 120,
        accommodations: 45,
        bookings: 200,
      });
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo estadísticas", error: error.message });
    }
  }

  static async getAccommodations(req, res) {
    try {
      // Ejemplo: lista ficticia
      res.json([
        { id: 1, name: "Hotel Tucumán", city: "San Miguel de Tucumán" },
        { id: 2, name: "Hostel Norte", city: "Yerba Buena" },
      ]);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo hospedajes", error: error.message });
    }
  }

  static async getUsers(req, res) {
    try {
      const { role } = req.query;
      // Ejemplo: lista ficticia filtrada por rol
      const users = [
        { id: 1, name: "Sebas", role: "admin" },
        { id: 2, name: "Juan", role: "user" },
      ];
      const filtered = role ? users.filter(u => u.role === role) : users;
      res.json(filtered);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo usuarios", error: error.message });
    }
  }
}

export default AdminController;
