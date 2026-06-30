import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";
import Accommodation from "../models/accommodation.js";
import Room from "../models/room.js";
import Province from "../models/province.js";

dotenv.config();

const PASSWORD = "Hospedar123";
const PLACEHOLDER = "https://placehold.co/1200x800?text=Hospedar";

const owners = [
  { fullName: "Lucía Fernández",  province: "Río Negro",   hospedaje: "Cabañas del Sur",     room: "Cabaña Doble",        price: 45000, capacity: 2 },
  { fullName: "Martín Gómez",     province: "Buenos Aires", hospedaje: "Hotel Costa Azul",    room: "Suite Vista al Mar",  price: 60000, capacity: 3 },
  { fullName: "Sofía Ramírez",    province: "Córdoba",      hospedaje: "Posada del Cerro",    room: "Habitación Serrana",  price: 38000, capacity: 2 },
  { fullName: "Diego Torres",     province: "Mendoza",      hospedaje: "Hostería La Montaña", room: "Suite Andina",        price: 52000, capacity: 4 },
  { fullName: "Valentina Ruiz",   province: "Salta",        hospedaje: "Complejo Las Termas", room: "Habitación Termal",   price: 41000, capacity: 2 },
  { fullName: "Joaquín Méndez",   province: "Neuquén",      hospedaje: "Refugio del Lago",    room: "Cabaña Familiar",     price: 58000, capacity: 5 },
  { fullName: "Camila Sosa",      province: "Tucumán",      hospedaje: "Hotel Plaza Norte",   room: "Habitación Standard", price: 33000, capacity: 2 },
  { fullName: "Tomás Herrera",    province: "Misiones",     hospedaje: "Cabañas El Bosque",   room: "Cabaña Selva",        price: 47000, capacity: 4 },
  { fullName: "Agustina Díaz",    province: "Jujuy",        hospedaje: "Posada del Valle",    room: "Habitación Quebrada", price: 36000, capacity: 2 },
  { fullName: "Nicolás Castro",   province: "Chubut",       hospedaje: "Hotel Vista Mar",     room: "Suite Patagónica",    price: 64000, capacity: 3 },
];

const slugEmail = (hospedaje) =>
  hospedaje.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "") + "@hospedar.com";

const seedOwners = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    let creados = 0;
    let saltados = 0;
    const credenciales = [];

    for (const o of owners) {
      const email = slugEmail(o.hospedaje);

      const existente = await User.findOne({ email });
      if (existente) {
        console.log(`- Ya existe: ${email} (lo salto)`);
        saltados++;
        continue;
      }

      const provinceDoc = await Province.findOne({ name: o.province });
      if (!provinceDoc) {
        console.log(`! Provincia no encontrada: ${o.province} (salto ${o.hospedaje})`);
        saltados++;
        continue;
      }

      const user = await new User({
        fullName: o.fullName,
        email,
        password: PASSWORD,
        role: "host",
      }).save();

      const accommodation = await new Accommodation({
        name: o.hospedaje,
        description: `${o.hospedaje}: un alojamiento ideal para tu estadía en ${o.province}. Comodidad, atención personalizada y una excelente ubicación.`,
        province: provinceDoc._id,
        mainImage: PLACEHOLDER,
        gallery: [],
        services: ["Wi-Fi", "Estacionamiento", "Desayuno"],
        contactEmail: email,
        whatsapp: "5491100000000",
        depositPercentage: 20,
        status: "aprobado",
        admin: user._id,
      }).save();

      await new Room({
        name: o.room,
        description: `${o.room} en ${o.hospedaje}. Espacio cómodo y equipado para una estadía agradable.`,
        maxCapacity: o.capacity,
        pricePerNight: o.price,
        services: ["Wi-Fi", "TV", "Aire acondicionado"],
        images: [],
        status: "activa",
        accommodation: accommodation._id,
      }).save();

      creados++;
      credenciales.push({ hospedaje: o.hospedaje, email, password: PASSWORD });
      console.log(`+ Creado: ${o.hospedaje} (${email})`);
    }

    console.log("\n==================== RESUMEN ====================");
    console.log(`Owners creados: ${creados} | Saltados: ${saltados}`);
    console.log("\nCREDENCIALES (todas con password: " + PASSWORD + ")");
    credenciales.forEach((c) => console.log(`  ${c.hospedaje.padEnd(22)} -> ${c.email}`));
    console.log("================================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error en el seeder:", error.message);
    process.exit(1);
  }
};

seedOwners();
