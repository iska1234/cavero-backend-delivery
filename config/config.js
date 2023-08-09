const promise = require('bluebird');
const options = {
    promiseLib: promise,
    query: (e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114,function(stringValue){
    return stringValue;
});

const databaseConfig = {
    'host':'dpg-cj9rg42vvtos739nbma0-a',
    'port':5432,
    'database':'delivery_db_8fkg',
    'user':'cavero',
    'password':'wLB9dX51cEkDwbhIFlGurA98lUDSyApl'
};

const db =pgp(databaseConfig);

module.exports = db;