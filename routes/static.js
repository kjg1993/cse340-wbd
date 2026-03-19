import express from 'express';
const router = express.Router();

// Static Routes
router.use(express.static("public"));
// Nota: En ES Modules, __dirname no existe por defecto. 
// Para rutas estáticas simples, con la línea de arriba suele bastar.
router.use("/css", express.static("public/css"));
router.use("/js", express.static("public/js"));
router.use("/images", express.static("public/images"));

export default router; // <--- Cambia esto