import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Otp>;

@Schema()
export class Otp {
    @Prop()
    email: string;

    @Prop()
    otpCode: string;

    @Prop({
        index: {
            expireAfterSeconds: 60 * 5, //5m
            default: Date.now(),
        },
    })
    time?: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
