import {Request,Response,NextFunction} from 'express'
import { StatusCodes } from 'http-status-codes'

function requireUser(req:Request, res:Response, next:NextFunction) {
    const user = res.locals.user
    if(!user) {
        return res.status(StatusCodes.FORBIDDEN).send("You must be logged in to access this route");
    }
    return next();
}

export default requireUser