import { makeExecutableSchema } from "graphql-tools";
import rootQuery from "../schemas/root.graphql";
import Account from "../schemas/account.graphql";
import {getAllUser, getUserRoles} from "./account";

const resolvers = {
    Query: {
        users: async () => {
            return await getAllUser();
        },
    },
    User: {
        roles: async (user) => {
            let roles = user.roles;
            return await getUserRoles(roles);
        }
    }
};

export default makeExecutableSchema({typeDefs: rootQuery.concat(Account), resolvers});

