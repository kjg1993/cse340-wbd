import express from 'express';
const router = express.Router();
import utilities from "../utilities/index.js";
import baseController from "../controllers/baseController.js";

// Static Routes
router.use(express.static("public"));
router.use("/css", express.static("public/css"));
router.use("/js", express.static("public/js"));
router.use("/images", express.static("public/images"));

router.get("/", utilities.handleErrors(baseController.buildHome));

export default router; 