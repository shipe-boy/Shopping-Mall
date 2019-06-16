var express = require('express');
var router = express.Router();

var Goods = require('../module/goods')
var Users = require('../module/users')

router.get('/', async(req, res, next) => {

    //用来创建数据库的假数据
    /* let data = [
        {
            productId: '201910001',
            productName: '自拍杆',
            productImg: '/images/zipai.jpg',
            salePrice: 30
        },
        {
            productId: '201910002',
            productName: '智能插线板',
            productImg: '/images/6.jpg',
            salePrice: 59
        },
        {
            productId: '201910003',
            productName: '头带式耳机-3',
            productImg: '/images/2.jpg',
            salePrice: 80
        },
        {
            productId: '201910004',
            productName: '小钢炮蓝牙音箱',
            productImg: '/images/1.jpg',
            salePrice: 129
        },
        {
            productId: '201910005',
            productName: '智能摄像机',
            productImg: '/images/photo.jpg',
            salePrice: 389
        },
        {
            productId: '201910006',
            productName: 'Ear700',
            productImg: '/images/16.jpg',
            salePrice: 700
        },
        {
            productId: '201910007',
            productName: 'IH 电饭煲',
            productImg: '/images/9.jpg',
            salePrice: 999
        },
        {
            productId: '201910008',
            productName: 'Ear1000',
            productImg: '/images/11.jpg',
            salePrice: 1000
        },
        {
            productId: '201910009',
            productName: '小米6',
            productImg: '/images/mi6.jpg',
            salePrice: 2499
        },
        {
            productId: '201910010',
            productName: '小米电视4A',
            productImg: '/images/10.jpg',
            salePrice: 2099
        },
        {
            productId: '201910011',
            productName: 'Ear2000',
            productImg: '/images/13.jpg',
            salePrice: 2000
        },
        {
            productId: '201910012',
            productName: '平衡车',
            productImg: '/images/pingheng.jpg',
            salePrice: 1999
        },
        {
            productId: '201910013',
            productName: '小米净水器',
            productImg: '/images/8.jpg',
            salePrice: 1988
        },
        {
            productId: '201910014',
            productName: 'Ear1200',
            productImg: '/images/15.jpg',
            salePrice: 1200
        },
        {
            productId: '201910015',
            productName: 'Ear1600',
            productImg: '/images/14.jpg',
            salePrice: 1600
        },
        {
            productId: '201910016',
            productName: '入耳式耳机',
            productImg: '/images/7.jpg',
            salePrice: 199
        },
        {
            productId: '201910017',
            productName: '头戴式耳机',
            productImg: '/images/7.jpg',
            salePrice: 299
        },
        {
            productId: '201910018',
            productName: '头戴-骨传声耳机',
            productImg: '/images/4.jpg',
            salePrice: 388
        },
        {
            productId: '201910019',
            productName: '小米充电宝',
            productImg: '/images/5.jpg',
            salePrice: 188
        },
        {
            productId: '201910020',
            productName: '小米耳机',
            productImg: '/images/12.jpg',
            salePrice: 88
        },
    ] 

    await data.forEach((item) => {
        Goods.create(item)
                .then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
    }) 

    await res.send('ok')*/

    let sort = req.query.sort,
        page = req.query.page,
        pageSize = parseInt(req.query.pageSize),
        priceLevel = req.query.priceLevel,
        params = {};
    // console.log(sort,page,pageSize,priceLevel)
    let priceGt = 0,
        priceLte = 0;
    if (priceLevel !== "all") {
        switch (priceLevel) {
            case "0":
                { priceGt = 0;priceLte = 100; break; }
            case "1":
                { priceGt = 100;priceLte = 500; break; }
            case "2":
                { priceGt = 500;priceLte = 1000; break; }
            case "3":
                { priceGt = 1000;priceLte = 5000; break; }
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }
    // console.log(params)
    Goods.find(params).sort({ salePrice: sort }).skip((page - 1) * pageSize).limit(pageSize)
        .then(response => {
            res.json({
                status: 1,
                msg: '',
                result: response
            })
        }).catch(err => {
            console.log(err)
            res.json({
                status: 0,
                msg: '',
                result: err
            })
        })


})

router.post('/addCart', async(req, res, next) => {

    //虚拟的创建了一个用户
    /* let obj = {
        userId: "10001",
        userName: "jack",
        userPwd: "123456",
        cartList: [],
        addressList: [],
        orderList: [],
    }
    await Users.create(obj).then(doc => {
        console.log(doc)
    }).catch(err => {
        console.log(err)
    })
    await res.send('用户创建成功') */

    let userId = "10001";
    let productId = req.body.productId;

    await Users.findOne({ userId }, (err, userDoc) => {
        if (err) {
            res.json({
                status: 0,
                msg: '服务器出错',
                result: ''
            })
        }
        // console.log(userDoc)
        if (userDoc) {

            let goodsItem = "";
            userDoc.cartList.forEach(item => {
                if (item.productId == productId) {
                    goodsItem = item;
                    item.productNum++;
                }
            })
            if (goodsItem) {
                userDoc.save((err3, response) => {
                    if (err3) {
                        res.json({
                            status: 0,
                            msg: '服务器出错',
                            result: ''
                        })
                    }
                    res.json({
                        status: 1,
                        msg: '加入购物车成功',
                        result: ''
                    })
                })
            } else {
                Goods.findOne({ productId }, (err1, proDoc) => {
                    if (err1) {
                        res.json({
                            status: 0,
                            msg: '服务器出错',
                            result: ''
                        })
                    } else {
                        if (proDoc) {
                            proDoc.productNum = "1";
                            proDoc.checked = "1";
                            userDoc.cartList.push(proDoc);
                            userDoc.save((err2, response) => {
                                if (err2) {
                                    res.json({
                                        status: 0,
                                        msg: '服务器出错',
                                        result: ''
                                    })
                                }
                                res.json({
                                    status: 1,
                                    msg: '加入购物车成功',
                                    result: ''
                                })
                            })
                        }
                    }
                })
            }
        }
    })

})

module.exports = router;