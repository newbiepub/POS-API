import {makeExecutableSchema} from "graphql-tools";
import Account from "../schemas/account.graphql";
import ProductSchema from "../schemas/product.graphql";
import IngredientSchema from "../schemas/ingredient.graphql";
import CurrencySchema from "../schemas/currency.graphql";
import CategorySchema from "../schemas/category.graphql";
import InventorySchema from "../schemas/inventory.graphql";
import TransactionSchema from '../schemas/transaction.graphql';
import rootQuery from "../schemas/root.graphql";
import {addNewEmployee, getUserRoles} from "./account";
import {Category, Product, User, PaymentStatus, PaymentMethod, Currency, Transaction} from "../models/modelConfigs";
import {
    currentUserIngredientInventory,
    currentUserProductInventory,
    subtractProductAfterTransactionEmployee,
    returnProductInventoryIssueRefund,
    getAmountInventory
} from "./inventory";
import {addNewProduct, updateProduct} from "./product";
import {addNewIngredient, updateIngredient} from "./ingredient";
import {createTransaction, issueRefundTransaction, updateTransaction} from './transaction';
import {GraphQLScalarType} from 'graphql';
import {Kind} from 'graphql/language';
import { InventoryMutation } from "../features/inventory";
import {InventoryQuery} from "../features/inventory/index";

