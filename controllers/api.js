/**
 * 响应客户端api请求，调用API，返回json结果作为响应
 * 注意，方法名应与routeApi.js保持一致
 * 额外，login将重定向到total页面，logout将渲染login页面
 * 可响应：
 * [1]Web客户端的ajax请求
 * [2]移动客户端的http请求
 * 注意，可利用session保存一些区块数据，减少API调用，以提高性能
 */
var FConn = require('./fconn');
var crypto = require('crypto');

var MongoClient = require("mongodb").MongoClient;
var DBurl = 'mongodb://localhost:27017/myproject';
const assert = require('assert');
var mgclient = null;
var user_list = {};
exports.login = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let college = req.body.college;
    let role = req.body.role;

    var timestamp = Date.now();//获取当前时间戳
    //剩余次数和时间戳
    var user_info = {
        "num": 10,
        "timestamp" : timestamp
    };
    if(user_list[username]){//已存在
        var old_timestamp = user_list[username].timestamp;
        if(user_list[username].num == 0 && (new Date(timestamp).toDateString() == new Date(old_timestamp).toDateString())){
            return res.render('login', {
                title: 'Login',
                messages: ('今日剩余次数为0，请明日再试！')
            });
        }
    }else{
        user_list[username] = user_info;
    }
    (async () => {
        try {
            mgclient = await MongoClient.connect(DBurl);
            let col = mgclient.db().collection('users');
            //查询mongodb并与输入的帐号密码进行匹配。
            let docs = await col.find({
                "_id": username
            }).toArray();
            mgclient.close();
            let docsStr = docs.join();
            if (docsStr === "") {
                //throw new Error('用户不存在');
                return res.render('login', {
                    title: 'Login',
                    messages: '无效的用户名或密码错误!'
                });
            } else {
                password = crypto.pbkdf2Sync(password, 'njustXP2018', 10000, 64, 'md5').toString('base64');
                if (username === docs[0]._id && password === docs[0].pwd) {
                    req.session.username = username;
                    ///////////////////////////////////////////////////////////////////添加
                    req.session.college = docs[0].college;
                    req.session.role = docs[0].role;
                    console.log(docs[0].college);

                    //fc_list[username] = fc;
                    (async () => {
                        let fc = await FConn.FConnect(username);
                        fc_list[username] = fc;
                        return res.redirect('conductor');

                    })()
                } else {
                    var num = user_list[username].num;
                    user_info = {
                        "num": num - 1,
                        "timestamp" : timestamp
                    };
                    user_list[username] = user_info;
                    var times = user_list[username].num;
                    return res.render('login', {
                        title: 'Login',
                        messages:  '无效的用户名或密码错误!'
                    });
                }
            }
        } catch (err) {
            console.log('连接出错：', err);
            if (err) {
                return res.render('login', {
                    title: 'Login',
                    messages: err
                });
            }
        }
    })()
};

exports.logout = function (req, res, next) {
    let username = req.session.username;
    
    delete fc_list[username];
    req.session.destroy();
    return res.render('total', {
        title: 'Total',
        messages: '已退出!'
    });
};


exports.confirm = function (req, res, next) {
    let username = req.body.username;
    console.log(username);
    try {
        (async () => {
            mgclient = await MongoClient.connect(DBurl);
            let col = mgclient.db().collection('users');
            let docs = await col.find({
                "_id": username
            }).toArray();
            let docsStr = docs.join();
            if (docsStr === "") {
                // var e = true;
                res.write('true');
            } else {
                res.write('false');
            }
            res.end();
            mgclient.close();

        })()
    } catch (err) {}
};
exports.register = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let phone = req.body.phone;
    let college = req.body.college;
    let role = req.body.role;

    var register = require('../../fabcar/registerUser');
    var file = 'crtuser.json';
    (async () => {
        try {
            //begin
            mgclient = await MongoClient.connect(DBurl);
            let col = mgclient.db().collection('users');
            let cert = await register.registerUser(file, username); //cert
            // console.log(cert);
            let salt = 'njustXP2018';
            password = crypto.pbkdf2Sync(password, salt, 10000, 64, 'md5').toString('base64');
            let write = {
                _id: username,
                pwd: password,
                college: college,
                role: role,
                phone: phone,
                ca: cert.toString(),
                isValid: true
            };
            let r = await col.insertOne(write);
            const assert = require('assert');
            assert.equal(1, r.insertedCount);
            mgclient.close();
            return res.render('login', {
                title: 'Login',
                messages: '注册成功'
            });

            //end
        } catch (err) {
            console.log('注册出错:', err);
            return res.render('register', {
                title: 'Register',
                messages: '注册失败：' + err
            });
        }
    })()
};

