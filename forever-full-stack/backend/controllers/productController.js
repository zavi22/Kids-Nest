import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

const isValidAgeOptions = (ages) =>
    Array.isArray(ages) &&
    ages.length > 0 &&
    ages.every((age) => Number.isInteger(age) && age >= 0 && age <= 14)

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, ages, bestseller } = req.body
        const ageOptions = JSON.parse(ages || "[]")

        if (!isValidAgeOptions(ageOptions)) {
            return res.json({ success: false, message: "Select at least one valid age from 0 to 14" })
        }

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            ages: ageOptions,
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateProductAges = async (req, res) => {
    try {
        const { id, ages } = req.body

        if (!isValidAgeOptions(ages)) {
            return res.json({ success: false, message: "Select at least one valid age from 0 to 14" })
        }

        const product = await productModel.findByIdAndUpdate(id, { ages }, { new: true, runValidators: true })
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        res.json({ success: true, message: "Product ages updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, updateProductAges, removeProduct, singleProduct }