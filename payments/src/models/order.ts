import { OrderStatus } from "@hrrtickets/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  id: string;
  user: string;
  status: OrderStatus;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc>;
}

interface OrderDoc extends mongoose.Document {
  user: string;
  status: OrderStatus;
  price: number;
  version: number;
}

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    user: attrs.user,
    status: attrs.status,
    price: attrs.price,
  });
};

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  const order = Order.findOne({ _id: event.id, version: event.version - 1 });
  return order;
};

export const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
