const express = require('express');
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router();

router.post("/", auth, multer, saucesCtrl.createSauce);
router.post("/:id/like", auth, multer, saucesCtrl.giveLikes);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, multer, saucesCtrl.deleteSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.get("/", auth, saucesCtrl.getAllSauce);

module.exports = router;