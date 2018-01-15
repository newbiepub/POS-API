import {makeExecutableSchema} from "graphql-tools";
import rootQuery from "../schemas/root.graphql";
import Account from "../schemas/account.graphql";
import ProductSchema from "../schemas/product.graphql";
import CurrencySchema from "../schemas/currency.graphql";
import CategorySchema from "../schemas/category.graphql";
import {getUserRoles} from "./account";
import {Category, Product} from "../models/modelConfigs";

const resolvers = {
    Query: {
        currentUser: (obj, info, context) => {
            return context.user
        },
        products: async (obj, info, context) => {
            return await Product.find()
                .populate("categoryId")
                .populate("price.currency")
                .populate("companyId")
                .exec();
        },
        categories: async (obj, info, context) => {
            return await Category.find().exec();
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

export default makeExecutableSchema({typeDefs: rootQuery.concat([Account, ProductSchema, CurrencySchema, CategorySchema]), resolvers});

