"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildXML = void 0;
const xml2js_1 = require("xml2js");
const buildXML = (obj) => {
    const builder = new xml2js_1.Builder();
    return builder.buildObject(obj);
};
exports.buildXML = buildXML;
