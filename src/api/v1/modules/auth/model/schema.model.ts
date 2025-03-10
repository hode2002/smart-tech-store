import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({})
export class Otp {
    @Prop()
    email: string;

    @Prop()
    otpCode: string;

    @Prop({ type: Date, expires: 300, default: Date.now })
    createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
