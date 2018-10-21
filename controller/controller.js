/*路由控制的实现*/
function controller() {
	this.tool = require('common/tool');
	this.responseTool = require('common/responseTool');
	this.menu = require("../menu.js");
	this.path = require('path');
	this.fs = require('fs');
	this.reportOper = require('./reportOperate');
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
		var energyStoreArr = _this.menu.multiple.contents;
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

controller.prototype.downloadReport = function () {
	var _this = this;
	return function (req, res, next) {
		try {
			// var imageFirstName = _this.path.resolve(__dirname, '../', 'public/') + "/";
			// var htmlStr = req.body.html.replace(/\.\//g, imageFirstName);
			var downLoadType = req.body.downLoadType;
			var reportName = req.body.reportName;
			switch (downLoadType) {
				case 'excel':
					var data = JSON.parse(req.body.data || '[]');
					var rangeArr = JSON.parse(req.body.range || '[]');
					_this.reportOper.createExcel({
						res: res, reportName: reportName, data: data, rangeArr: rangeArr
					});
					break;
				default:
					var htmlStr = req.body.html;
					if (downLoadType == 'image') {
						htmlStr = htmlStr.replace(/formMenu/g, 'formMenu reportHide').replace(/downButton/g, 'downButton reportHide');
					}
					else {
						htmlStr = htmlStr.replace(/__left/g, '__left reportHide').replace(/__right/g, '__right reportHide');
					}
					var links = req.body.links;
					var fullHtmlStr = "<html><head><meta http-equiv='content-type' content='text/html;charset=utf-8'>" + links + "<style type='text/css'>.highcharts-tracker path { display: none !important;}</style></head><body>" + htmlStr + "</body></html>";

					_this.reportOper.createReport({
						res: res,
						reportName: reportName,
						downLoadType: downLoadType,
						htmlStr: fullHtmlStr
					});
					break;
			}
		} catch (e) {
			console.error('downloadReport err:' + e.message);
			return _this.responseTool.sendServerException(res);
		}
	};
};

module.exports = new controller();
