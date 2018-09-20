"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
                console.log(name + "\u4E0E\u73B0\u6709\u7684\u5C5E\u6027\u91CD\u590D,\u5DF2\u5408\u5E76\u3002");
            };

            _this[name] = function () {
                var argus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


                if (true) {

                    // 调用假数据方法进行查询
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {

                            resolve(_.isFunction(convert) ? convert(cb(argus)) : cb(argus));
                        }, _.random(1000));
                    });
                } else {

                    // 真实发请求
                    return new Promise(function (resolve, rejcet) {
                        pajax.post({
                            url: url,
                            data: Object.assign({}, argu, argus, _this.user),
                            configServiceName: configServiceName,
                            success: function success(res) {
                                res = _.has(res, "data") ? res.data : res;
                                resolve(_.isFunction(convert) ? convert(res) : res);
                            },
                            error: rejcet
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

var singleController = new Controller([], {});


singleController.push([
    {
        // 获取模型
        name: "queryModel",
        url: "GetAllEnergyModelOfProject",
        argu: {},
        cb: function () {
            return _.range(20).map((item, index) => ({                //类型：Object  必有字段  备注：无
                "buildingLocalName": index == 0 ? '主建筑' : `建筑${index}`,                //类型：String  必有字段  备注：无
                "buildingLocalId": `buildingLocalId${index}`,                //类型：String  必有字段  备注：无
                "buildingId": `buildingId${index}`,                //类型：String  必有字段  备注：无
                "isMain": index == 0,                //类型：Boolean  必有字段  备注：无
                "energyModelList": _.range(20).map((info, i) => ({                //类型：Object  必有字段  备注：无
                    "energyModelName": (index == 0 ? '主建筑' : `建筑${index}`) + `模型名称${i}`,                //类型：String  必有字段  备注：无
                    "energyModelId": `buildingLocalId${index}energyModelId${i}`                //类型：String  必有字段  备注：无
                }))
            }))
        },
        convert: function (res) {
            return res.map(function (item) {

                item.energyModelList = item.energyModelList.map(function (info) {
                    return Object.assign({}, {
                        buildingLocalId: item.buildingLocalId,
                    }, info);
                });
                return item;
            })
        }
    },
    {
        // 获取分项树
        name: "querySubOption",
        url: "GetEnergyModelTreeOfBuilding",
        argu: {},
        cb: function () {

            var id = 1;

            var fn = function (con, item) {

                con.push(item);

                if (_.isArray(item.content)) {
                    item.content.reduce(fn, con);
                }

                delete item.content;

                return con;
            };

            var res = [{                //类型：Object  必有字段  备注：无
                "name": "分项名称",                //类型：String  必有字段  备注：分项名称
                "id": `id${id}`,                 //类型：String  必有字段  备注：无
                "localId": `localId${id}`,                //类型：String  必有字段  备注：本地编码
                "parentLocalId": false,                //类型：Boolean  必有字段  备注：父级节点本地编码，若为根节点，则此值为-1
                "area": 125,                //类型：Number  必有字段  备注：面积
                content: _.range(5).map((item, index) => {

                    return ((id, index) => {
                        var parent = id;
                        id += index.toString();

                        return {
                            "name": `分项名称${id}`,                //类型：String  必有字段  备注：分项名称
                            "id": `id${id}`,                 //类型：String  必有字段  备注：无
                            "localId": `localId${id}`,                 //类型：String  必有字段  备注：本地编码
                            "parentLocalId": `localId${parent}`,                //类型：Boolean  必有字段  备注：父级节点本地编码，若为根节点，则此值为-1
                            "area": 125,                //类型：Number  必有字段  备注：面积
                            content: _.range(5).map((item, index) => {

                                return ((id, index) => {
                                    var parent = id;
                                    id += index.toString();

                                    return {
                                        "name": `分项名称${id}`,                //类型：String  必有字段  备注：分项名称
                                        "id": `id${id}`,                 //类型：String  必有字段  备注：无
                                        "localId": `localId${id}`,                 //类型：String  必有字段  备注：本地编码
                                        "parentLocalId": `localId${parent}`,                //类型：Boolean  必有字段  备注：父级节点本地编码，若为根节点，则此值为-1
                                        "area": 125,                //类型：Number  必有字段  备注：面积
                                        content: _.range(5).map((item, index) => {

                                            return ((id, index) => {
                                                var parent = id;
                                                id += index.toString();

                                                return {
                                                    "name": `分项名称${id}`,                //类型：String  必有字段  备注：分项名称
                                                    "id": `id${id}`,                 //类型：String  必有字段  备注：无
                                                    "localId": `localId${id}`,                 //类型：String  必有字段  备注：本地编码
                                                    "parentLocalId": `localId${parent}`,                //类型：Boolean  必有字段  备注：父级节点本地编码，若为根节点，则此值为-1
                                                    "area": 125,                //类型：Number  必有字段  备注：面积
                                                    content: _.range(5).map((item, index) => {

                                                        return ((id, index) => {
                                                            var parent = id;
                                                            id += index.toString();

                                                            return {
                                                                "name": `分项名称${id}`,                //类型：String  必有字段  备注：分项名称
                                                                "id": `id${id}`,                 //类型：String  必有字段  备注：无
                                                                "localId": `localId${id}`,                 //类型：String  必有字段  备注：本地编码
                                                                "parentLocalId": `localId${parent}`,                //类型：Boolean  必有字段  备注：父级节点本地编码，若为根节点，则此值为-1
                                                                "area": 125,                //类型：Number  必有字段  备注：面积
                                                            };
                                                        })(id, index)

                                                    })
                                                };
                                            })(id, index)

                                        })
                                    };
                                })(id, index)
                            })
                        };
                    })(id, index)
                })
            }].reduce(fn, []);

            return res;
        }
    },
    {
        // 获取表格信息
        name: "queryTable",
        url: "restObjectService/queryObjectByClass",
        argu: {},
        cb: function () {
            return _.range(240).map((item, index) => {
                return {
                    x: new Date("2018-08-28 00:00:00").setHours(index),
                    y: _.random(10000)
                }
            })
        }
    }
]
)

