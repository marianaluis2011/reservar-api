import mongoose from "mongoose";
import dotenv from "dotenv";
import Province from "../models/province.js";

dotenv.config();

// Las 23 provincias de Argentina.
const provincias = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

const seedProvinces = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    let nuevas = 0;
    for (const name of provincias) {
      // Inserta solo si no existe (no duplica las que ya estaban).
      const res = await Province.updateOne(
        { name },
        { $setOnInsert: { name } },
        { upsert: true }
      );
      if (res.upsertedCount > 0) nuevas++;
    }

    console.log(`✅ Seeder de provincias completo. Nuevas insertadas: ${nuevas} / ${provincias.length} definidas.`);
  } catch (error) {
    console.error("❌ Error en el seeder de provincias:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedProvinces();