exports.getMyTxHistory = function (req, res) {
    var username = req.session.username;
    var college = req.session.college;
    var role = req.session.role;
    // console.log(username);
    if (username === null) {
        return res.render('login', {
            title: 'Login',
            messages: '请先登录!'
        });
    }
    let data = [];
    (async () => {
        try {
            let fc = fc_list[username];

            let mytxall = await fc.mytxall();//所有交易

            for (let tx of mytx) {
                let now_txid = tx.tx_id;
                //let writeset = tx['writeset'];
                let writeset = tx.writeset;
                //console.log(now_txid);
                //for (let j = 0; j < writeset.length; j++) { //每一个key=bidschool
                //    let the_b = writeset[j];
                for (let the_b of writeset) {
                    //let the_history = await eval('fc.query("history","' + the_b['key'] + '")');

                    //把买入加到返回的json数组里。
                    the_b.timestamp = tx.timestamp;
                    the_b.isBuy = true;

                    data.push(the_b);

                    let the_history = await fc.query("history", the_b['key']); //key历史
                    the_history = JSON.parse(the_history);

                    //找是否卖出

                    let count = 0;
                    for (let k = 0; k < the_history.length; k++) {

                        if (the_history[k].txid === now_txid) {
                            count = k;
                        }
                    }
                    if (count !== (the_history.length - 1)) {
                        let the_sell = {};
                        the_sell.key = the_b.key;
                        the_sell.is_delete = the_history[count + 1].isDelete;
                        the_sell.value = the_history[count + 1].value;
                        the_sell.timestamp = the_history[count + 1].timestamp;
                        the_sell.isBuy = false;
                        data.push(the_sell);
                    }
                }
            } //以上计算比较复杂，能否简化？

            res.write(JSON.stringify(data));

        } catch (err) {
            console.error(err);
            res.write('错误:' + err); //?
            //res.end(err.stringify()) //输出?
        }
        res.end();
    })();
};

//通用API调用， 比如 /?cmd=query('history','bid01')
exports.api = function (req, res, next) {
    var username = req.session.username;
    var college = req.session.college;
    var role = req.session.role;
    // console.log(username);
    if (username === null) {
        return res.render('login', {
            title: 'Login',
            messages: '请先登录!'
        });
    }
    (async () => {
        try {
            // let ret = await eval(cmd);
            var fc = fc_list[username];
            var cmd1 = 'fc.' + req.query.cmd;
            var cmd2 = 'fc.' + req.body.cmd;
            // var length = req.body.length;
            var cmd = '';
            if (cmd1 == 'fc.undefined') { //post方法
                cmd = cmd2;
                // console.log(cmd);
            } else { //get方法
                cmd = cmd1;
                // console.log(cmd);
            }
            console.log(cmd);
            if (cmd.startsWith('fc.invoke') || cmd.startsWith('fc.putBase64')) {
                eval(cmd); //注意，invoke调用也可能有返回，但invoke(put,k,v)无返回
                res.write('录入成功！');
            } else {
                var ret = await eval(cmd);
                if (ret !== undefined) {
                    res.write(ret);
                    console.log(ret);
                }
            }
        } catch (err) {
            console.error(err);
            res.write('错误:' + err); //?
            //res.end(err.stringify()) //输出?
        }
        res.end();
    })();
};


exports.getAllTx = function (req, res, next) {
    var username = req.session.username;
    
    console.log("username=" + username);
    if (username === null) {
        return res.render('login', {
            title: 'Login',
            messages: '请先登录!'
        });
    }
    (async () => {
        try {
            let fc = fc_list[username];
            let BeginTime = req.query.BeginTime;
            let EndTime = req.query.EndTime;
            let txtype = req.query.txtype;

            // console.log("txtype is ",txtype);

            let mytx = await fc.mytxall("1");
            let tx = [];//存放我的交易
            for (let k = 1; k < mytx.length; k++) {     
                if(mytx[k].isMine){
                    let writeset = mytx[k].writeset;
                    let timestamp = mytx[k].timestamp;
                    for(let i in writeset){
                        value = writeset[i].value;
                        tx.push({
                            'timestamp': timestamp,
                            'value': value
                        });
                    }
                
                };
                
            }
            let re = [];//时间段内
            for(let i in tx){
                if(tx[i].value && tx[i].timestamp > BeginTime && tx[i].timestamp < EndTime){
                    let data = JSON.parse(tx[i].value);
                    data = eval(data);
                    // console.log(txtype);
                    // console.log(data.txtype);
                    if(data.num && data.txtype == txtype){
                        re.push(data);
                    }
                }
                
            }
            console.log(re);
            res.write(JSON.stringify(re));
        } catch (err) {
            console.error(err);
            res.write('错误:' + err);
        }
        res.end();
    })();

};

