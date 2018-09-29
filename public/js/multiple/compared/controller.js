;
(function () {
    var cList = {
        link: [{
            name: "GetAllEnergyModelOfProject", //获取项目列表
            url: "GetAllEnergyModelOfProject",
            isNotJava: true,
            data: function () {

            },
        }, {
            name: "ItemEnergyByTime", //获取图表表格数据
            url: "ItemEnergyByTime",
            isNotJava: true,
            data: function () {
                return [{
                    energyItemLocalId: "em1111",
                    timeFrom: "2018-09-10 00:00:00",
                    timeTo: "2018-09-10 23:59:59",
                    dataList: [{
                            time: "00:00",
                            data: "150"
                        },
                        {
                            time: "02:00",
                            data: "120"
                        }, {
                            time: "04:00",
                            data: "220"
                        }, {
                            time: "06:00",
                            data: "210"
                        }, {
                            time: "08:00",
                            data: "150"
                        }, {
                            time: "10:00",
                            data: "300"
                        }, {
                            time: "12:00",
                            data: "222"
                        }, {
                            time: "14:00",
                            data: "100"
                        }, {
                            time: "16:00",
                            data: "169"
                        }, {
                            time: "18:00",
                            data: "120"
                        }, {
                            time: "20:00",
                            data: "200"
                        }, {
                            time: "22:00",
                            data: "120"
                        }
                    ]
                }, {
                    energyItemLocalId: "em222",
                    timeFrom: "2018-09-10 00:00:00",
                    timeTo: "2018-09-11 23:59:59",
                    dataList: [{
                            time: "00:00",
                            data: "250"
                        },
                        {
                            time: "02:00",
                            data: "320"
                        }, {
                            time: "04:00",
                            data: "220"
                        }, {
                            time: "06:00",
                            data: "310"
                        }, {
                            time: "08:00",
                            data: "250"
                        }, {
                            time: "10:00",
                            data: "200"
                        }, {
                            time: "12:00",
                            data: "222"
                        }, {
                            time: "14:00",
                            data: "200"
                        }, {
                            time: "16:00",
                            data: "269"
                        }, {
                            time: "18:00",
                            data: "220"
                        }, {
                            time: "20:00",
                            data: "210"
                        }, {
                            time: "22:00",
                            data: "320"
                        }
                    ]
                }]
            },
        }, {
            name: "GetEnergyModelTreeOfBuilding", //获取分项树
            url: "GetEnergyModelTreeOfBuilding",
            isNotJava: true,
            data: function () {
                return [{
                        name: "aaa",
                        id: "123456",
                        localId: "123456",
                        parentLocalId: "-1",
                        area: 123
                    },
                    {
                        name: "bbb",
                        id: "a123456",
                        localId: "a123456",
                        parentLocalId: "123456",
                        area: 123
                    },
                ];
            }
        }, {
            name: "listAccountProjects", //获取多项目列表
            url: "listAccountProjects",
            isNotJava: true,
            data: function () {
                return [{ //类型：Object  必有字段  备注：无
                    "totalNum": 6, //类型：Number  必有字段  备注：总项目数量
                    "projectList": [ //类型：Array  必有字段  备注：无
                        { //类型：Object  必有字段  备注：无
                            "funtionType": "aaaaa", //类型：String  必有字段  备注：项目功能类型编码
                            "projects": [ //类型：Array  必有字段  备注：项目列表
                                { //类型：Object  必有字段  备注：无
                                    "projectId": "ap1", //类型：String  必有字段  备注：项目id
                                    "projectLocalID": "ap1", //类型：String  必有字段  备注：项目本地编码
                                    "projectLocalName": "项目ap1", //类型：String  必有字段  备注：项目本地名称
                                    "funtionType": "f1", //类型：String  必有字段  备注：项目功能类型编码，都转为一级
                                    "manageZone": "m1", //类型：String  必有字段  备注：管理分区编码
                                    "climateZone": "w1" //类型：String  必有字段  备注：气候区编码
                                },
                                { //类型：Object  必有字段  备注：无
                                    "projectId": "ap2", //类型：String  必有字段  备注：项目id
                                    "projectLocalID": "ap2", //类型：String  必有字段  备注：项目本地编码
                                    "projectLocalName": "项目ap2", //类型：String  必有字段  备注：项目本地名称
                                    "funtionType": "f2", //类型：String  必有字段  备注：项目功能类型编码，都转为一级
                                    "manageZone": "m2", //类型：String  必有字段  备注：管理分区编码
                                    "climateZone": "w2" //类型：String  必有字段  备注：气候区编码
                                },
                                { //类型：Object  必有字段  备注：无
                                    "projectId": "ap3", //类型：String  必有字段  备注：项目id
                                    "projectLocalID": "ap3", //类型：String  必有字段  备注：项目本地编码
                                    "projectLocalName": "项目ap3", //类型：String  必有字段  备注：项目本地名称
                                    "funtionType": "f1", //类型：String  必有字段  备注：项目功能类型编码，都转为一级
                                    "manageZone": "m1", //类型：String  必有字段  备注：管理分区编码
                                    "climateZone": "w1" //类型：String  必有字段  备注：气候区编码
                                }
                            ]
                        }, { //类型：Object  必有字段  备注：无
                            "funtionType": "bbbb", //类型：String  必有字段  备注：项目功能类型编码
                            "projects": [ //类型：Array  必有字段  备注：项目列表
                                { //类型：Object  必有字段  备注：无
                                    "projectId": "bp2", //类型：String  必有字段  备注：项目id
                                    "projectLocalID": "bp2", //类型：String  必有字段  备注：项目本地编码
                                    "projectLocalName": "项目bp2", //类型：String  必有字段  备注：项目本地名称
                                    "funtionType": "f2", //类型：String  必有字段  备注：项目功能类型编码，都转为一级
                                    "manageZone": "m2", //类型：String  必有字段  备注：管理分区编码
                                    "climateZone": "w2" //类型：String  必有字段  备注：气候区编码
                                }
                            ]
                        }
                    ]
                }]
            }
        }, {
            name: "listManagementPartitionsService", //获取管理分区树
            url: "listManagementPartitionsService", //
            isNotJava: true,
            data: function () {
                return [{ //类型：Object  必有字段  备注：元素
                    "managePartitionId": "aaa", //类型：String  必有字段  备注：管理分区id
                    "managePartitionName": "分区a", //类型：String  必有字段  备注：管理分区名称
                    "managePartitionParentId": "", //类型：String  可有字段  备注：管理分区父节点
                    "managePartitionChildren": [ //类型：Array  可有字段  备注：管理分区子节点数组
                        { //类型：Object  必有字段  备注：无
                            "managePartitionId": "a111", //类型：String  必有字段  备注：管理分区id
                            "managePartitionName": "分区a1", //类型：String  必有字段  备注：管理分区名称
                            "managePartitionParentId": "aaa", //类型：String  必有字段  备注：管理分区父节点
                            "managePartitionChildren": [ //类型：Array  必有字段  备注：无

                            ]
                        }, { //类型：Object  必有字段  备注：无
                            "managePartitionId": "a222", //类型：String  必有字段  备注：管理分区id
                            "managePartitionName": "分区a2", //类型：String  必有字段  备注：管理分区名称
                            "managePartitionParentId": "aaa", //类型：String  必有字段  备注：管理分区父节点
                            "managePartitionChildren": [ //类型：Array  必有字段  备注：无

                            ]
                        }
                    ]
                }]
            },
        }, {
            name: "listClimateZoneService", //获取气候区树  只使用一级
            url: "listClimateZoneService", //
            isNotJava: true,
            data: function () {
                return [{ //类型：Object  必有字段  备注：无
                        "code": "aaaa", //类型：String  必有字段  备注：编码
                        "name": "分区aaa", //类型：String  必有字段  备注：名称
                        "contents": [ //类型：Array  可有字段  备注：子节点
                            { //类型：Object  必有字段  备注：无
                                "code": "mock", //类型：String  必有字段  备注：编码
                                "name": "mock", //类型：String  必有字段  备注：名称

                            }
                        ]
                    },
                    { //类型：Object  必有字段  备注：无
                        "code": "bbbb", //类型：String  必有字段  备注：编码
                        "name": "分区bbb", //类型：String  必有字段  备注：名称
                        "contents": [ //类型：Array  可有字段  备注：子节点
                            { //类型：Object  必有字段  备注：无
                                "code": "mock", //类型：String  必有字段  备注：编码
                                "name": "mock", //类型：String  必有字段  备注：名称

                            }
                        ]
                    }
                ]
            },
        }, {
            name: "listFunctionTypesService", //获取项目类型树  只使用一级
            url: "listFunctionTypesService", //
            isNotJava: true,
            data: function () {
                return [{ //类型：Object  必有字段  备注：无
                        "code": "p1", //类型：String  必有字段  备注：编码
                        "name": "项目类型1", //类型：String  必有字段  备注：名称
                        "contents": [ //类型：Array  可有字段  备注：子节点
                            { //类型：Object  必有字段  备注：无
                                "code": "pa1", //类型：String  必有字段  备注：编码
                                "name": "项目类型a1", //类型：String  必有字段  备注：名称
                            }
                        ]
                    },
                    { //类型：Object  必有字段  备注：无
                        "code": "p2", //类型：String  必有字段  备注：编码
                        "name": "项目类型2", //类型：String  必有字段  备注：名称
                        "contents": [ //类型：Array  可有字段  备注：子节点
                            { //类型：Object  必有字段  备注：无
                                "code": "pb1", //类型：String  必有字段  备注：编码
                                "name": "项目类型b1", //类型：String  必有字段  备注：名称
                            }
                        ]
                    }
                ]
            },
        }, {
            name: "GetEnergyModelTreeOfStory", //打开故事版时获取分项树（分项树同能耗模型树）
            url: "GetEnergyModelTreeOfStory",
            isNotJava: true,
            data: function () {
                return [{ //类型：Object  必有字段  备注：无
                    "energyModelCode": "e111", //类型：String  必有字段  备注：能耗模型编码
                    "energyModelTree": [ //类型：Array  必有字段  备注：能好模型树
                        { //类型：Object  必有字段  备注：无
                            "localId": "123456", //类型：String  必有字段  备注：分项本地编码
                            "parentLocalId": "-1", //类型：String  必有字段  备注：父级分项本地编码
                            "name": "aaa", //类型：String  必有字段  备注：分项名称
                            "propertyCode": "123456" //类型：String  必有字段  备注：分项属性编码
                        }, {
                            "localId": "a123456", //类型：String  必有字段  备注：分项本地编码
                            "parentLocalId": "123456", //类型：String  必有字段  备注：父级分项本地编码
                            "name": "bbb", //类型：String  必有字段  备注：分项名称
                            "propertyCode": "a123456" //类型：String  必有字段  备注：分项属性编码
                        }
                    ]
                }]
            }
        }, {
            name: "ListBranchesForEI", //获取项目下的支路信息
            url: "ListBranchesForEI",
            isNotJava: true,
            data: function () {
                return [{ //类型：Object  必有字段  备注：无
                    "projectLocalId": "aaa", //类型：String  必有字段  备注：项目本地编码
                    "energyItemList": [ //类型：Array  必有字段  备注：分项信息集合
                        { //类型：Object  必有字段  备注：无
                            "energyItemLocalId": "zla", //类型：String  必有字段  备注：分项本地编码
                            "branchList": [ //类型：Array  必有字段  备注：无
                                { //类型：Object  必有字段  备注：无
                                    "branchLocalId": "zla1", //类型：String  必有字段  备注：支路本地编码
                                    "branchLocalName": "支路a1" //类型：String  必有字段  备注：支路本地名称
                                },{ //类型：Object  必有字段  备注：无
                                    "branchLocalId": "zla2", //类型：String  必有字段  备注：支路本地编码
                                    "branchLocalName": "支路a2" //类型：String  必有字段  备注：支路本地名称
                                }
                            ]
                        }, { //类型：Object  必有字段  备注：无
                            "energyItemLocalId": "zlb", //类型：String  必有字段  备注：分项本地编码
                            "branchList": [ //类型：Array  必有字段  备注：无
                                { //类型：Object  必有字段  备注：无
                                    "branchLocalId": "zlb1", //类型：String  必有字段  备注：支路本地编码
                                    "branchLocalName": "支路b1" //类型：String  必有字段  备注：支路本地名称
                                }
                            ]
                        }
                    ]
                }]
            }
        }]
    }
    var cteatePromise = function (arr) {
        return arr.link.reduce(function (obj, link) {
            if (obj[link.name]) {
                console.error(link.name + "链接已存在，请修改传入参数");
                return
            }
            obj[link.name] = function (argu) {
                if (link.isNotJava) {
                    return new Promise(function (resolve, reject) {
                        var data = link.data();
                        resolve(data);
                    })
                } else {
                    return new Promise(function (resolve, reject) {
                        var data = {
                            url: link.url,
                            data: Object.assign({}, link.argu, argu, arr.argu),
                            success: resolve,
                            error: function (err) {
                                $("#globalnotice").pshow({
                                    text: "获取数据失败",
                                    state: "failure"
                                })
                                reject();
                            },
                            configServiceName: link.severName,
                        };
                        link.severName ? data.configServiceName = link.severName : void 0;
                        pajax.post(data);
                    })
                }

            }
            return obj
        }, {})
    };
    window.multCompareController = cteatePromise(cList);
})()