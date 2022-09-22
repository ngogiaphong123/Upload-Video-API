import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../user/user.model";
import omit from '../../helpers/omit';
import { findUserByEmail } from "../user/user.service";
import { signJwt } from "./auth.utils";
import { LoginBody } from "./auth.shema";
export async function loginHandler(req : Request<{},{},LoginBody>,res : Response) {
    const {email , password} = req.body;
    //? Find the user by email
    const user = await findUserByEmail(email);
    //? Verify password
    if(!user || !user.comparePassword(password)) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Invalid email or password");
    }
    const payload = omit(user.toJSON(),'password');
    console.log(payload);
    //? Sign a jwt
    const jwt = signJwt(payload);
    //? Add a cookie to the response
    res.cookie('accessToken', jwt, {
        maxAge: 3.154e+10, //? 1 year
        httpOnly: true, //? cookie will be accessible only by the web server
        domain : 'localhost',
        path : '/',
        sameSite : 'strict',
        secure : false
    })
    //? Response
    return res.status(StatusCodes.OK).send(jwt);
}

