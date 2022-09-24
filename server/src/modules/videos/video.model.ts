import {getModelForClass,prop,Ref} from '@typegoose/typegoose'
import { customAlphabet } from 'nanoid';
import { User } from '../user/user.model';
//? Class {
//?     @prop({mongoose options}) is used to define the schema
//?     accessibility, name of the property and the type of the property;
//? }
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);
export class Video {
    @prop()
    public title : string;

    @prop()
    public description : string;

    @prop({enum : ['mp4']})
    public extension : string;

    @prop({required : true , Ref : () => User})
    public owner : Ref<User>;

    @prop({required : true, default : () => nanoid()})
    public videoId : string;

    @prop({default : false})
    public published : boolean;
}

export const VideoModel = getModelForClass(Video , {
    schemaOptions : {
        timestamps : true
    }
})
