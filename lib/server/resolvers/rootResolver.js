import {makeExecutableSchema} from "graphql-tools";
import rootQuery from "../schemas/root.graphql";
import Account from "../schemas/account.graphql";
import {getUserRoles} from "./account";

const resolvers = {
    Query: {
        currentUser: (obj, info, context) => {
            return context.user
        }
    },
    CurrentCompany: {
        roles: async (user) => {
            let roles = user.roles;
            return await getUserRoles(roles);
        },
    },
    CurrentEmployee: {
        roles: async (user) => {
            let roles = user.roles;
            return await getUserRoles(roles);
        },
    },
    User: {
        __resolveType(obj, context, info) {
            if(obj.companyId) {
                return "CurrentEmployee"
            }

            if(obj.email) {
                return "CurrentCompany"
            }

            return null;
        }
    }
};

export default makeExecutableSchema({typeDefs: rootQuery.concat(Account), resolvers});

