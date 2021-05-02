const express = require("express");
const { Character, Film_character, Film } = require("../dbconnect");
const { Sequelize } = require("sequelize");

const getCharacters = async (req, res) => {
  // query functions
  const findFilmsOfCharacter = async found_character => {
    let error = null;
    const { id, name, age, weigth, story, imageurl } = found_character;
    //find films of character
    const foundFilms = await Film_character.findAll({ where: { charactername: name } }).catch(
      err => (error = err)
    );
    if (error) {
      res.status(500).json({ message: "Connection to database failed", error });
      console.log(error);
      return;
    } else {
      // create json to send with arrays of films
      const character = {
        id,
        name,
        age,
        weigth,
        story,
        imageurl,
        films: foundFilms.map(film => film.filmtitle),
      };
      console.log(character);
      return character;
    }
  };
  const getCharacterByName = async name => {
    error = null;
    // find character by name
    const found_character = await Character.findOne({ where: { name: name } }).catch(err => (error = err));
    if (error) res.status(500).json({ message: "Connection to database failed", error });
    else {
      if (found_character) {
        const character = await findFilmsOfCharacter(found_character);
        res.json({ character });
      } else if (!found_character) {
        res.status(404).json({ message: "Character doesn't exists in database" });
      }
      return;
    }
  };
  const getCharactersByAge = async ages => {
    let error = null;
    const { minage, maxage } = ages;

    //check filter
    if (maxage && minage) {
      found_character = await Character.sequelize
        .query(`SELECT * FROM characters WHERE age >= ${minage} AND age <=${maxage}`, {
          type: Sequelize.QueryTypes.SELECT,
        })
        .catch(err => {
          error = err;
        });
    } else if (maxage) {
      found_character = await Character.sequelize
        .query(`SELECT * FROM characters WHERE age <= ${maxage}`, { type: Sequelize.QueryTypes.SELECT })
        .catch(err => {
          error = err;
        });
    } else if (minage) {
      found_character = await Character.sequelize
        .query(`SELECT * FROM characters WHERE age >= ${minage}`, { type: Sequelize.QueryTypes.SELECT })
        .catch(err => {
          error = err;
        });
    }

    if (error) {
      res.status(500).json({ message: "Connection to database failed" });
      console.log(error);
    } else {
      if (found_character) {
        let characters = {};
        for (char of found_character) {
          characters[char.name] = await findFilmsOfCharacter(char);
        }
        res.json({ characters });
      } else if (!found_character) {
        res.status(404).json({ message: "Character doesn't exists in database" });
      }
    }
    return;
  };
  const getCharactersByWeigth = async weigths => {
    let error = null;
    const { minweigth, maxweigth } = weigths;

    //check filter
    if (maxweigth && minweigth) {
      found_character = await Character.sequelize.query(
        `SELECT * FROM characters WHERE weigth >= ${minweigth} AND weigth <=${maxweigth}`,
        { type: Sequelize.QueryTypes.SELECT }
      );
    } else if (maxweigth) {
      found_character = await Character.sequelize.query(
        `SELECT * FROM characters WHERE weigth <= ${maxweigth}`,
        { type: Sequelize.QueryTypes.SELECT }
      );
    } else if (minweigth) {
      found_character = await Character.sequelize.query(
        `SELECT * FROM characters WHERE weigth >= ${minweigth}`,
        { type: Sequelize.QueryTypes.SELECT }
      );
    }

    if (error) {
      res.status(500).json({ message: "Connection to database failed", error });
    } else {
      if (found_character) {
        let characters = {};
        for (char of found_character) {
          characters[char.name] = await findFilmsOfCharacter(char);
        }
        res.json({ characters });
      } else if (!found_character) {
        res.status(404).json({ message: "Character doesn't exists in database" });
      }
    }
    return;
  };
  const getCharactersByFilm = async title => {
    let error = null;

    //find film by id
    const found_film = await Film.findOne({ where: { title: title } }).catch(err => (error = err));
    if (error) {
      res.status(500).json({ message: "Database error" });
      console.log(error);
      return;
    } else {
      if (!found_film) {
        res.status(404).json({ message: "Film not found" });
      }
    }

    //find characters
    const found_character = await Film_character.findAll({ where: { filmtitle: found_film.title } }).catch(
      err => {
        error = err;
      }
    );

    if (error) {
      res.status(500).json({ message: "Connection to database failed" });
      console.log(error);
      return;
    } else {
      if (found_character) {
        const film_characters = [];
        for (char of found_character) {
          film_characters.push(char.charactername);
        }

        res.json({ film: found_film.title, characters: film_characters });
      } else if (!found_character) {
        res.status(404).json({ message: "Character doesn't exists in database" });
      }
      return;
    }
  };

  // filter & order checks
  //if require details of a character(by name)
  if (req.query.name) {
    getCharacterByName(req.query.name);
    return;
  }
  // if want to filter by min and/or max age
  if (req.query.minage || req.query.maxage) {
    getCharactersByAge(req.query);
    return;
  }

  // if want to filter by min and/or max weigth
  if (req.query.minweigth || req.query.maxweigth) {
    getCharactersByWeigth(req.query);
    return;
  }
  //if want to filter by films
  if (req.query.film) {
    getCharactersByFilm(req.query.film);
    return;
  }

  // get characters
  error = null;

  const foundCharacters = await Character.findAll({ attributes: ["name", "imageurl"] }).catch(
    err => (error = err)
  );
  if (error) {
    res.status(500).json({ message: "Connection to database failed" });
  } else {
    res.json({ foundCharacters });
  }
};
const newCharacter = async (req, res) => {
  error = null;

  const character = await Character.create(req.body).catch(err => (error = err));
  error
    ? res.status(400).json({ error: error.message })
    : res.json({ message: "Character created!", character });
  return;
};
const updateCharacter = async (req, res) => {
  const { characterId: id } = req.params;

  let error = null;

  // find by primary key (id)

  const foundedCharacter = await Character.findByPk(id).catch(err => (error = err));
  if (error) {
    res.status(500).json({ message: "Server: Connection to database failed" });
    console.log(error);
    return;
  }
  if (!foundedCharacter) {
    res.status(404).json({ message: `Character with id '${id}' does not exist in database` });
    return;
  }

  // update if found
  error = null;

  await Character.update(req.body, { where: { id: req.params.characterId } }).catch(err => (error = err));
  if (error) res.status(400).json({ error: error.message });
  else res.json({ message: `Character with id ${id} updated!` });
  return;
};
const deleteCharacter = async (req, res) => {
  const { characterId: id } = req.params;

  // find by primary key (id) and delete if found
  try {
    const foundedCharacter = await Character.findByPk(id);

    if (foundedCharacter) {
      await foundedCharacter.destroy();
      res.json({ message: `Character with id '${id}' and name '${foundedCharacter.name}' was deleted!` });
    } else {
      res.status(404).json({ message: `Character with id '${id}' does not exist in database` });
    }
  } catch (error) {
    res.status(500).json({ message: "Operation in server or database failed!" });
    console.log(error);
  }
};

module.exports = { getCharacters, newCharacter, updateCharacter, deleteCharacter };
