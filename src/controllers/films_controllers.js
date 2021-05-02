const express = require("express");
const { Sequelize } = require("sequelize");
const { Film } = require("../dbconnect");
const { Film_character } = require("../dbconnect");

const getFilms = async (req, res) => {
  // query functions
  const findCharactersOfFilm = async found_film => {
    let error = null;
    const { id, title, genre, creationdate, calification, imageurl } = found_film;

    // find characters of the film in relations table
    const foundCharacters = await Film_character.findAll({
      where: { filmtitle: title },
    }).catch(err => (error = err));
    if (error) {
      res.status(500).json({ message: "Connection to database failed", error });
      console.log(error);
      return;
    } else {
      //create an object and add characters list(from relations table) to send client
      const film = {
        id,
        title,
        genre,
        creationdate,
        calification,
        imageurl,
        characters: foundCharacters.map(char => char.charactername),
      };
      return film;
    }
  };

  const getFilmByTitle = async title => {
    let error = null;

    // find film by title
    const found_film = await Film.findOne({ where: { title: title } }).catch(err => (error = err));
    if (error) res.status(500).json({ message: "Connection to database failed", error });
    else {
      if (found_film) {
        // found characters of the founded film
        const film = await findCharactersOfFilm(found_film);
        res.json({ film });
      } else if (!found_film) {
        res.status(404).json({ message: "Film doesn't exists in database" });
      }
      return;
    }
  };

  const getFilmsByGenre = async genre => {
    let error = null;

    // found films by genre
    found_films = await Film.findAll({ where: { genre: genre } }).catch(err => {
      error = err;
    });
    if (error) {
      res.status(500).json({ message: "Connection to database failed", error });
      console.log(error);
    } else {
      if (found_films.length > 0) {
        // find characters of every film and create an json to send
        let films = {};
        for (film of found_films) {
          films[film.title] = await findCharactersOfFilm(film);
        }
        res.json({ films });
      } else if (found_films.length == 0) {
        res.status(404).json({ message: "Film doesn't exists in database" });
      }
    }
    return;
  };

  const getFilmsByDate = async date => {
    let error = null;

    // check orderby and find
    if (date == "asc") {
      found_films = await Film.sequelize
        .query(`SELECT * FROM films ORDER BY creationdate ASC`, {
          type: Sequelize.QueryTypes.SELECT,
        })
        .catch(err => {
          error = err;
        });
    } else if (date == "desc") {
      found_films = await Film.sequelize
        .query(`SELECT * FROM films ORDER BY creationdate DESC`, {
          type: Sequelize.QueryTypes.SELECT,
        })
        .catch(err => {
          error = err;
        });
    }
    if (error) {
      res.status(500).json({ message: "Connection to database failed" });
      console.log(error);
    } else {
      if (found_films) {
        //find characters of every founded film and create an json to send
        let films = {};
        for (film of found_films) {
          films[film.title] = await findCharactersOfFilm(film);
        }
        res.json({ films });
      } else if (!found_films) {
        res.status(404).json({ message: "Films doesn't exists in database" });
      }
    }
    return;
  };

  //check querys in request
  if (req.query.title) {
    getFilmByTitle(req.query.title);
    return;
  }

  if (req.query.genre) {
    getFilmsByGenre(req.query.genre);
    return;
  }

  if (req.query.date) {
    getFilmsByDate(req.query.date);
    return;
  }

  // no querys (details request)
  let error = null;

  const films = await Film.findAll({
    attributes: ["title", "creationdate", "imageurl"],
  }).catch(err => (error = err));
  error ? res.status(500).json({ message: "Connection to database failed", error }) : res.json({ films });
};

const newFilm = async (req, res) => {
  error = null;
  // add new row to films table
  const film = await Film.create(req.body).catch(err => (error = err));
  if (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
    return;
  } else {
    //add rows to relations table
    const characters_array = req.body.characters;
    for (let char of characters_array) {
      error = null;
      await Film_character.create({
        filmtitle: film.title,
        charactername: char,
      }).catch(err => (error = err));
      if (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
        return;
      }
    }
    res.json({ message: "New film added!" });
  }

  return;
};

const updateFilm = async (req, res) => {
  const { filmId: id } = req.params;

  let error = null;

  // find by primary key (id)
  const founded_film = await Film.findByPk(id).catch(err => (error = err));
  if (error) {
    res.status(500).json({ message: "Server: Connection to database failed" });
    console.log(error);
    return;
  }
  if (!founded_film) {
    res.status(404).json({ message: `Film with id '${id}' does not exist in database` });
    return;
  }

  error = null;

  // update row in films table
  await Film.update(req.body, { where: { id: req.params.filmId } }).catch(err => (error = err));
  if (error) res.status(400).json({ error: error.message });
  else {
    error = null;

    //delete old relations in relations table
    try {
      const founded_relations = await Film_character.findAll({ where: { filmtitle: founded_film.title } });
      for (let relation of founded_relations) {
        await Film_character.destroy({ where: { filmtitle: relation.filmtitle } });
      }
    } catch (error) {
      res.status(500).json({ message: "Operation in server or database failed!" });
      console.log(error);
      return;
    }

    //create new relations

    // title to push in relation table(is modified by put operation?)
    let film_title;
    if (req.body.title) {
      film_title = req.body.title;
    } else {
      film_title = founded_film.title;
    }
    const characters_array = req.body.characters;
    // add film and every character
    for (let char of characters_array) {
      error = null;

      await Film_character.create({
        filmtitle: film_title,
        charactername: char,
      }).catch(err => (error = err));
      if (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
        return;
      }
    }

    res.json({ message: `Film with id ${id} updated!` });
  }
  return;
};

const deleteFilm = async (req, res) => {
  const { filmId: id } = req.params;

  try {
    // find by primary key (id)
    const foundedFilm = await Film.findByPk(id);

    if (foundedFilm) {
      // delete if found id
      await foundedFilm.destroy();
      res.json({
        message: `Film with id ${id} and title ${foundedFilm.title} was deleted!`,
      });
    } else {
      res.status(404).json({ message: `Film with id = ${id} does not exist in database` });
    }
  } catch (error) {
    res.status(500).json({ message: "Operation in server or database failed!" });
    console.log(error);
  }
};

module.exports = { getFilms, newFilm, updateFilm, deleteFilm };
