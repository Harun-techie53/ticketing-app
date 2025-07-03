import { TicketStatus } from "@hrrtickets/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface TicketAttrs {
  title: string;
  description: string;
  status: TicketStatus;
  price: number;
  user: string;
  maxResalePrice: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  description: string;
  status: TicketStatus;
  price: number;
  user: string;
  version: number;
  order: {
    id: string;
    user: string;
  };
  maxResalePrice: number;
  resaledPrice: number | null;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.InStock,
    },
    price: {
      type: Number,
      required: true,
    },
    order: {
      id: {
        type: String,
      },
      user: {
        type: String,
      },
    },
    maxResalePrice: {
      type: Number,
      required: true,
    },
    resaledPrice: {
      type: Number,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    optimisticConcurrency: true,
    versionKey: "version",
  }
);

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
