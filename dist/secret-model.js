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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSecret = exports.decrementViews = exports.saveSecret = exports.findSecret = void 0;
const db_1 = __importDefault(require("./db"));
const findSecret = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_1.default.execute("SELECT * FROM secrets WHERE id = ?", [hash]);
    if (!rows || !rows.length) {
        return null;
    }
    console.log(rows);
    const secret = {
        id: rows[0].id,
        secret: rows[0].secret,
        createdAt: rows[0].createdAt,
        expireAfter: rows[0].expireAfter,
        expireAfterViews: rows[0].expireAfterViews,
    };
    const rn = new Date(); // mostani date-timeot megnezzuk, hogy kesobb osszehasonlithassuk a lejarati idovel
    if ((secret.expireAfter && rn > secret.expireAfter) || //ebbe az if ágba le-ellenorizuk, hogy lejart-e a secret ideje, vagy a hátralévő megtekintések elérték-e a 0-t
        secret.expireAfterViews <= 0) {
        yield (0, exports.removeSecret)(secret.id); //toroljuk
        return null; // 
    }
    return secret; //ha ervenyes meg a secret akkor pedig returnoljuk
});
exports.findSecret = findSecret;
const saveSecret = (//ebben a metodusban lementjuk a secretet az adatbazisban
id, secretText, expireAfterMins, expireAfterViews) => __awaiter(void 0, void 0, void 0, function* () {
    const expireAfter = expireAfterMins > 0 ? new Date(Date.now() + expireAfterMins * 60000) : null;
    const createdAt = new Date(Date.now());
    const query = "INSERT INTO secrets (id, secret, createdAt, expireAfter, expireAfterViews) VALUES (?, ?, ?, ?, ?)";
    yield db_1.default.execute(query, [
        id,
        secretText,
        createdAt,
        expireAfter,
        expireAfterViews,
    ]);
});
exports.saveSecret = saveSecret;
const decrementViews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "UPDATE secrets SET expireAfterViews = expireAfterViews - 1 WHERE id = ?";
    yield db_1.default.execute(query, [id]);
});
exports.decrementViews = decrementViews;
const removeSecret = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "DELETE FROM secrets WHERE id = ?";
    yield db_1.default.execute(query, [id]);
});
exports.removeSecret = removeSecret;
