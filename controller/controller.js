/*路由控制的实现*/
function controller() {
	this.tool = require('common/tool');
	this.realRestClient = require('common/executeRequest');
	this.responseTool = require('common/responseTool');
	this.menu = require("../menu.js");
}

controller.prototype.entry = function (req, res, next) {
	var _this = this;
	return function (req, res, next) {

		var type = req.query.type || "";
		var sorm = req.query.sorm || "";



		var list = _this.menu.multiple.contents.concat(_this.menu.single.contents).filter(function (item) {
			return item.type == type;
		});

		var user = req.session[_this.tool.userSessionName] || {};
		if (list.length && list[0] && list[0].url && !sorm) {

			res.render("./pages/content", {
				host: commonLibUrl,
				type: list[0].type,
				menu: _this.menu,
				projects: user.projects
			});
		} else if (list.length && list[0] && list[0].url && sorm) {
			res.render(list[0].url, {
				host: commonLibUrl,
				type: list[0].type,
				menu: _this.menu,
				projects: user.projects
			});
		} else {
			res.render('./pages/entry', {
				host: commonLibUrl,
				type: "",
				menu: _this.menu,
				projects: user.projects,
				user: user
			});
		}
	};
};

controller.prototype.renderPage = function (req, res, next) {
	var _this = this;
	return function (req, res, next) {
		var pageId = req.params.pageid;
		var user = req.session[_this.tool.userSessionName] || {};
		var energyStoreArr = _this.menu.single.contents.concat(_this.menu.multiple.contents);
		if (pageId.indexOf('m_') == 0) {
			if (!(user.authorObj || {}).bimanager) _this.responseTool.sendDecline(res, '无权访问');
			else res.render('pages/manage/' + pageId + '.html', {
				host: commonLibUrl,
				manageMenu: _this.menu.manageMenuType || [],
				energyStoreArr: energyStoreArr
			});
			return;
		}
		_this.responseTool.sendDecline(res, '无效的请求');
	};
};

module.exports = new controller();