const schemaString = `
scalar Date

`;
const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        },
    }),
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
            catch (e) {
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
            catch (e) {
                console.warn("error - rootResolve - Query - categories");
                throw e;
            }

        },
        /**
         * Current User Product Inventory
         * @param obj
         * @param variables
         * @param context
         * @returns {Promise.<*>}
         */
        getUserProductInventory: async (obj, variables, context) => {
            try {
                let limit = variables.limit,
                    skip = variables.skip;
                if (variables.type === "employee") {
                    return await currentUserProductInventory({employeeId: variables.userId}, {limit, skip});
                } else if (variables.type === "company") {
                    return await currentUserProductInventory({companyId: variables.userId}, {limit, skip});
                }
                return [];
            }
            catch (e) {
                console.warn("error - rooResolver - Query - currentUserInventory");
                throw e;
            }
        },
        /**
         * Amount User Product Inventory
         * @param obj
         * @param variables
         * @param context
         * @returns {Promise.<*>}
         */
        getAmountUserProductInventory: async (obj, variables, context) => {
            try {
                if (variables.type === "employee") {
                    return await getAmountInventory({employeeId: variables.userId});
                } else if (variables.type === "company") {
                    return await getAmountInventory({companyId: variables.userId});
                }
                return [];
            }
            catch (e) {
                console.warn("error - rooResolver - Query - currentUserInventory");
                throw e;
            }
        },
        /**
         * Current User Ingredient Inventory
         * @param obj
         * @param variables
         * @param context
         * @returns {Promise.<void>}
         */
        getUserIngredientInventory: async (obj, variables, context) => {
            try {
                let limit = variables.limit,
                    skip = variables.skip;

                if (variables.type === "employee") {
                    return await currentUserIngredientInventory({employeeId: variables.userId}, {limit, skip});
                } else if (variables.type === "company") {
                    return await currentUserIngredientInventory({companyId: variables.userId}, {limit, skip});
                }
                return [];
            }
            catch (e) {
                console.log("error - rootResolver - Query - getUserIngredientInventory");
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
            catch (e) {
                console.warn("error - getAllPOS");
            }
        },
        /**
         * Get All Payment Status
         * @param obj
         * @param variables
         * @param context
         * @returns {Promise.<void>}
         */
        paymentStatus: async (obj, variables, context) => {
            try {
                return await PaymentStatus.find().exec();
            }
            catch (e) {
                console.warn("error - PaymentStatus");
            }
        },
        /**
         * Get All Payment Method
         * @param obj
         * @param variables
         * @param context
         * @returns {Promise.<void>}
         */
        paymentMethod: async (obj, variables, context) => {
            try {
                return await PaymentMethod.find().exec();
            }
            catch (e) {
                console.warn("error - PaymentMethod");
            }
        },
        /**
         * Get All Payment Method
         * @param obj
         * @param variables
         * @param context
         * @returns {Promise.<void>}
         */
        currency: async (obj, variables, context) => {
            try {
                if (variables.type === 'employee') {
                    return await Currency.find({employeeId: context.user._id}).exec();
                }
                if (variables.type === 'company') {
                    return await Currency.find({companyId: context.user._id}).exec();
                }
            }
            catch (e) {
                console.warn("error - PaymentMethod");
            }
        },
        /**
         * Get Transaction Employee
         * @param obj
         * @param args
         * @param context
         * @param info
         * @returns {Promise.<void>}
         */
        async getTransactionEmployee(obj, args, context, info) {
            try {
                let employeeId = context.user._id;
                if (context.user.roles.includes('employee')) {
                    let limit = args.limit, skip = args.skip;
                    let result = await Transaction.find({employeeId: employeeId}).sort({"createdAt": -1}).limit(limit).skip(skip).exec();
                    return result;
                }
                throw new Error("PERMISSION_DENIED");
            } catch (e) {
                throw e;
            }
        },
        /**
         * Amount Transaction Employee
         * @param obj
         * @param variables
         * @param context
         * @returns {Promise.<*>}
         */
        getAmountTransactionEmployee: async (obj, variables, context) => {
            try {
                let employeeId = context.user._id;
                if (context.user.roles.includes('employee')) {
                    let result = await Transaction.find({employeeId: employeeId}).count().exec();
                    console.log(result);
                    return {transactionAmount: result};
                }
                return 0
            }
            catch (e) {
                console.warn("error - rooResolver - Query - currentUserInventory");
                throw e;
            }
        },
        /** Inventory */
        ...InventoryQuery
    },
    // Mutation
    Mutation: {
        /**
         * Add New Pos
         * @param obj
         * @param args
         * @param context
         * @param info
         * @returns {Promise.<*>}
         */
        async addNewPOS(obj, args, context, info) {
            try {
                if (context.user.roles.includes('company')) {
                    return await addNewEmployee(args.username, args.password, args.name, args.address, args.phoneNumber, context.user._id.toString());
                }
                throw new Error("PERMISSION_DENIED");
            }
            catch (e) {
                console.warn("error - addNewPOS - Mutation");
                throw e;
            }
        },
        /**
         * Add New Product
         * @param obj
         * @param args
         * @param context
         * @param info
         * @returns {Promise.<*>}
         */
        async addNewProduct(obj, args, context, info) {
            try {
                if (context.user.roles.includes('company')) {
                    return await addNewProduct(args.name, args.price, args.unit, args.description, args.categoryId, context.user._id, args.productCode, args.quantity)
                }
                throw new Error("PERMISSION_DENIED");
            }
            catch (e) {
                console.log("error - addNewProduct - Mutation");
                throw e;
            }
        },
        /**
         * Update Product
         * @param obj
         * @param args
         * @param context
         * @param info
         * @returns {Promise.<*>}
         */
        async updateProduct(obj, args, context, info) {
            try {
                if (context.user.roles.includes("company")) {
                    return await updateProduct(args._id, args.name, args.price, args.unit, args.description, args.categoryId, context.user._id, args.productCode, args.quantity)
                }
                throw new Error("PERMISSION_DENIED");
            }
            catch (e) {
                console.warn("error - updateProduct");
                throw e;
            }
        },
        /**
         * Add New Ingredient
         * @param obj
         * @param args
         * @param context
         * @param info
         * @returns {Promise.<void>}
         */
        async addNewIngredient(obj, args, context, info) {
            try {
                if (context.user.roles.includes('company')) {
                    return await addNewIngredient(args.name, args.description, args.price, args.unit, context.user._id.toString(), args.quantity);
                }
                throw new Error("PERMISSION_DENIED");
            } catch (e) {
                throw e;
            }
        },
        /**
         * Update Ingredient
         * @param obj
         * @param args
         * @param context
         * @param info
         * @returns {Promise.<void>}
         */
        async updateIngredient(obj, args, context, info) {
            try {
                if (context.user.roles.includes('company')) {
                    return await updateIngredient(args._id, args.name, args.description, args.price, context.user._id, args.quantity);
                }
                throw new Error("PERMISSION_DENIED");
            } catch (e) {
                throw e;
            }
        },
        /**
         * Create Transaction
         * @param obj
         * @param args
         * @param context
         * @param info
         * @returns {Promise.<void>}
         */
        async createTransaction(obj, args, context, info) {

            try {
                let employeeId = context.user._id, companyId = context.user.companyId;


                if (context.user.roles.includes('employee') && args.productItems.length > 0) {
                    let subtractInventory = await subtractProductAfterTransactionEmployee(args.productItems, employeeId);
                    return createTransaction(employeeId, companyId, args.productItems, args.paymentStatus, args.paymentMethod, args.dueDate, args.totalQuantity, args.totalPrice, args.paid, args.description, args.customer)
                }
                throw new Error("PERMISSION_DENIED");
            } catch (e) {
                throw e;
            }
        },
        /**
         * Update Transaction
         * @param obj
         * @param args
         * @param context
         * @param info
         * @returns {Promise.<void>}
         */
        async updateTransaction(obj, args, context, info) {
            try {
                let employeeId = context.user._id, companyId = context.user.companyId;
                if (context.user.roles.includes("employee")) {
                    return updateTransaction(args._id, args.dueDate, args.paid, args.description)
                }
                throw new Error("PERMISSION_DENIED");
            } catch (e) {
                throw e;
            }
        },
        /**
         * Issue Refund Transaction
         * @param obj
         * @param args
         * @param context
         * @param info
         * @returns {Promise.<void>}
         */
        async issueRefundTransaction(obj, args, context, info) {
            try {
                let employeeId = context.user._id, companyId = context.user.companyId;

                if (context.user.roles.includes("employee")) {
                    await returnProductInventoryIssueRefund(args.productItems, employeeId);
                    let tran = await issueRefundTransaction(args._id, args.issueRefundReason, args.refundDate);
                    return tran
                }
                throw new Error("PERMISSION_DENIED");
            } catch (e) {
                throw e;
            }
        },
        ...InventoryMutation
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
    ProductInventory: {
        __resolveType(obj, context, info) {
            if (obj.companyId) {
                return "ProductInventoryCompany"
            }
            if (obj.employeeId) {
                return "ProductInventoryEmployee"
            }
            return null;
        }
    },
    IngredientInventory: {
        __resolveType(obj, context, info) {
            if (obj.companyId) {
                return "IngredientInventoryCompany"
            }

            if (obj.employeeId) {
                return "IngredientInventoryEmployee"
            }
            return null;
        }
    }
};
export default makeExecutableSchema({
    typeDefs: rootQuery.concat([
        schemaString,
        Account,
        ProductSchema,
        CurrencySchema,
        CategorySchema,
        IngredientSchema,
        InventorySchema,
        TransactionSchema
    ]),
    resolvers
});

