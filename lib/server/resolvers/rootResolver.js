import {makeExecutableSchema} from "graphql-tools";
import rootQuery from "../schemas/root.graphql";
import Account from "../schemas/account.graphql";
import ProductSchema from "../schemas/product.graphql";
import CurrencySchema from "../schemas/currency.graphql";
import CategorySchema from "../schemas/category.graphql";
import InventorySchema from "../schemas/inventory.graphql";
import {getUserRoles} from "./account";
import {Category, Inventory, Product, User} from "../models/modelConfigs";

const resolvers = {
    Query: {
        /**
         * Get Current User
         * @param obj
         * @param variables
         * @param context
         * @returns {*}
         */
        currentUser: (obj, variables, context) => {
            return context.user
        },
        /**
         * Get All Products
         * @param obj
         * @param variables
         * @param context
         * @returns {Promise.<*>}
         */
        products: async (obj, variables, context) => {
            try {
                let limit = variables.limit || 100,
                    skip = variables.skip || 0;
                return await Product.find({}).limit(limit).skip(skip)
                    .populate("categoryId")
                    .populate("price.currency")
                    .populate("companyId")
                    .exec();
            }
            catch(e) {
                console.warn("error - rootResolver - Query - products");
                throw e;
            }
        },
        /**
         * Get All Category
         * @param obj
         * @param variables
         * @param context
         * @returns {Promise.<*>}
         */
        categories: async (obj, variables, context) => {
            try {
                let limit = variables.limit || 100,
                    skip = variables.skip || 0;
                return await Category.find().limit(limit).skip(skip).exec();
            }
            catch(e) {
                console.warn("error - rootResolve - Query - categories");
                throw e;
            }

        },
        /**
         * Current User Inventory
         * @param obj
         * @param variables
         * @param context
         * @returns {Promise.<*>}
         */
        currentUserInventory: async (obj, variables, context) => {
            try {
                if(!!context.user.companyId) {
                    return await Inventory.findOne({employeeId: context.user._id.toString()}).exec();
                }

                return await Inventory.findOne({companyId: context.user._id.toString()}).exec();
            }
            catch(e) {
                console.warn("error - rooResolver - Query - currentUserInventory");
                throw e;
            }
        },
        /**
         * Get All Company POS
         * @param obj
         * @param variables
         * @param context
         * @returns {Promise.<void>}
         */
        getAllPOS: async (obj, variables, context) => {
            try {
                return await User.find({companyId: context.user._id.toString()}).exec();
            }
            catch(e) {
                console.warn("error - getAllPOS");
            }
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
            if (obj.companyId) {
                return "CurrentEmployee"
            }

            if (obj.email) {
                return "CurrentCompany"
            }

            return null;
        }
    },
    Inventory: {
        __resolveType(obj, context, info) {
            if (obj.companyId) {
                return "InventoryCompany"
            }

            if (obj.employeeId) {
                return "InventoryEmployee"
            }

            return null;
        }
    }
};

export default makeExecutableSchema({
    typeDefs: rootQuery.concat([
        Account,
        ProductSchema,
        CurrencySchema,
        CategorySchema,
        InventorySchema
    ]),
    resolvers
});

