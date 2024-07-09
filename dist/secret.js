"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findSecret = async (id) => {
    const sql = `SELECT secret FROM secrets WHERE secrets.id = ${id}`;
};
