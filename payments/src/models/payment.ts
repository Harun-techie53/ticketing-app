import mongoose from "mongoose";

interface PaymentAttrs {
  user: string;
  orderId: string;
  price: number;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

interface PaymentDoc extends mongoose.Document {
  user: string;
  orderId: string;
  price: number;
  createdAt: Date;
}

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

export const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);
