"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../../../config/database");
class UserRepository {
    async findById(id) {
        return database_1.prisma.user.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        return database_1.prisma.user.findUnique({ where: { email } });
    }
    async create(data) {
        return database_1.prisma.user.create({ data });
    }
    async update(id, data) {
        return database_1.prisma.user.update({ where: { id }, data });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map