'use strict';
const MongoDBDataDAO = require("./mongoDBDataDAO");

let dataDAO = null;
function createDataDAO(single = true) {
    if (single && dataDAO) {
        return dataDAO;
    }
    dataDAO = new MongoDBDataDAO();
    return dataDAO;
};

module.exports = {
    createDataDAO
};