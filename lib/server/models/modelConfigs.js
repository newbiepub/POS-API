import {createModel} from "./database";
import {Schema} from "mongoose";
import {ttl, UUIDGeneratorNode} from "../../utils/helpers";

const ObjectId = Schema.ObjectId; // Mongoose ObjectId

// Access Token
const AccessToken = createModel("access_token", new Schema({
    access_token: {type: String, required: true, default: UUIDGeneratorNode()},
    refresh_token: {type: String, required: true, default: UUIDGeneratorNode()},
    createdAt: {type: Date, default: new Date()},
    userId: {type: String, required: true},
    ttl: {type: Number, required: true, default: ttl()}
}), "access_token");


// Roles
const Roles = createModel("roles", new Schema({
    roleName: {type: String, required: true}
}), "roles");


// User Profile
const UserProfile = new Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    phoneNumber: {type: String, required: true}
}, {strict: false});


// User
const UserSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return (new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm)).test(v);
            },
            message: 'NOT_VALID_EMAIL'
        }
    },
    username: {
        type: String,
        validate: {
            validator: (v) => {
                return v.length >= 6;
            },
            message: 'NOT_VALID_USERNAME'
        }
    },
    profile: {type: UserProfile, required: true, default: {}},
    roles: {type: [String], required: true},
    password: {type: String, required: true},
    companyId: {type: String}
});

// Create Inventory for POS after create POS
UserSchema.post("save", function (doc, next) {
    next();
});

const User = createModel("users", UserSchema, "users");

// Category
const Category = createModel("category", new Schema({
    name: {type: String, required: true},
    description: {type: String}
}), "category");

// Product
// Product Price
const ProductPrice = new Schema({
    name: {type: String, required: true},
    price: {type: Number, default: 0, min: 0},
    currency: {type: ObjectId, required: true, ref: "currency"}
});

/* Product */

// Product Schema

const ProductSchema = new Schema({
    name: {
        type: String, required: true,
    },
    price: {type: [ProductPrice], required: true},
    unit: {type: String, required: true},
    description: {type: String},
    categoryId: {type: ObjectId, ref: "category"},
    detail: {type: Object},
    companyId: {type: ObjectId, required: true, ref: "users"},
    productCode: {type: String}
});

// Schema Hooks

ProductSchema.post('save', async (doc, next) => {
    try {
        await new ProductInventory({
            product: doc._id,
            quantity: 0,
            companyId: doc.companyId,
            description: ""
        }).save();
    } catch (e) {
        console.log("ERROR INSERT PRODUCT INVENTORY: ", e.message);
    }
    next();
});

// Product Model
const Product = createModel("product", ProductSchema, "product");

// Currency
const Currency = createModel("currency", new Schema({
    name: {type: String, required: true},
    employeeId: {type: ObjectId, required: true, ref: "users"},
    companyId: {type: ObjectId, required: true, ref: "users"},
    symbol: {type: String, required: true}
}), "currency");

// Discount
const Discount = createModel("discount", new Schema({
    product: {type: Array, required: true},
    companyId: {type: ObjectId, required: true, ref: "users"},
    employeeId: {type: ObjectId, required: true, ref: "users"},
    name: {type: String},
    type: {type: Array, default: ["percent", "amount"]},
    value: {type: Number, default: 0, min: 0},
    description: {type: String}
}), "discount");

/* Ingredient */

// Ingredient Schema
const IngredientSchema = new Schema({
    name: {type: String, default: ""},
    description: {type: String},
    price: {type: Number, default: 0, min: 0},
    unit: {type: String, required: true},
    companyId: {type: ObjectId, ref: "users"}
});

// Ingredient Hooks
IngredientSchema.post("save", async (doc, next) => {
    try {
        await new IngredientInventory({
            ingredient: doc._id,
            quantity: 0,
            companyId: doc.companyId,
            description: ""
        }).save();
    }
    catch (e) {
        console.log("ERROR INVENTORY INGREDIENT: ", e.message);
    }
    next();
});

// Ingredient Model
const Ingredient = createModel("ingredient", IngredientSchema, "ingredient");

/*Inventory*/

// Product Inventory
const ProductInventory = createModel("product_inventory", new Schema({
    product: {type: ObjectId, ref: "product"},
    quantity: {type: Number, min: 0, default: 0},
    employeeId: {type: ObjectId, ref: "users"},
    companyId: {type: ObjectId, ref: "users"},
    description: {type: String, default: ""}
}), "product_inventory");

// Ingredient Inventory
const IngredientInventory = createModel("ingredient_inventory", new Schema({
    ingredient: {type: ObjectId, ref: "ingredient"},
    quantity: {type: Number, default: 0, min: 0},
    employeeId: {type: ObjectId, ref: "users"},
    companyId: {type: ObjectId, ref: "users"},
    description: {type: String, default: ""}
}), "ingredient_inventory");

/* Inventory Activity */

const InventoryActivitySchema = {

};

/* Transaction */

// Product Item Transaction
const ProductItemTransaction = new Schema({
    productName: {type: String, required: true},
    quantity: {type: Number, default: 0, min: 0},
    price: {type: Number, default: 0, min: 0},
    currency: {type: Object, ref: "currency",required: true},
    unit: {type: String, required: true},
    discount: {type: Number, default: 0, min: 0}
});

// Transaction Issue Refund
const IssueRefundReason = new Schema({
    name: {type: String, default: ""},
    reason: {type: String, default: ""}
});

const IssueRefund = new Schema({
    amount: {type: Number, default: 0, min: 0},
    reason: {type: [IssueRefundReason], default: []}
});
const PaymentStatus = createModel("payment_status", new Schema({
    type:{type:String},
    name: {type: String}
}), "payment_status");

const PaymentMethod = createModel("payment_method", new Schema({
    type:{type:String},
    name: {type: String}
}), "payment_method");
// Transaction
const Transaction = createModel("transaction", new Schema({
    productItems: {type: [ProductItemTransaction], default: []},
    type: {type: String, enum: ["receive", "pay"], default: "receive"},
    issueRefund: {type: IssueRefund, default: {}},
    employeeId: {type: ObjectId, ref: "users"},
    companyId: {type: ObjectId, ref: "users"},
    date: {type: Date, default: new Date()},
    paymentStatus: {type: Object, required: true, ref: 'payment_status'},
    paymentMethod: {type: Object, required: true, ref: 'payment_method'},
    description: {type: String, default: ""},
    customer: {type: Object, default: {}},
    totalQuantity: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    paid: {type: Number, required: true}
}), "transaction");

export {
    AccessToken,
    User,
    Roles,
    Category,
    Product,
    Currency,
    Discount,
    Transaction,
    Ingredient,
    ProductInventory,
    IngredientInventory,
    PaymentStatus,
    PaymentMethod,
};