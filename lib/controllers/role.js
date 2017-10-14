import {Role} from "../models/role";

const rolesCount = async () => {
    try {
        let roleCount = Role.count();
        roleCount = await roleCount.exec();
        return roleCount
    } catch (e) {
        console.warn("error - rolesCount");
        throw e;
    }
};

const createRole = async (roleName) => {
    try {
        let role = new Role({name: roleName});
        role = await role.save();
        return role;
    } catch (e) {
        console.warn("error - createRole");
        throw e;
    }
};

export { rolesCount, createRole };