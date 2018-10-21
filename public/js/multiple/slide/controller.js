"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * 创建Controller 的请求类可以添加
 */
var Controller = function () {
    function Controller(arr, user) {
        _classCallCheck(this, Controller);

        // 保存每次提交的时候需要的参数
        this.user = _.isPlainObject(user) ? user : {};

        return this.push.call(this, arr);
    }

    Controller.prototype.push = function push(arr) {
        var _this = this;

        if (!_.isArray(arr)) throw new TypeError('Arugments must be an Array');

        var _loop = function _loop() {
            if (_isArray) {
                if (_i >= _iterator.length) return "break";
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) return "break";
                _ref = _i.value;
            }

            var _ref2 = _ref,
                name = _ref2.name,
                url = _ref2.url,
                argu = _ref2.argu,
                cb = _ref2.cb,
                convert = _ref2.convert,
                configServiceName = _ref2.configServiceName;


            if (_.has(_this, name)) {

            };

            _this[name] = function () {
                var argus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                if (false) {

                    // 调用假数据方法进行查询
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {

                            resolve(_.isFunction(convert) ? convert(cb(argus)) : cb(argus));
                        }, _.random(1));
                    });
                } else {

                    // 真实发请求
                    return new Promise(function (resolve, rejcet) {
                        if (name == "GetMultiItemSlidingEnergyByTime") $("#globalloading").pshow()
                        pajax.post({
                            url: url,
                            data: Object.assign({}, argu, argus, _this.user),
                            configServiceName: configServiceName,
                            success: function success(res) {
                                res = _.has(res, "data") ? res.data : res;
                                resolve(_.isFunction(convert) ? convert(res) : res);
                            },
                            error: rejcet,
                            complete: function () {
                                $("#globalloading").phide()
                            }
                        });
                    });
                }
            };
        };

        for (var _iterator = arr, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
            var _ref;

            var _ret = _loop();

            if (_ret === "break") break;
        }
        return this;
    };

    return Controller;
}();

var controller = new Controller([], {});


controller.push([{
    // 获取分项树
    name: "querySubOption",
    url: "GetEnergyModelTreeOfStory",
    argu: {},
    cb: function () {

    }
},
{
    //  获取辅助数据
    name: "GetAssistantData",
    url: "GetAssistantData",
    argu: {},
    cb: function (argu) {

        if (0 <= argu.dataType && argu.dataType < 5) {
            return _.range(parseInt((argu.timeTo - argu.timeFrom) / (60 * 60 * 1000 * (argu.timeType ? 1 : 24))))
                .map(function (item, index) {
                    return {
                        time: +new Date(argu.timeTo) + (index * 60 * 60 * 1000 * (argu.timeType ? 1 : 24)),
                        data: _.random(1, 5000)
                    }
                }).map(function (item) {
                    item.time = new Date(item.time).format('yyyy-MM-dd hh:mm:ss');
                    return item;
                })
        } else if (argu.dataType == 5) {
            return _.range(parseInt((argu.timeTo - argu.timeFrom) / (60 * 60 * 1000 * (argu.timeType ? 1 : 24))))
                .map(function () {
                    return {
                        time: +new Date(argu.timeTo) + (index * 60 * 60 * 1000 * (argu.timeType ? 1 : 24)),
                        data: _.random(1, 9)
                    }
                }).map(function (item) {
                    item.time = new Date(item.time).format('yyyy-MM-dd hh:mm:ss');
                    return item;
                })
        } else if (argu.dataType == 6) {
            return _.range(2)
                .map(function () {
                    return {
                        time: +new Date(argu.timeTo) + (index * 60 * 60 * 1000 * (argu.timeType ? 1 : 24)),
                        data: _.random(0, 1)
                    }
                }).map(function (item) {
                    item.time = new Date(item.time).format('yyyy-MM-dd hh:mm:ss');
                    return item;
                })
        }

    }
},
{
    name: "ItemEnergyCompare",
    url: "ItemEnergyCompare",
    argu: {},
    cb: function (argu) {

        return [ //类型：Array  必有字段  备注：无
            { //类型：Object  必有字段  备注：无
                "circleData": _.random(5000), //类型：Number  可有字段  备注：环比能耗值
                "sameData": _.random(5000) //类型：Number  可有字段  备注：同比能耗值
            }
        ];
    }
},
// 查询管理分区列表
{
    name: "ListAccountProjects",
    url: "ListAccountProjects",
    configServiceName: "jsonStringServerUrl",
},
// 获取气候区信息
{
    name: "listClimateZoneService",
    url: "listClimateZoneService",
    configServiceName: "jsonStringServerUrl",
},
// 查询管理分区列表
{
    name: "listFunctionTypesService",
    url: "listFunctionTypesService",
    configServiceName: "jsonStringServerUrl",
},
{
    // 获取表格信息
    name: "GetMultiItemSlidingEnergyByTime",
    url: "GetMultiItemSlidingEnergyByTime",
    argu: {},
    cb: function (argu) {

    },
    convert: function (res) {
        return res.map(function (item) {

            // 不区分项目类型
            if (_.has(item, 'dataList')) {
                item.dataList = item.dataList.map(function (info) {
                    info.time = +new Date(info.time.replace(/\-/g, '/'));
                    return info;
                })
            }

            // 区分项目类型
            // 不区分项目类型
            if (_.has(item, 'funcTypeDataList')) {
                item.funcTypeDataList = item.funcTypeDataList.map(function (x) {

                    x.dataList = x.dataList.map(function (info) {
                        info.time = +new Date(info.time.replace(/\-/g, '/'));
                        return info;
                    });

                    return x;
                })
            }

            return item;
        })
    }
}
])