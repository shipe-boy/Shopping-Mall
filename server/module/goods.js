const {db} = require("../database/connect") //得到数据库操控对象
const {Schema} = require("../database/connect");//得到Schema对象

//设置的规范
const productSchema = new Schema({
    productId : String,
    productName : String,
    salePrice : Number,
    productImg : String,
    productNum: String,
    checked: String
},{versionKey : false})

//导出表
module.exports = db.model("Good", productSchema);