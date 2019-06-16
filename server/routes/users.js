var express = require('express');
var router = express.Router();
require('../util/util') //日期对象原型上扩展的方法

var Users = require('../module/users')


//登陆输入框验证
router.post('/username', (req, res, next) => {
    let userName = req.body.userName;
    // console.log(req.query.userName)
    Users.findOne({
            userName
        })
        .then(response => {
            if (response) {
                res.json({
                    status: 1,
                    msg: "Success",
                })
            } else {
                res.json({
                    status: 0,
                    msg: "用户名不存在",
                })
            }
        }).catch(err => {
            res.json({
                status: 0,
                msg: "服务器出错",
            })
        })
})
router.post('/userpwd', (req, res, next) => {
    let userPwd = req.body.userPwd;
    Users.findOne({
            userPwd
        })
        .then(response => {
            if (response) {
                res.json({
                    status: 1,
                    msg: "Success",
                })
            } else {
                res.json({
                    status: 0,
                    msg: "密码错误",
                })
            }
        }).catch(err => {
            res.json({
                status: 0,
                msg: "服务器出错",
            })
        })
})

//用户登陆
router.post('/login', function(req, res, next) {
    let userName = req.body.userName,
        userPwd = req.body.userPwd;

    Users.findOne({
        userName
    }).then(response => {
        if (response) {
            req.session.userInfo = response;
            res.json({
                status: 1,
                msg: '登陆成功',
                result: response
            })
        }
    }).catch(err => {
        res.json({
            status: 0,
            msg: '服务器错误'
        })
    })

})

//用户保持登陆状态
router.get('/isLogin', (req, res, next) => {
    if (req.session.userInfo) {
        Users.findOne({
            userName: req.session.userInfo.userName
        }).then(response => {
            res.json({
                status: 1,
                msg: 'success',
                result: response
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: 'error',
                result: ""
            })
        })
    } else {
        res.json({
            status: 0,
            msg: 'error',
            result: ""
        })
    }
})

//退出登录
router.get('/logOut', (req, res, next) => {
    delete req.session.userInfo;
    //或者  
    // req.session.destroy();
    res.json({
        status: 1,
        msg: 'success'
    })
})

//获取购物车商品数量
router.get('/cartCount', (req, res, next) => {
    let userId = req.session.userInfo.userId;
    Users.findOne({ userId }).then(doc => {
        if (doc) {
            let cartCount = 0;
            doc.cartList.forEach(item => {
                cartCount += parseInt(item.productNum);
            })
            res.json({
                status: 1,
                msg: 'success',
                result: cartCount
            })
        } else {
            res.json({
                status: 0,
                msg: "没有该用户"
            })
        }
    }).catch(err => {
        res.json({
            status: 0,
            msg: err.message
        })
    })
})


//获取购物车
router.get('/goodsCart', (req, res, next) => {
    let userId = req.session.userInfo._id;
    // console.log(userId);

    Users.findById(userId)
        .then(doc => {
            if (doc) {
                res.json({
                    status: 1,
                    msg: "success",
                    result: doc.cartList
                })
            }
        }).catch(err => {
            res.json({
                status: 0,
                msg: err.message
            })
        })
})

//删除购物车某商品
router.post('/cartDel', (req, res, next) => {
    let userId = req.session.userInfo.userId;
    let productId = req.body.productId;

    Users.update({
        userId
    }, {
        $pull: { //删除数组某一项
            'cartList': {
                productId
            }
        }
    }).then(doc => {
        res.json({
            status: 1,
            msg: 'success'
        })
    }).catch(err => {
        res.json({
            status: 0,
            msg: err.message
        })
    })
})

//购物车商品数量变化
router.post('/cartEdit', (req, res, next) => {
    let userId = req.session.userInfo.userId;
    let productId = req.body.productId;
    let productNum = req.body.productNum;
    let checked = req.body.checked;

    Users.updateOne({
        userId,
        'cartList.productId': productId
    }, {
        "cartList.$.productNum": productNum, //更新子文档
        "cartList.$.checked": checked //更新子文档
    }).then(doc => {
        res.json({
            status: 1,
            msg: 'success'
        })
    }).catch(err => {
        res.json({
            status: 0,
            msg: err.message
        })
    })
})

//全选和全不选
router.post('/checkedAll', (req, res, next) => {
    let userId = req.session.userInfo.userId;
    let checkedAll = req.body.checkedAll ? 1 : 0;

    Users.findOne({
            userId
        })
        .then(doc => {
            if (doc) {
                doc.cartList.forEach(item => {
                    item.checked = checkedAll;
                });
            }
            doc.save().then(response => {
                res.json({
                    status: 1,
                    msg: 'success'
                })
            })
        }).catch(err => {
            res.json({
                status: 1,
                msg: 'success'
            })
        })
})

