const mysql = require('mysql');

// Connection
let config = {
  connectionLimit: 10,
  host: 'mydb.tamk.fi',
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
};

var pool = mysql.createPool(config);

// Validator
var Validator = require('jsonschema').Validator;
var validator = new Validator();

var locationSchema = {
  properties: {
    latitude: {
      type: 'number',
      minimum: -90,
      maximum: 90,
    },
    longitude: {
      type: 'number',
      minimum: -180,
      maximum: 180,
    },
  },
};

var idSchema = {
  properties: {
    id: {
      type: 'string',
      pattern: '^[0-9]+$',
    },
  },
};

let connectionFunctions = {
  getAll: () =>
    new Promise((resolve, reject) => {
      pool.query('select * from locations', (err, locations) => {
        if (err) {
          reject(err);
        }
        resolve(locations);
      });
    }),

  getById: (id) =>
    new Promise((resolve, reject) => {
      let val = validator.validate({ id }, idSchema);
      if (val.errors.length == 0) {
        pool.getConnection((error, connect) => {
          if (error) throw error;
          var sql = `select * from locations where id = ${connect.escape(id)}`;
          connect.query(sql, (err, location) => {
            if (err) {
              reject(err);
            }
            resolve(location);
            connect.release();
          });
        });
      } else {
        reject(val.errors);
      }
    }),

  post: (location) =>
    new Promise((resolve, reject) => {
      let val = validator.validate(location, locationSchema);
      if (val.errors.length == 0) {
        pool.getConnection((err, connect) => {
          if (err) throw err;
          var sql = `insert into locations (latitude, longitude) values (${connect.escape(
            location.latitude
          )}, ${connect.escape(location.longitude)});`;

          connect.query(sql, (error, result, fields) => {
            if (error) {
              reject(error);
            }
            resolve(location);
          });
          connect.release();
          if (err) throw err;
        });
      } else {
        reject(val.errors);
      }
    }),

  delete: (id) =>
    new Promise((resolve, reject) => {
      let val = validator.validate({ id }, idSchema);
      if (val.errors.length == 0) {
        pool.getConnection((err, connect) => {
          var sql = 'DELETE FROM locations WHERE id = ' + connect.escape(id);
          connect.query(sql, (error, location) => {
            if (error) {
              reject(error);
            }
            if (location.affectedRows == 0) {
              reject({ message: `No location with id ${id}` });
            } else {
              resolve(location);
            }
          });
          connect.release();
        });
      } else {
        reject(val.errors);
      }
    }),
};

module.exports = connectionFunctions;
