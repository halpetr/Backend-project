const express = require('express');

var router = express.Router();

router.use(express.json());

const connection = require('../connection');

var index = 0;

router
  .route('/')
  .get(async (req, res, next) => {
    let data = await connection.getAll();
    res.send(data);
    next();
  })
  .post(async (req, res, next) => {
    try {
      let body = req.body;
      let data = await connection.getAll();
      let checkArray = data.map((e) => e.id);
      index = Math.max(...checkArray);
      body.id = ++index;
      res.statusCode = 201;
      let p = await connection.post(body);
      res.send(p);
    } catch (error) {
      res.statusCode = 400;
      res.send(error);
    }
  });

router
  .route('/id')
  .get(async (req, res, next) => {
    try {
      var id = req.query.id;
      let location = await connection.getById(id);
      console.log(location);
      if (location.length != 0) {
        res.send(location);
        next();
      } else {
        res.statusCode = 404;
        res.send({ message: `No location with id ${id}` });
      }
    } catch (error) {
      res.statusCode = 404;
      res.send(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      let id = req.query.id;
      await connection.delete(id);
      res.statusCode = 204;
      res.end();
    } catch (error) {
      res.statusCode = 404;
      res.send(error);
    }
  });

router.route('/max').get(async (req, res, next) => {
  let filtered = [];
  try {
    let maxlat = Number(req.query.lat);
    let maxlon = Number(req.query.lon);
    let data = await connection.getAll();
    if (isNaN(maxlat)) {
      filtered = data.filter((loc) => loc.longitude <= maxlon);
    } else if (isNaN(maxlon)) {
      filtered = data.filter((loc) => loc.latitude <= maxlat);
    } else {
      filtered = data.filter(
        (loc) => loc.latitude <= maxlat && loc.longitude <= maxlon
      );
    }
    res.send(filtered);
  } catch (error) {
    res.send(error);
  }
});

router.route('/min').get(async (req, res, next) => {
  let filtered = [];
  try {
    let minlat = Number(req.query.lat);
    let minlon = Number(req.query.lon);
    let data = await connection.getAll();
    if (isNaN(minlat)) {
      filtered = data.filter((loc) => loc.longitude >= minlon);
    } else if (isNaN(minlon)) {
      filtered = data.filter((loc) => loc.latitude >= minlat);
    } else {
      filtered = data.filter(
        (loc) => loc.latitude >= minlat && loc.longitude >= minlon
      );
    }
    res.send(filtered);
  } catch (error) {
    res.send(error);
  }
});

router.route('/sort').get(async (req, res, next) => {
  let sorted = [];
  try {
    let maxlat = req.query.maxlat;
    let minlat = req.query.minlat;
    let maxlon = req.query.maxlon;
    let minlon = req.query.minlon;
    let data = await connection.getAll();
    if (maxlat) {
      sorted = data.sort((a, b) => {
        return b.latitude - a.latitude;
      });
    } else if (minlat) {
      sorted = data.sort((a, b) => {
        return a.latitude - b.latitude;
      });
    } else if (maxlon) {
      sorted = data.sort((a, b) => {
        return b.longitude - a.longitude;
      });
    } else if (minlon) {
      sorted = data.sort((a, b) => {
        return a.longitude - b.longitude;
      });
    }
    res.send(sorted);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