//用户地址列表
router.get('/address', (req, res, next) => {
    //地址假数据
    /* let obj = [{
      addressId: 10001,
      userName: 'Tom',
      tel: '110-120-119',
      adress: '北京市朝阳区',
      idDefault: true,
      postCode: 100001
    }, {
      addressId: 10002,
      userName: 'lucy',
      tel: '110-120-119',
      adress: '浙江省杭州市金华区',
      idDefault: false,
      postCode: 100002
    }, {
      addressId: 10003,
      userName: '小明',
      tel: '110-120-119',
      adress: '河南省洛阳市吉利区',
      idDefault: false,
      postCode: 100003
    }, {
      addressId: 10004,
      userName: '彬彬',
      tel: '110-120-119',
      adress: '上海市浦东区',
      idDefault: false,
      postCode: 100004
    }, {
      addressId: 10005,
      userName: 'boom',
      tel: '119-119-119',
      adress: '阿拉伯boom',
      idDefault: false,
      postCode: 100005
    }];

    Users.findOne({
      userId: req.session.userInfo.userId
    }).then(doc => {
      obj.forEach(item => {
        doc.addressList.push(item);
      })
      doc.save((err1, docc) => {
        if (err1) {
          res.json({
            status: 0,
            msg: err1.message
          })
        }
        res.json({
          status: 1,
          msg: 'success'
        })
      })
    }).catch(err => {}) */

    let userId = req.session.userInfo.userId;
    Users.findOne({
        userId
    }).then(doc => {
        if (doc) {
            res.json({
                status: 1,
                msg: 'success',
                result: doc.addressList
            })
        }
    }).catch(err => {
        res.json({
            status: 0,
            msg: err.message
        })
    })

})

//设置默认地址
router.post('/setDefault', (req, res, next) => {
    let userId = req.session.userInfo.userId;
    let addressId = req.body.addressId;

    Users.findOne({
        userId
    }).then(doc => {
        if (doc) {
            doc.addressList.forEach(item => {
                if (item.addressId == addressId) {
                    item.idDefault = true; //是idDefault  一开始见数据时写错了
                } else {
                    item.idDefault = false;
                }
            })
            doc.save((err, d) => {
                if (err) {
                    res.json({
                        status: 0,
                        msg: err.message
                    })
                } else {
                    res.json({
                        status: 1,
                        msg: 'success'
                    })
                }
            })
        }
    }).catch(err => {
        res.json({
            status: 0,
            msg: err.message
        })
    })

})

router.post('/delAddress', (req, res, next) => {
    let userId = req.session.userInfo.userId;
    let addressId = req.body.addressId;
    Users.updateOne({
        userId
    }, {
        $pull: {
            'addressList': {
                addressId
            }
        }
    }).then(doc => {
        res.json({
            status: 1,
            msg: 'success'
        })
    }).catch(err => {
        res.json({
            status: 0,
            msg: err.message
        })
    })
})

//
router.post('/payMent', (req, res, next) => {
    let userId = req.session.userInfo.userId;
    let addressId = req.body.addressId;
    let orderTotal = req.body.orderTotal;

    Users.findOne({
        userId
    }).then(doc => {
        let addressInfo = '',
            goodsList = [];
        //获取商品信息
        doc.cartList.forEach(item => {
                if (item.checked == 1) {
                    goodsList.push(item)
                }
            })
            //获取地址信息
        doc.addressList.forEach(item => {
            if (item.addressId == addressId) {
                addressInfo = item;
            }
        })

        //订单id
        let platFrom = '410306', //一个假设的平台码
            r1 = Math.floor(Math.random() * 10),
            r2 = Math.floor(Math.random() * 10),
            sysDate = new Date().Format('yyyyMMddhhmmss'); //系统时间

        let orderId = platFrom + r1 + sysDate + r2;
        let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
        //创建订单
        let order = {
            orderId,
            orderTotal,
            addressInfo,
            goodsList,
            orderStatus: 1, //1表示成功
            createDate //日期
        }

        doc.orderList.push(order)
        doc.save((err1, d) => {
            if (err1) {
                res.json({
                    status: 0,
                    msg: err1.message
                })
            } else {
                res.json({
                    status: 1,
                    msg: 'success',
                    result: {
                        orderId: order.orderId,
                        orderTotal: order.orderTotal
                    }
                })
            }
        })
    }).catch(err => {
        res.json({
            status: 0,
            msg: err.message
        })
    })
})

//
router.get('/orderInfo', (req, res, next) => {
    let orderId = req.param("orderId");
    let userId = req.session.userInfo.userId;
    // console.log(orderId)
    Users.findOne({
        userId
    }).then(doc => {
        //判断用户有没有订单
        if (doc.orderList.length > 0) {
            let orderTotal = 0;
            doc.orderList.forEach(item => {
                if (item.orderId == orderId) {
                    orderTotal = item.orderTotal;
                }
            })

            //判断订单总金额
            if (orderTotal <= 0) {
                res.json({
                    status: 0,
                    msg: '无此订单'
                })
            } else {
                res.json({
                    status: 1,
                    msg: 'success',
                    result: {
                        orderTotal,
                        orderId
                    }
                })
            }
        } else {
            res.json({
                status: 0,
                msg: '当前用户没有订单'
            })
        }

    }).catch(err => {
        res.json({
            status: 0,
            msg: err.message
        })
    })
})

module.exports = router;