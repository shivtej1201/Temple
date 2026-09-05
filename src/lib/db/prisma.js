"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
var adapter_libsql_1 = require("@prisma/adapter-libsql");
var globalForPrisma = globalThis;
var adapter = new adapter_libsql_1.PrismaLibSql({ url: 'file:dev.db' });
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({ adapter: adapter });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
