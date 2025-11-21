import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Record extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  age: number;
}

export type RecordDocument = Record & Document;

export const RecordSchema = SchemaFactory.createForClass(Record);
