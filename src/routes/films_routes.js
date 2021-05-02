const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/films_controllers"),
  { validateTitle } = require("../middlewares/films_validations"),
  { verifyToken } = require("../middlewares/verify_token");

router.get("/", verifyToken, controller.getFilms);

router.post("/", verifyToken, validateTitle, controller.newFilm);

router.put("/:filmId", verifyToken, validateTitle, controller.updateFilm);

router.delete("/:filmId", verifyToken, controller.deleteFilm);

module.exports = router;
