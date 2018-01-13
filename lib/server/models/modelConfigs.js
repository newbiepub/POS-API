import {createModel} from "./database";
import { Schema } from "mongoose";
import {ttl, UUIDGeneratorNode} from "../../utils/helpers";

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
}, { strict: false });


// User
const User  = createModel("users", new Schema({
    email: {
        type: String,
        validate: {
            validator: function(v) {
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
}),"users");

export { AccessToken, User, Roles };