import {createModel} from "./database";
import {Schema} from "mongoose";
import { UUIDGeneratorNode, ttl } from "../../utils/helpers";

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

// Trader Information
const TraderInfomation = new Schema({
    _id: {
        type: ObjectId
    },
    name: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return (new RegExp(/^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/igm)).test(v) || v.length === 0;
            },
            message: 'NOT_VALID_PHONE_NUMBER'
        },
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return (new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm)).test(v) || v.length === 0;
            },
            message: 'NOT_VALID_EMAIL'
        },
        default: ''
    },
    description: {
        type: String,
        default: ''
    }
});

/* Inventory History */
const InventoryHistorySchema = new Schema({
    products: {
        type: Array,
        default: []
    },
    ingredients: {
        type: Array,
        default: []
    },
    totalQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    totalPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    type: {
        type: String,
        enum: ["import", "export"],
        required: true
    },
    from: {
        type: TraderInfomation
    },
    to: {
        type: TraderInfomation
    },
    dateDelivered: {
        type: Date,
        default: null
    },
    dateReceived: {
        type: Date,
        default: null
    }
});

const InventoryHistory = createModel("inventory_history", InventoryHistorySchema, "inventory_history");

/* Inventory Activity */
const InventoryActivitySchema = new Schema({
    products: {
        type: [ObjectId],
        ref: "product",
        default: []
    },
    ingredients: {
        type: [ObjectId],
        ref: "ingredient",
        default: []
    },
    totalQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    totalPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    paid: {
        type: Number,
        default: 0,
        min: 0
    },
    type: {
        type: String,
        enum: ["import", "export"],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'done']
    },
    from: {
        type: TraderInfomation
    },
    to: {
        type: TraderInfomation
    },
    dateRequest: {
        type: Date,
        default: null
    },
    dateDelivered: {
        type: Date,
        default: null
    },
    dateReceived: {
        type: Date,
        default: null
    }
});

const InventoryActivity = createModel("inventory_activity", InventoryActivitySchema, "inventory_activity");

/* Transaction */

// Product Item Transaction
const ProductItemTransaction = new Schema({
    _id: {type: ObjectId, ref: "product"},
    productName: {type: String, required: true},
    quantity: {type: Number, default: 1, min: 1, required: true},
    price: {type: Object, required: true},
    totalPrice: {type: Number, default: 0, min: 0, required: true},
    unit: {type: String, required: true},
    discount: {type: Number, default: 0, min: 0}
});
// Paid Transaction
const PaidTransaction = new Schema({
    date: {type: Date, default: new Date()},
    amount: {type: Number, required: true},
});

// Customer
const Customer = createModel("customer", new Schema({
    name:{type:String,default:""},
    email:{type:String,default:""},
    address:{type:String,default:""},
    phone:{type:String,default:""},
    description:{type:String,default:null},
}), "customer");

// Transaction Issue Refund
const PaymentStatus = createModel("payment_status", new Schema({
    type: {type: String},
    name: {type: String}
}), "payment_status");

const PaymentMethod = createModel("payment_method", new Schema({
    type: {type: String},
    name: {type: String}
}), "payment_method");

// Transaction
const Transaction = createModel("transaction", new Schema({
    employeeId: {type: ObjectId, ref: "users"},
    companyId: {type: ObjectId, ref: "users"},
    productItems: {type: [ProductItemTransaction], required: true},
    type: {type: String, enum: ["receive", "pay"], default: "receive"},
    issueRefund: {type: Boolean, default: false},
    issueRefundReason: {type: String, default: ""},
    refundDate: {type: Date, default: null},
    paymentStatus: {type: Object, required: true, ref: 'payment_status'},
    paymentMethod: {type: Object, required: true, ref: 'payment_method'},
    dueDate: {type: Date, default: null},
    totalQuantity: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    createdAt:{type:Date,default:new Date()},
    paid: {type: [PaidTransaction], required: true},
    description: {type: String, default: ""},
    customer: {type: Object, default: null,ref: "customer"},
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
    InventoryActivity,
    InventoryHistory
};