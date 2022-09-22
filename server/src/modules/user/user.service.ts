import { UserModel } from "./user.model";

export async function createUser(user : any) {
    return UserModel.create(user);
}