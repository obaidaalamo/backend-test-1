import mongoose from "../mongoose";

const schema = new mongoose.Schema(
  {
    title: String,
    description: String,
    main_image: String,
    additional_images: [String],
    date_time: Number,
  },
  { timestamps: true }
);

schema.set("toObject", { virtuals: true });
schema.set("toJSON", { virtuals: true });

export default mongoose.model("Blog", schema);