"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSecret = exports.getSecretByHash = void 0;
const xmlbuilder_1 = require("./xmlbuilder");
const secret_model_1 = require("./secret-model");
const getSecretByHash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hash } = req.params; // hash kinyerese a request parametereibol
    try {
        const secret = yield (0, secret_model_1.findSecret)(hash); //secret valtozoba eltaroljuk az adatbazisbol lekert adatokat
        if (!secret) {
            return res.status(404).json({ message: 'This secret doesnt exit or might have already expired, or has been viewed too many times' });
        }
        const headerAccept = req.headers.accept;
        if (headerAccept === 'application/xml') { // Ha az accept header XML akkor felepitjuk xml formatumba es azt adjuk vissza
            const xml = (0, xmlbuilder_1.buildXML)(secret);
            res.type('application/xml').send(xml);
        }
        else {
            res.json(secret);
        }
        yield (0, secret_model_1.decrementViews)(hash); //meghivjuk minden hash megtekintesnel a decrementViews funkciok mely csokkenti a hátralévő megtekintések számát
        return secret;
    }
    catch (err) {
        console.error('error fetching the data:', err);
    }
});
exports.getSecretByHash = getSecretByHash;
const addSecret = (req, res, uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const { secret, expireAfter, expireAfterViews } = req.body;
    const id = uuid;
    console.log(uuid, secret, expireAfter, expireAfterViews);
    try {
        yield (0, secret_model_1.saveSecret)(id, secret, expireAfter, expireAfterViews);
    }
    catch (err) {
        console.error(err);
    }
});
exports.addSecret = addSecret;
