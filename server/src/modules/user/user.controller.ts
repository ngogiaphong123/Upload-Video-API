import { RegisterUserBody } from './user.schema';
import { StatusCodes } from "http-status-codes";
import {Request, Response} from 'express';
import { createUser } from "./user.service";
// Request <type of Params,type of ResBody, type of ReqBody>
export async function registerUserHandler(req : Request<{},{},RegisterUserBody>, res : Response) {
    const {username ,email, password} = req.body;
    console.log(req.body);
    try {
        await createUser({username, email, password});
        return res.status(StatusCodes.CREATED).send("User created successfully");
    }
    catch(err : any) {
        if(err.code === 11000) {
            return res.status(StatusCodes.CONFLICT).send('User already exists');
        }
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Something went wrong');
}