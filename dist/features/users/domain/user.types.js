"use strict";
// Why this is better than using Prisma types everywhere:
// 1- Security (The Password Leak): The Prisma User type automatically includes the password field. 
// If you use it in your Controller's return type, you risk accidentally sending hashed passwords to the frontend. 
// UserResponse prevents this.
// 2- Decoupling: If you decide to add a "Calculated Field" (like displayName which combines First and Last name) that doesn't exist in the database, 
// you can add it to your UserResponse type without touching your database schema.
// 3- Job Safety: When your UserService pushes a job to the EmailWorker, 
// the WelcomeEmailJobPayload ensures the worker receives exactly what it needs to render the email template.
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
/**
 * 1. Enums
 * Use enums for fixed sets of values like Roles or Account Status.
 */
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
    UserRole["SUPPORT"] = "SUPPORT";
})(UserRole || (exports.UserRole = UserRole = {}));
//# sourceMappingURL=user.types.js.map