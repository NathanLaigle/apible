"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Apible = void 0;
const axios_1 = require("axios");
const rxjs_1 = require("rxjs");
class Apible {
    constructor() {
        this.event = new rxjs_1.Subject();
    }
    async getAll(options) {
        const { url, queryFilters } = options;
        let generatedUrl = url;
        queryFilters.map((filter, index, queryFiltersInstance) => {
            generatedUrl += index ? `${generatedUrl}&` : `${generatedUrl}?`;
            generatedUrl += `${Object.keys(queryFiltersInstance)[index]}=${filter}`;
        });
        try {
            return (await axios_1.default.get(generatedUrl)).data;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Apible = Apible;
//# sourceMappingURL=apible.service.js.map