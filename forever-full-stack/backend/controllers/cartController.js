import userModel from "../models/userModel.js"


// add products to user cart
const addToCart = async (req,res) => {
    try {
        
        const { userId, itemId, age } = req.body

        if (!Number.isInteger(age) || age < 0 || age > 14) {
            return res.json({ success: false, message: "Select a valid product age" })
        }

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][age]) {
                cartData[itemId][age] += 1
            }
            else {
                cartData[itemId][age] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][age] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        
        const { userId ,itemId, age, quantity } = req.body

        if (!Number.isInteger(age) || age < 0 || age > 14 || !Number.isInteger(quantity) || quantity < 0) {
            return res.json({ success: false, message: "Invalid age or quantity" })
        }

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][age] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// get user cart data
const getUserCart = async (req,res) => {

    try {
        
        const { userId } = req.body
        
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export { addToCart, updateCart, getUserCart }