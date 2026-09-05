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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../src/lib/db/prisma");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var maharashtra, up, shiva, ganesha, kashi, trimbakeshwar, siddhivinayak, ashtavinayak, mahashivratri;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting database seeding...');
                    return [4 /*yield*/, prisma_1.prisma.region.upsert({
                            where: { slug: 'maharashtra' },
                            update: {},
                            create: {
                                name: 'Maharashtra',
                                slug: 'maharashtra',
                                type: 'STATE',
                                description: 'The land of the Ashtavinayak and multiple Jyotirlingas.',
                            },
                        })];
                case 1:
                    maharashtra = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.region.upsert({
                            where: { slug: 'uttar-pradesh' },
                            update: {},
                            create: {
                                name: 'Uttar Pradesh',
                                slug: 'uttar-pradesh',
                                type: 'STATE',
                                description: 'The spiritual heartland of India.',
                            },
                        })
                        // 2. Create Deities
                    ];
                case 2:
                    up = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.deity.upsert({
                            where: { slug: 'shiva' },
                            update: {},
                            create: {
                                name: 'Shiva',
                                slug: 'shiva',
                                description: 'The Auspicious One, the destroyer and transformer.',
                            },
                        })];
                case 3:
                    shiva = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.deity.upsert({
                            where: { slug: 'ganesha' },
                            update: {},
                            create: {
                                name: 'Ganesha',
                                slug: 'ganesha',
                                description: 'The Lord of Beginnings and the Remover of Obstacles.',
                            },
                        })
                        // 3. Create Temples
                    ];
                case 4:
                    ganesha = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.temple.upsert({
                            where: { slug: 'kashi-vishwanath' },
                            update: {},
                            create: {
                                name: 'Kashi Vishwanath',
                                slug: 'kashi-vishwanath',
                                description: 'One of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh.',
                                templeType: 'JYOTIRLINGA',
                                isMajor: true,
                                isVerified: true,
                                address: 'Varanasi',
                                regionId: up.id,
                                primaryDeityId: shiva.id,
                            },
                        })];
                case 5:
                    kashi = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.temple.upsert({
                            where: { slug: 'trimbakeshwar' },
                            update: {},
                            create: {
                                name: 'Trimbakeshwar',
                                slug: 'trimbakeshwar',
                                description: 'An ancient Hindu temple in the town of Trimbak, in the Trimbakeshwar tehsil in the Nashik District of Maharashtra.',
                                templeType: 'JYOTIRLINGA',
                                isMajor: true,
                                isVerified: true,
                                address: 'Trimbak, Nashik',
                                regionId: maharashtra.id,
                                primaryDeityId: shiva.id,
                            },
                        })];
                case 6:
                    trimbakeshwar = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.temple.upsert({
                            where: { slug: 'siddhivinayak-mumbai' },
                            update: {},
                            create: {
                                name: 'Siddhivinayak Temple',
                                slug: 'siddhivinayak-mumbai',
                                description: 'A Hindu temple dedicated to Lord Shri Ganesha. It is located in Prabhadevi, Mumbai.',
                                templeType: 'MAJOR_TEMPLE',
                                isMajor: true,
                                isVerified: true,
                                address: 'Prabhadevi, Mumbai',
                                regionId: maharashtra.id,
                                primaryDeityId: ganesha.id,
                            },
                        })
                        // 4. Create Pilgrimage
                    ];
                case 7:
                    siddhivinayak = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.pilgrimage.upsert({
                            where: { slug: 'ashtavinayak' },
                            update: {},
                            create: {
                                name: 'Ashtavinayak Yatra',
                                slug: 'ashtavinayak',
                                description: 'The sacred pilgrimage of eight Ganesha temples in Maharashtra.',
                                durationDays: 3,
                                difficulty: 'EASY',
                                isOfficial: true,
                                regionId: maharashtra.id,
                                deityId: ganesha.id,
                            },
                        })
                        // 5. Create Festival
                    ];
                case 8:
                    ashtavinayak = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.festival.upsert({
                            where: { slug: 'mahashivratri' },
                            update: {},
                            create: {
                                name: 'Mahashivratri',
                                slug: 'mahashivratri',
                                description: 'A festival celebrated annually in honour of the god Shiva.',
                                isMajor: true,
                                deityId: shiva.id,
                                festivalType: 'HINDU',
                            },
                        })];
                case 9:
                    mahashivratri = _a.sent();
                    console.log('Seeding completed successfully!');
                    console.log({
                        regions: [maharashtra.name, up.name],
                        deities: [shiva.name, ganesha.name],
                        temples: [kashi.name, trimbakeshwar.name, siddhivinayak.name],
                        pilgrimages: [ashtavinayak.name],
                        festivals: [mahashivratri.name]
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
