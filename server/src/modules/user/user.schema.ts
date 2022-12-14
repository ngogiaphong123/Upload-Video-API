import {object, string, TypeOf} from 'zod'

export const registerUserSchema = {
    body : object({
        username : string({
            required_error : 'Username is required'
        }),
        email : string({
            required_error : 'Email is required'
        }).email("Email is not valid"),
        password : string({
            required_error : 'Password is required'
        }).min(6, "Password must be at least 6 characters long"),
        confirmPassword : string({
            required_error : 'Confirm Password is required'
        }),
    }).refine(data => data.password === data.confirmPassword, {
        message : 'Passwords do not match',
        path : ['confirmPassword']
    })
}
// Create typescript types from zod schema
export type RegisterUserBody = TypeOf<typeof registerUserSchema.body>