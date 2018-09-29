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

            };

            _this[name] = function () {
                var argus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


                if (true) {

                    // 调用假数据方法进行查询
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {

                            resolve(_.isFunction(convert) ? convert(cb(argus)) : cb(argus));
                        }, _.random(1));
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
        //  获取辅助数据
        name: "GetAssistantData",
        url: "GetAssistantData",
        argu: {},
        cb: function (argu) {

            if (0 <= argu.dataType && argu.dataType < 5) {
                return _.range(parseInt((argu.timeTo - argu.timeFrom) / (60 * 60 * 1000 * (argu.timeType ? 1 : 24))))
                    .map(function (item, index) {
                        return {
                            time: + new Date(argu.timeTo) + (index * 60 * 60 * 1000 * (argu.timeType ? 1 : 24)),
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
                            time: + new Date(argu.timeTo) + (index * 60 * 60 * 1000 * (argu.timeType ? 1 : 24)),
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
                            time: + new Date(argu.timeTo) + (index * 60 * 60 * 1000 * (argu.timeType ? 1 : 24)),
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
            console.log(argu);

            return [                //类型：Array  必有字段  备注：无
                {                //类型：Object  必有字段  备注：无
                    "circleData": _.random(5000),                //类型：Number  可有字段  备注：环比能耗值
                    "sameData": _.random(5000)              //类型：Number  可有字段  备注：同比能耗值
                }
            ];
        }
    },
    {
        // 获取表格信息
        name: "queryTable",
        url: "restObjectService/queryObjectByClass",
        argu: {},
        cb: function (argu) {

            var diff = (+new Date(argu.paramList[0].timeTo) - new Date(argu.paramList[0].timeFrom)) / {
                1: (60 * 60 * 1000),
                2: 24 * (60 * 60 * 1000),
                4: 30 * (60 * 60 * 1000),
                5: 365 * (60 * 60 * 1000),
            }[argu.timeType]



            return _.range(argu.paramList.length).map((x, index) => {
                return {
                    "energyItemLocalId": argu.paramList[index].energyItemLocalId,        //类型：String  必有字段  备注：分项本地编码
                    "timeFrom": "mock",                //类型：String  必有字段  备注：开始时间yyyy-MM-dd HH:mm:ss（>=）
                    "timeTo": "mock",                //类型：String  必有字段  备注：结束时间yyyy-MM-dd HH:mm:ss（<）
                    "minData": 100,                //类型：Number  必有字段  备注：最小值
                    "maxData": 9000,                //类型：Number  必有字段  备注：最大值
                    "avgData": 6000,                //类型：Number  必有字段  备注：平均值
                    "midData": 5000,                //类型：Number  必有字段  备注：中位数
                    "sumData": _.random(5000),                //类型：Number  必有字段  备注：求和
                    dataList: _.range(Math.round(diff)).map((item, index) => {

                        if (argu.timeType == 1) {
                            return {
                                time: new Date(argu.paramList[0].timeFrom).setHours(index),
                                data: _.random(5000)
                            }
                        } else if (argu.timeType == 2) {
                            return {
                                time: new Date(argu.paramList[0].timeFrom).setDate(index),
                                data: _.random(5000)
                            }
                        } else if (argu.timeType == 4) {
                            return {
                                time: new Date(argu.paramList[0].timeFrom).setMonth(index),
                                data: _.random(5000)
                            }
                        } else if (argu.timeType == 5) {
                            return {
                                time: new Date(argu.paramList[0].timeFrom).setFullYear(index),
                                data: _.random(5000)
                            }
                        }
                    })
                }
            })
        }
    }
]
)

