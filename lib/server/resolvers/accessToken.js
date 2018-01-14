import {AccessToken, Roles, User} from "../models/modelConfigs";
import {ttl, UUIDGeneratorNode} from "../../utils/helpers";

export async function createAuthToken(userId) {
    try {
        let upsertItem = {
            access_token: UUIDGeneratorNode(),
            refresh_token: UUIDGeneratorNode(),
            createdAt: new Date(),
            ttl: ttl()
        };

        await AccessToken.update({userId}, {$set: upsertItem}, {upsert: true}).exec();
        return {
            access_token: upsertItem.access_token,
            refresh_token: upsertItem.refresh_token
        };
    } catch (e) {
        throw e;
    }
}

export async function checkUserAuth(access_token) {
    try {
        let token = await AccessToken.findOne({access_token}).exec();
        if(token) {
            if(+(new Date(token.ttl)) > Date.now()) {
                let currentUser = await User.findOne({_id: token.userId}).exec(),
                    roles = await Roles.find({_id: {$in: currentUser.roles}}).exec();

                roles = roles.map(role => role.roleName);
                return {
                    user: currentUser,
                    roles
                }
            } else {
                throw new Error("Token is expired");
            }
        } else {
            console.log("Token not found");
            throw new Error("Unauthorized");
        }
    } catch(e) {
        throw e;
    }
}