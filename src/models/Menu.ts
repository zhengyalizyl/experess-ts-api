import { Schema, model, Model, Document } from "mongoose";

//@ts-ignore
export interface IMenuDocument extends Document {
  name: string;
  path: string;
  parent: IMenuDocument;
  permission: string;
  children?: IMenuDocument[];
}

const menuSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name must not be empty"],
    },
    nameCn: String,
    permission: String,
    path: {
      type: String,
      required: [true, "Path must not be empty"],
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      autopopulate: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// https://mongoosejs.com/docs/populate.html#populate-virtuals
menuSchema.virtual("children", {
  ref: "Menu",
  localField: "_id",
  foreignField: "parent",
  options: { populate: "children" },
  // options: { sort: { sort: -1 }, limit: 5 }
});

menuSchema.virtual("parentId").get(function (this: IMenuDocument) {
  return this.parent && this.parent._id;
});

menuSchema.plugin(require("mongoose-autopopulate"));
menuSchema.plugin(require("mongoose-lean-virtuals"));

//@ts-ignore
const Menu: Model<IMenuDocument> = model<IMenuDocument>("Menu", menuSchema);

export default Menu;
