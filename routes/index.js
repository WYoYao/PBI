/*路由*/
module.exports = function (app) {
    var controller = require('../controller/controller');

    //扫描页面
    app.get('/entry', controller.entry());
};
