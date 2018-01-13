import {AccessToken, Roles, User} from "../models/modelConfigs";
import {ttl, UUIDGeneratorNode} from "../../utils/helpers";

export async function checkUserAuth(access_token, refresh_token) {
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
                token = await AccessToken.findOne({refresh_token}).exec();
                if(token) {
                    // Field update token
                    let updateItem = {
                        createdAt: new Date(),
                        ttl: ttl(),
                        access_token: UUIDGeneratorNode(),
                        refresh_token: UUIDGeneratorNode()
                    };
                    AccessToken.update({refresh_token}, {$set: updateItem}) // Update Token
                } else {
                    throw new Error("Token is expired");
                }
            }
        } else {
            console.log("Token not found");
            throw new Error("Unauthorized");
        }
    } catch(e) {
        throw e;
    }
}