exports.remove = function (req, res, next) {
    var username = req.session.username;
    let college = req.session.college;
    let role = req.session.role;
    console.log("username=" + username);
    if (username === null) {
        return res.render('login', {
            title: 'Login',
            messages: '请先登录!'
        });
    }
    (async () => {
        try {
            let fc = fc_list[username];
            let key = req.query.key;
            let reason = req.query.reason;
            let curtx = await fc.query("get", key);
            // let msg = eval('(' + curtx + ')');
            // console.log(msg);
            if (!curtx) {
                res.write('无此证书！');
            }else if(eval('(' + curtx + ')').school!==college||eval('(' + curtx + ')').level!==role){
                res.write('您没有撤销该证书的权限！');
            } 
            else if (eval('(' + curtx + ')').status) {
                res.write('该证书已被撤销！');
            } else {
                let result = JSON.parse(curtx);

                result.status = "撤销";
                result.reason = reason;
                // console.log(result);


                fc.invoke("put", key, JSON.stringify(result));
                res.write('撤销成功！');
            }
        } catch (err) {
            console.error(err);
            res.write('错误:' + err);
        }
        res.end();
    })();
};

exports.getCert = function (req, res, next) {
    let num = req.body.num;
    let Txtype = req.body.txtype;
    // console.log('num=', num);
    // console.log('txtype=', Txtype);
    (async () => {
        try {
            let fc = fc_list['admin'];
            if (fc == undefined) {
                fc = await FConn.FConnect('admin');
                fc_list['admin'] = fc;
            }
            var key = Txtype + num;
            console.log(key);
            let re = await fc.query("get", key);
            console.log(re);
            let pic_src = '';

            if (re) { //若证书存在，查找样本
                let result = JSON.parse(re);
                // console.log(result.certdate);
                var certdate = result.certdate;
                var txtype = result.txtype;
                let selector1 = {
                    selector: {
                        $and: [{
                                date: {
                                    $lte: certdate
                                }
                            },
                            {
                                txtype: {
                                    $eq: txtype
                                }
                            }
                        ]
                    }
                }
                let pic = await fc.query("selectBy", JSON.stringify(selector1));
                if (pic != '{}') { //存在样例 
                    let jsonobj = JSON.parse(pic);
                    //{k1:{v1},k2:{v2},...}转换为[{_id:k1,v1},{_id:k2,v2},...]
                    let newobjs = [];
                    for (let x in jsonobj) {
                        jsonobj[x]._id = x;
                        newobjs.push(jsonobj[x]);
                    }
                    //最后一张图片
                    var last_pic = newobjs[0];
                    for (let i in newobjs) {
                        var cur_pic = newobjs[i];
                        cur_pic.date > last_pic.date ? last_pic = cur_pic : null;
                    }
                    pic_src = last_pic.base64;
                }
            }
            return res.render('information', {
                title: 'Information',
                messages: re,
                pic_src: pic_src
            });
        } catch (err) {
            console.log("Fabric连接出错或执行出错", err);
        }
    })();
};


exports.rangesearch = function (req, res, next) { //模糊查询
    var username = req.session.username;
    let college = req.session.college;
    let role = req.session.role;
    console.log("username=" + username);
    if (username === null) {
        return res.render('login', {
            title: 'Login',
            messages: '请先登录!'
        });
    }

    (async () => {
        try {
            let fc = fc_list[username];
            let num = req.body.num;
            let school = req.body.school;
            let certdate = req.body.certdate;
            let name = req.body.name;
            let major = req.body.major;
            let txtype = req.body.txtype;
            let sex = req.body.sex;
            console.log(txtype);
            let filter = []

            filter.push({
                school: college
            });

            filter.push({
                level: role
            })

            if (txtype !== "") {
                filter.push({
                    txtype: txtype
                })
            }
            if (num !== "") {
                filter.push({
                    num: num
                })
            }
            if (school !== "") {
                filter.push({
                    school: school
                })
            }
            if (certdate !== "") {
                filter.push({
                    certdate: certdate
                })
            }
            if (name !== "") {
                filter.push({
                    name: name
                })
            }
            if (major !== "") {
                filter.push({
                    major: major
                })
            }
            if (sex !== "") {
                filter.push({
                    sex: sex
                })
            }

            console.log(filter);
            //怎么实现组合查询？
            let selector1 = {
                selector: {
                    $and: filter
                }
            }
            let res1 = await fc.query("selectBy", JSON.stringify(selector1));
            console.log(res1);
            if (res1 == "{}") {
                res.write('未找到');
            } else {
                res.write(res1);
            }
            res.end();
        } catch (err) {
            console.error("Fabric连接出错或执行出错", err);
        }
    })()
}