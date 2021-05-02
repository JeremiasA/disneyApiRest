const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/characters_controllers"),
  { validateName } = require("../middlewares/characters_validations"),
  { verifyToken } = require("../middlewares/verify_token");

router.get("/", verifyToken, controller.getCharacters);

router.post("/", verifyToken, validateName, controller.newCharacter);

router.put("/:characterId", verifyToken, validateName, controller.updateCharacter);

router.delete("/:characterId", verifyToken, controller.deleteCharacter);

module.exports = router;
