import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    ages: {
        type: [{ type: Number, min: 0, max: 14 }],
        required: true,
        validate: {
            validator: (ages) => ages.length > 0 && ages.every(Number.isInteger),
            message: "Products must have at least one valid age"
        }
    },
    bestseller: { type: Boolean },
    date: { type: Number, required: true }
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel