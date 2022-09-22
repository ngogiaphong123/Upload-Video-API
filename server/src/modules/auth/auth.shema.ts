import {object,string,TypeOf} from 'zod'

export const loginSchema = {
    body : object({
        email : string({
            required_error : 'Email is required'
        }).email("Email is not valid"),
        password : string({
            required_error : 'Password is required'
        }).min(6 , "Password must be at least 6 characters long")
    })
}
export type LoginBody = TypeOf <typeof loginSchema.body>