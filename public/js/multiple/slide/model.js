// 工具函数集合
var tools = {
    /* id生成器 */
    generatorId: (function () {
        var basic = 'idName';
        var num = 0;
        return function (idName) {
            return idName ? idName : basic + num++;
        }
    })(),
    /* 随机数生成器 */
    generatorRandom: function (start, end, digit) { // 最小值 最大值 保留位数
        var val = Math.random() * (end - start) + start;
        val = digit ? Number(val.toFixed(digit)) : val;
        return val;
    }
}

// Vue实例
var slide = new Vue({
    data: {
        searchConditionObj: { //选择条件集合，包括选择项目，选择时间，选择分项
            projectSaveObj: {}, //项目集合
            timeSaveArr: [], //时间集合
            subentrySaveArr: [], //分项集合
        },
        subentryTree: [], //选择分项树
        downLoadBlockIsShow: false, //是否显示下载图表
        searchConfig: {
            gridOption: 0, // 报表或图表 （0：图表， 1：报表）
            energyConsumption: 0, // 能耗标准 （0：能耗，1：单平米能耗，2：下级能耗）
            types: 0, // 类型 （0：能耗，1：费用，2：碳排放量，3：标煤）
            monthOrDay: 0, // 按月或按日 （0：按月，1：按日）
            buildingType: 0 // 是否区分建筑类型 （0：否，1：是）
        },
        columnConfigData: { // 柱状图配置
            text_title: '这是一个标题',
            series: [{
                name: '功耗',
                data: [{
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.01~2017.02'
                    }, {
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.02~2017.03'
                    }, {
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.02~2017.03'
                    },
                    {
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.02~2017.03'
                    }, {
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.02~2017.03'
                    }, {
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.02~2017.03'
                    },
                    {
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.02~2017.03'
                    }, {
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.02~2017.03'
                    }, {
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.02~2017.03'
                    },
                    {
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.02~2017.03'
                    }, {
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.02~2017.03'
                    }, {
                        y: tools.generatorRandom(0, 100, 1),
                        x: '2016.02~2017.03'
                    },
                ],
                color: '#02A9D1',
                pointWidth: 92,
            }]
        },
        //顶部筛选条件
        // 图标报表
        tableTypes: [{
            name: "图表",
            code: 0,
        }, {
            name: "报表",
            code: 1,
        }],
        // 计量方式
        measurementTypes: [{
                name: "能耗",
                code: 0,
            },
            {
                name: "单平米能耗",
                code: 1,
            },
            {
                name: "下级能耗",
                code: 2,
            },
        ],
        //单位
        unitTypes: [{
                name: "能耗",
                code: 0,
            },
            {
                name: "费用",
                code: 1,
            },
            {
                name: "碳排放量",
                code: 2,
            },
            {
                name: "标煤",
                code: 3,
            },
        ],
        //区分维度
        dimensionalityTypes: [{
                name: "滑动按月",
                code: 0,
            },
            {
                name: "滑动按日",
                code: 1,
            }
        ],

        // 是否显示缩略下拉
        iscombox: false,
        // 已选中类型
        query: {
            table: [], //表格
            measurement: [], //计量
            unit: [], //单位
            dimensionality: [], //区分维度
            sort: [], //排序方式
            calculate: [], //计算
        },
    },
    methods: {
        // 选择图标或者报表
        gridOptionChange: function (id) {
            $("#chartType").psel(false);
            $("#tableType").psel(false);
            $("#" + id).psel(true);
            if (id == 'chartType') {
                this.searchConfig.gridOption = 0;
            } else {
                this.searchConfig.gridOption = 1;
            }
        },
        // 区分建筑类型修改
        buildingTypeChange: function () {
            $("#buildingType").psel() ? (this.searchConfig.buildingType = 1) : (this.searchConfig.buildingType = 0);
        },
        // 文字类型筛选项通用方法
        wordSelect: function (name, value) {
            $("." + name + " li").removeClass('checked');
            $($("." + name + " li")[value]).addClass('checked');
            this.searchConfig[name] = value;
        },
        // 项目信息展开收起事件
        projectsSlideUp: function () {
            var projects = $($(arguments[0].currentTarget).parentsUntil('#mulProjectMessage')[1]).find('.projects');
            if (projects.css('height') === '0px') {
                // debugger
                projects.css('height', 'auto');
                var height = projects.css('height');
                projects.css('height', '0px');
                setTimeout(function () {
                    projects.css('height', height);
                }, 0);
                $($(arguments[0].currentTarget)).css('transform', 'rotate(90deg)');
            } else {
                projects.css('height', '0px');
                $($(arguments[0].currentTarget)).css('transform', 'rotate(0deg)');
            }
        }
    },
    mounted: function () {
        var that = this;
        that.subentryTree = [{
            obj_id: "xxxx",
            obj_name: "建筑总能耗",
            child: [{
                obj_id: "xxxx1",
                obj_name: "动力用电",
                child: [{
                    obj_id: "xxxx11",
                    obj_name: "电梯",
                    child: [{
                        obj_id: "xxx111",
                        obj_name: "自动扶梯",
                    }]
                }]
            }, {
                obj_id: "xxxx2",
                obj_name: "动力用电2",
                child: [{
                    obj_id: "xxxx22",
                    obj_name: "电梯22",
                    child: [{
                        obj_id: "xxx222",
                        obj_name: "自动扶梯222",
                    }]
                }]
            }, ]
        }];

    }

})

// Dom加载完成后挂载Vue
$(function () {
    slide.$mount('#singleSlidePage');
})



var gridArr = [{
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.02',
    energyConsumption: '18'
}, {
    time: '2016.01~2017.020',
    energyConsumption: '18'
}];