const { db } = require("../database/connect") //得到数据库操控对象
const { Schema } = require("../database/connect"); //得到Schema对象

const userSchema = new Schema({
    userId: String,
    userName: String,
    userPwd: String,
    orderList: { //订单列表
        type: Array,
        default: []
    },
    cartList: [ //购物车列表
        {
            productId: String,
            productName: String,
            salePrice: String,
            productNum: String,
            productImg: String,
            checked: String
        }
    ],
    addressList: [ //地址列表
        {
            addressId: String,
            userName: String,
            tel: String,
            adress: String,
            idDefault: Boolean,
            postCode: String
        }
    ]
}, { versionKey: false })


/* userSchema.pre('save',(doc)=>{
    console.log(...arguments)
}) */


module.exports = db.model("user", userSchema);