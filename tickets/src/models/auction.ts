import mongoose from "mongoose";
import { TicketDoc } from "./tickets";

interface AuctionAttrs {
  ticket: TicketDoc;
  basePrice: number;
  expiresAt: Date;
  status: AuctionStatusType;
}

export enum AuctionStatusType {
  Active = "active",
  Inactive = "inactive",
}

export interface BidDoc {
  userId: string;
  price: number;
  placedAt: Date;
}

interface AuctionDoc extends mongoose.Document {
  ticket: TicketDoc;
  basePrice: number;
  expiresAt: Date;
  status: AuctionStatusType;
  highestBidder: BidDoc;
  bids: BidDoc[];
}

interface AuctionModel extends mongoose.Model<AuctionDoc> {
  build: (attrs: AuctionAttrs) => AuctionDoc;
}

const bidSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  price: {
    type: Number,
  },
  placedAt: {
    type: Date,
  },
});

const auctionSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
    basePrice: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AuctionStatusType),
      default: AuctionStatusType.Inactive,
    },
    highestBidder: bidSchema,
    bids: [bidSchema],
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

auctionSchema.statics.build = (attrs: AuctionAttrs) => {
  return new Auction(attrs);
};

export const Auction = mongoose.model<AuctionDoc, AuctionModel>(
  "Auction",
  auctionSchema
);
