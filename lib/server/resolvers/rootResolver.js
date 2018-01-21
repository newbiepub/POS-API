import {makeExecutableSchema} from "graphql-tools";
import rootQuery from "../schemas/root.graphql";
import Account from "../schemas/account.graphql";
import ProductSchema from "../schemas/product.graphql";
import CurrencySchema from "../schemas/currency.graphql";
import CategorySchema from "../schemas/category.graphql";
import InventorySchema from "../schemas/inventory.graphql";
import {addNewEmployee, getUserRoles} from "./account";
import {Category, Inventory, Product, User} from "../models/modelConfigs";
import * as _ from "lodash";
import {currentUserInventory} from "./inventory";

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
        getUserInventory: async (obj, variables, context) => {
            try {
                if(variables.type === "employee") {
                    return await currentUserInventory({employeeId: variables.userId});
                } else if(variables.type === "company") {
                    return await currentUserInventory({companyId: variables.userId});
                }
                return null;
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
    // Mutation
    Mutation: {
        async addNewPOS (obj, args, context, info) {
            try {
                if(_.includes(context.user.roles, "company")) {
                    return await addNewEmployee(args.username, args.password, args.name, args.address, args.phoneNumber, context.user._id.toString());
                }
                throw new Error("PERMISSION_DENIED");
            }
            catch(e) {
                console.warn("error - addNewPOS - Mutation");
                throw e;
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

