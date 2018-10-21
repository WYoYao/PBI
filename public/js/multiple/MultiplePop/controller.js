;
(function () {
    var cList = {
        link: [ {
            name: "GetProjectBubbleCompare", //获取图表表格数据
            url: "GetProjectBubbleCompare",
            isNotJava: false,
            data: function () {
                return [
                    {                //类型：Object  必有字段  备注：无
                        "avgAreaData":50,                //类型：Number  必有字段  备注：单平米平均值
                        "avgArea":50,                //类型：Number  必有字段  备注：面积平均值
                        "dataList":[                //类型：Array  必有字段  备注：无
                            {                //类型：Object  必有字段  备注：无
                                "projectLocalId":"aaa",                //类型：String  必有字段  备注：项目本地编码
                                "data":123.5,                //类型：Number  必有字段  备注：能耗数据
                                "area":125,                //类型：Number  必有字段  备注：项目面积
                                "areaData":1.25,                //类型：Number  必有字段  备注：单平米能耗
                                "funcTypeCode":"1",                //类型：String  必有字段  备注：项目功能类型编码
                                "climateCode":"1",                //类型：String  必有字段  备注：气候区编码
                                "manageZone":"1"                //类型：String  必有字段  备注：管理分区id
                            },
                            {                //类型：Object  必有字段  备注：无
                                "projectLocalId":"bbb",                //类型：String  必有字段  备注：项目本地编码
                                "data":10,                //类型：Number  必有字段  备注：能耗数据
                                "area":10,                //类型：Number  必有字段  备注：项目面积
                                "areaData":5,                //类型：Number  必有字段  备注：单平米能耗
                                "funcTypeCode":"2",                //类型：String  必有字段  备注：项目功能类型编码
                                "climateCode":"1",                //类型：String  必有字段  备注：气候区编码
                                "manageZone":"2"                //类型：String  必有字段  备注：管理分区id
                            },
                            {                //类型：Object  必有字段  备注：无
                                "projectLocalId":"ccc",                //类型：String  必有字段  备注：项目本地编码
                                "data":50,                //类型：Number  必有字段  备注：能耗数据
                                "area":50,                //类型：Number  必有字段  备注：项目面积
                                "areaData":20,                //类型：Number  必有字段  备注：单平米能耗
                                "funcTypeCode":"3",                //类型：String  必有字段  备注：项目功能类型编码
                                "climateCode":"2",                //类型：String  必有字段  备注：气候区编码
                                "manageZone":"1"                //类型：String  必有字段  备注：管理分区id
                            },
                            {                //类型：Object  必有字段  备注：无
                                "projectLocalId":"bbb",                //类型：String  必有字段  备注：项目本地编码
                                "data":10,                //类型：Number  必有字段  备注：能耗数据
                                "area":10,                //类型：Number  必有字段  备注：项目面积
                                "areaData":5,                //类型：Number  必有字段  备注：单平米能耗
                                "funcTypeCode":"4",                //类型：String  必有字段  备注：项目功能类型编码
                                "climateCode":"4",                //类型：String  必有字段  备注：气候区编码
                                "manageZone":"4"                //类型：String  必有字段  备注：管理分区id
                            },
                            {                //类型：Object  必有字段  备注：无
                                "projectLocalId":"ccc",                //类型：String  必有字段  备注：项目本地编码
                                "data":50,                //类型：Number  必有字段  备注：能耗数据
                                "area":50,                //类型：Number  必有字段  备注：项目面积
                                "areaData":20,                //类型：Number  必有字段  备注：单平米能耗
                                "funcTypeCode":"5",                //类型：String  必有字段  备注：项目功能类型编码
                                "climateCode":"5",                //类型：String  必有字段  备注：气候区编码
                                "manageZone":"5"                //类型：String  必有字段  备注：管理分区id
                            }
                        ]
                    }
                ]
            },
        },{
            name: "GetEnergyModelTreeOfStory", //打开故事版时获取分项树（分项树同能耗模型树）
            url: "GetEnergyModelTreeOfStory",
            isNotJava: false,
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
    window.multPopController = cteatePromise(cList);
})()