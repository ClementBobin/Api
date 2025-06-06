'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.mockUserWithId = exports.mockCreateUser = exports.mockUser = void 0;
const faker_1 = require('@faker-js/faker');
const mockUser = () => {
    return {
        email: faker_1.faker.internet.email(),
        name: faker_1.faker.person.fullName(),
    };
};
exports.mockUser = mockUser;
const mockCreateUser = () => {
    return Object.assign(Object.assign({}, (0, exports.mockUser)()), { password: faker_1.faker.internet.password() });
};
exports.mockCreateUser = mockCreateUser;
const mockUserWithId = () => {
    return Object.assign(Object.assign({}, (0, exports.mockCreateUser)()), { id: faker_1.faker.number.int({ min: 1, max: 1000 }), salt: faker_1.faker.string.alphanumeric(16) });
};
exports.mockUserWithId = mockUserWithId;
