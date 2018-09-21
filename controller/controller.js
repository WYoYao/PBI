/*路由控制的实现*/
function controller() {
	this.tool = require('common/tool');
	this.realRestClient = require('common/executeRequest');
}

var menu = require("../menu.js");

controller.prototype.entry = function (req, res, next) {
	var _this = this;
	return function (req, res, next) {

		var type = req.query.type || "";
		var sorm = req.query.sorm || "";

		var list = menu.multiple.contents.concat(menu.single.contents).filter(function (item) {
			return item.type == type;
		});

		if (list.length && list[0] && list[0].url && !sorm) {
			console.log(JSON.stringify(req.session[_this.tool.userSessionName]));
			res.render("./pages/content", {
				host: commonLibUrl,
				type: list[0].type,
				menu: menu,
				projects: req.session[_this.tool.userSessionName].projects
			});
		} else if (list.length && list[0] && list[0].url && sorm) {
			res.render(list[0].url, {
				host: commonLibUrl,
				type: list[0].type,
				menu: menu,
				projects: req.session[_this.tool.userSessionName].projects
			});
		} else {
			res.render('./pages/entry', {
				host: commonLibUrl,
				type: "",
				menu: menu,
				projects: req.session[_this.tool.userSessionName].projects
			});
		}
	};
};

module.exports = new controller();
