/*路由*/
module.exports = function (app) {
    var controller = require('../controller/controller');

    //扫描页面
    app.get('/bi', controller.entry());

    //根据二级路由渲染不同的页面
    app.get('/bi/:pageid', controller.renderPage());
};
