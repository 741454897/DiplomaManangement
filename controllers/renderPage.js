/**
 * 页面控制器方法的实现
 * 注意，方法名应与routrPage.js保持一致
 * 页面控制器方法的一般过程:
 * [1]从请求中取出参数，从session中取出已存入参数
 * [2]可用这些参数调用API，得到结果
 * [3]参数以及结果用于渲染动态页面，页面中包含被渲染变量<%=var%>
 * 下面设计没有第[2]步，原因是：
 * [1]采用页面内ajax调用来更新页面数据
 * [2]采用ejs带控制流的标签来书写页面元素比较复杂
 *
 */
//登录页面
exports.renderLogin = function (req, res) {
    // console.log('1');
    res.render('login', {
        title: 'Login',
        messages:null,
        username: req.session.username,
        college: req.session.college,
        role: req.session.role
    });
    // next()
};
//注册页面
exports.renderRegister = function (req, res) {

    // console.log('1');
    res.render('register', {
        title: 'Register',
        messages:null
    });
    // next()
};


//个人主页
exports.renderTotal = function (req, res, next) {
    res.render('total', {
        title: 'Total',
        username: req.session.username,
        college: req.session.college,
        role: req.session.role
    });
};

exports.renderTotal2 = function (req, res, next) {
    res.render('total2', {
        title: 'Total2',
        username: req.session.username,
        college: req.session.college,
        role: req.session.role
    });
};


//撤销证书
exports.renderRevoke = function (req, res, next) {
    console.log('1');
    if (!req.session.username) {
        res.render('login', {
            title: 'Login',
            messages: '请先登录'
        });
    } else {
        // console.log('total');
        res.render('revoke', {
            title: 'Revoke',
            username: req.session.username,
            college: req.session.college,
            role: req.session.role
        });
    }
};

//批量录入
exports.renderExcel = function (req, res, next) {
    // console.log('1');
    if (!req.session.username) {
        res.render('login', {
            title: 'Login',
            messages: '请先登录'
        });
    } else {
        // console.log('total');
        res.render('excel', {
            title: 'excel',
            username: req.session.username,
            college: req.session.college,
            role: req.session.role
        });
    }
};

//录入样本
exports.renderSample = function (req, res, next) {
    // console.log('1');
    if (!req.session.username) {
        res.render('login', {
            title: 'Login',
            messages: '请先登录'
        });
    } else {
        // console.log('total');
        res.render('sample', {
            title: 'Sample',
            username: req.session.username,
            college: req.session.college,
            role: req.session.role
        });
    }
};


exports.renderCount = function (req, res, next) {
    if (!req.session.username) {
        res.render('login', {
            title: 'Login',
            messages: '请先登录'
        });
    } else {
        res.render('count', {
            title: 'Count',
            username: req.session.username,
            college: req.session.college,
            role: req.session.role
        });
    }
};
exports.renderConductor = function (req, res, next) {
    if (!req.session.username) {
        res.render('login', {
            title: 'Login',
            messages: '请先登录'
        });
    } else {
        res.render('conductor', {
            title: 'Conductor',
            username: req.session.username,
            college: req.session.college,
            role: req.session.role
        });
    }
};


exports.renderInformation = function (req, res, next) {
    res.render('information', {
        title: 'Information',
        username: req.session.username,
        college: req.session.college,
        role: req.session.role
    });
};

exports.renderOnemodify = function (req, res, next) {
    if (!req.session.username) {
        res.render('login', {
            title: 'Login',
            messages: '请先登录'
        });
    } else {
        res.render('onemodify', {
            title: 'Onemodify',
            username: req.session.username,
            college: req.session.college,
            role: req.session.role
        });
    }
};

exports.renderHistory = function (req, res, next) {
    if (!req.session.username) {
        res.render('login', {
            title: 'Login',
            messages: '请先登录'
        });
    } else {
        res.render('history', {
            title: 'History',
            username: req.session.username,
            college: req.session.college,
            role: req.session.role
        });
    }
};

exports.renderDemo = function (req, res, next) {

    res.render('demo', {
        title: 'demo',
        username: req.session.username
        });
};
