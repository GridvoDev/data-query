'use strict';
const DataQueryService = require("./dataQueryService");

let dataQueryService = null;
function createDataQueryService(single = true) {
    if (single && dataQueryService) {
        return dataQueryService;
    }
    dataQueryService = new DataQueryService();
    return dataQueryService;
};

module.exports = {
    createDataQueryService
};