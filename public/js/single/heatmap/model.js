$(function () {

    window.fail = function (text) {
        $(window.top.document.querySelector("#globalnotice")).pshow({ text: text, state: "failure" });
    }

    var MAX = 10000;
    var MIN = 0;

    //cansvas画布清空方法
    function canvasclearRect(canvas) {

        var context = canvas.getContext("2d");
        context.clearRect(0, 0, 120, 120);
        context.beginPath();
    }
    var app = new Vue({
        el: "#app",
        data: {
            // 图标报表
            tableTypes: [{
                name: "图表",
                code: 0,
                lock: true,
                selected: true,
            }, {
                name: "报表",
                code: 1,
            }],
            // 面积单位
            areaTypres: [{
                name: "总量",
                code: 0,
                selected: true
            },
            {
                name: "单平米",
                code: 1,
            }
            ],
            // 能源类型
            energyTypes: [{
                name: "能耗",
                code: 0,
                selected: true
            },
            {
                name: "费用",
                code: 1,
            },
            {
                name: "碳排放量标煤",
                code: 2,
            },
            ],
            // 是否显示缩略下拉
            iscombox: false,
            // 已选中类型
            query: {
                tables: [{
                    name: "图表",
                    code: 0,
                    selected: true,
                }],
                areas: [{
                    name: "总量",
                    code: 0,
                }],
                energy: [{
                    name: "能耗",
                    code: 0,
                }],
            },
            // 分项模型
            energyModelList: [],
            // 对应的建筑
            energyProject: false,
            //  能耗模型
            energyModel: false,
            //  是否展示的能耗模型树
            showEnergyModel: false,
            // 对应的分项集合
            suboptionModel: [],
            // 时间控件中的时间
            timer: [],
            // 查询热图返回的数据
            // res: [],
            res:[{"energyItemLocalId":"localId1","timeFrom":"2018-01-01 00:00:00","timeTo":"2018-12-31 23:59:59","minData":100,"maxData":9000,"avgData":6000,"midData":5000,"sumData":2714,"dataList":[{"time":1514649600000,"data":3369},{"time":1514736000000,"data":2250},{"time":1514822400000,"data":4709},{"time":1514908800000,"data":1298},{"time":1514995200000,"data":3490},{"time":1515081600000,"data":1146},{"time":1515168000000,"data":4580},{"time":1515254400000,"data":2118},{"time":1515340800000,"data":580},{"time":1515427200000,"data":1007},{"time":1515513600000,"data":1796},{"time":1515600000000,"data":2494},{"time":1515686400000,"data":1154},{"time":1515772800000,"data":4995},{"time":1515859200000,"data":7},{"time":1515945600000,"data":3269},{"time":1516032000000,"data":1891},{"time":1516118400000,"data":4704},{"time":1516204800000,"data":1494},{"time":1516291200000,"data":1566},{"time":1516377600000,"data":721},{"time":1516464000000,"data":2159},{"time":1516550400000,"data":3742},{"time":1516636800000,"data":3916},{"time":1516723200000,"data":2839},{"time":1516809600000,"data":308},{"time":1516896000000,"data":4010},{"time":1516982400000,"data":4692},{"time":1517068800000,"data":2795},{"time":1517155200000,"data":75},{"time":1517241600000,"data":4193},{"time":1517328000000,"data":3343},{"time":1517414400000,"data":416},{"time":1517500800000,"data":3389},{"time":1517587200000,"data":2878},{"time":1517673600000,"data":1015},{"time":1517760000000,"data":4117},{"time":1517846400000,"data":4840},{"time":1517932800000,"data":4098},{"time":1518019200000,"data":1816},{"time":1518105600000,"data":3146},{"time":1518192000000,"data":2519},{"time":1518278400000,"data":3514},{"time":1518364800000,"data":4678},{"time":1518451200000,"data":4317},{"time":1518537600000,"data":4414},{"time":1518624000000,"data":4956},{"time":1518710400000,"data":3130},{"time":1518796800000,"data":2403},{"time":1518883200000,"data":1641},{"time":1518969600000,"data":2637},{"time":1519056000000,"data":2811},{"time":1519142400000,"data":427},{"time":1519228800000,"data":3090},{"time":1519315200000,"data":1531},{"time":1519401600000,"data":1237},{"time":1519488000000,"data":257},{"time":1519574400000,"data":4631},{"time":1519660800000,"data":11},{"time":1519747200000,"data":4508},{"time":1519833600000,"data":1408},{"time":1519920000000,"data":143},{"time":1520006400000,"data":3480},{"time":1520092800000,"data":4623},{"time":1520179200000,"data":4461},{"time":1520265600000,"data":1117},{"time":1520352000000,"data":4014},{"time":1520438400000,"data":3340},{"time":1520524800000,"data":2147},{"time":1520611200000,"data":4189},{"time":1520697600000,"data":1276},{"time":1520784000000,"data":165},{"time":1520870400000,"data":3682},{"time":1520956800000,"data":2473},{"time":1521043200000,"data":1911},{"time":1521129600000,"data":286},{"time":1521216000000,"data":3690},{"time":1521302400000,"data":4849},{"time":1521388800000,"data":4402},{"time":1521475200000,"data":1054},{"time":1521561600000,"data":4019},{"time":1521648000000,"data":3816},{"time":1521734400000,"data":4701},{"time":1521820800000,"data":49},{"time":1521907200000,"data":2245},{"time":1521993600000,"data":285},{"time":1522080000000,"data":308},{"time":1522166400000,"data":2578},{"time":1522252800000,"data":2278},{"time":1522339200000,"data":2039},{"time":1522425600000,"data":2277},{"time":1522512000000,"data":5000},{"time":1522598400000,"data":850},{"time":1522684800000,"data":2646},{"time":1522771200000,"data":195},{"time":1522857600000,"data":3976},{"time":1522944000000,"data":3081},{"time":1523030400000,"data":3414},{"time":1523116800000,"data":1330},{"time":1523203200000,"data":4520},{"time":1523289600000,"data":867},{"time":1523376000000,"data":2197},{"time":1523462400000,"data":3509},{"time":1523548800000,"data":3460},{"time":1523635200000,"data":1597},{"time":1523721600000,"data":576},{"time":1523808000000,"data":3179},{"time":1523894400000,"data":1095},{"time":1523980800000,"data":4185},{"time":1524067200000,"data":899},{"time":1524153600000,"data":1286},{"time":1524240000000,"data":137},{"time":1524326400000,"data":2802},{"time":1524412800000,"data":4522},{"time":1524499200000,"data":3937},{"time":1524585600000,"data":4957},{"time":1524672000000,"data":2121},{"time":1524758400000,"data":386},{"time":1524844800000,"data":86},{"time":1524931200000,"data":412},{"time":1525017600000,"data":2104},{"time":1525104000000,"data":4872},{"time":1525190400000,"data":2030},{"time":1525276800000,"data":4853},{"time":1525363200000,"data":2362},{"time":1525449600000,"data":2191},{"time":1525536000000,"data":1584},{"time":1525622400000,"data":4212},{"time":1525708800000,"data":238},{"time":1525795200000,"data":3291},{"time":1525881600000,"data":2263},{"time":1525968000000,"data":2488},{"time":1526054400000,"data":1939},{"time":1526140800000,"data":1093},{"time":1526227200000,"data":1120},{"time":1526313600000,"data":682},{"time":1526400000000,"data":1979},{"time":1526486400000,"data":4033},{"time":1526572800000,"data":2914},{"time":1526659200000,"data":4586},{"time":1526745600000,"data":1003},{"time":1526832000000,"data":3567},{"time":1526918400000,"data":3108},{"time":1527004800000,"data":1685},{"time":1527091200000,"data":4782},{"time":1527177600000,"data":3254},{"time":1527264000000,"data":3296},{"time":1527350400000,"data":3205},{"time":1527436800000,"data":3107},{"time":1527523200000,"data":2145},{"time":1527609600000,"data":2006},{"time":1527696000000,"data":2310},{"time":1527782400000,"data":2440},{"time":1527868800000,"data":4149},{"time":1527955200000,"data":4523},{"time":1528041600000,"data":3303},{"time":1528128000000,"data":2075},{"time":1528214400000,"data":504},{"time":1528300800000,"data":3938},{"time":1528387200000,"data":301},{"time":1528473600000,"data":1209},{"time":1528560000000,"data":2034},{"time":1528646400000,"data":1834},{"time":1528732800000,"data":3777},{"time":1528819200000,"data":2432},{"time":1528905600000,"data":2165},{"time":1528992000000,"data":3470},{"time":1529078400000,"data":2023},{"time":1529164800000,"data":4763},{"time":1529251200000,"data":56},{"time":1529337600000,"data":3277},{"time":1529424000000,"data":1813},{"time":1529510400000,"data":4137},{"time":1529596800000,"data":870},{"time":1529683200000,"data":1706},{"time":1529769600000,"data":4241},{"time":1529856000000,"data":579},{"time":1529942400000,"data":421},{"time":1530028800000,"data":3213},{"time":1530115200000,"data":3058},{"time":1530201600000,"data":3796},{"time":1530288000000,"data":120},{"time":1530374400000,"data":657},{"time":1530460800000,"data":4875},{"time":1530547200000,"data":3295},{"time":1530633600000,"data":4032},{"time":1530720000000,"data":3569},{"time":1530806400000,"data":3146},{"time":1530892800000,"data":3713},{"time":1530979200000,"data":4696},{"time":1531065600000,"data":3569},{"time":1531152000000,"data":1144},{"time":1531238400000,"data":2750},{"time":1531324800000,"data":4850},{"time":1531411200000,"data":543},{"time":1531497600000,"data":1007},{"time":1531584000000,"data":3856},{"time":1531670400000,"data":4287},{"time":1531756800000,"data":2806},{"time":1531843200000,"data":1792},{"time":1531929600000,"data":1429},{"time":1532016000000,"data":2003},{"time":1532102400000,"data":1701},{"time":1532188800000,"data":337},{"time":1532275200000,"data":3208},{"time":1532361600000,"data":990},{"time":1532448000000,"data":824},{"time":1532534400000,"data":320},{"time":1532620800000,"data":2296},{"time":1532707200000,"data":875},{"time":1532793600000,"data":2860},{"time":1532880000000,"data":4717},{"time":1532966400000,"data":3624},{"time":1533052800000,"data":1366},{"time":1533139200000,"data":362},{"time":1533225600000,"data":2351},{"time":1533312000000,"data":1958},{"time":1533398400000,"data":4762},{"time":1533484800000,"data":3974},{"time":1533571200000,"data":3884},{"time":1533657600000,"data":4423},{"time":1533744000000,"data":941},{"time":1533830400000,"data":230},{"time":1533916800000,"data":859},{"time":1534003200000,"data":3680},{"time":1534089600000,"data":4674},{"time":1534176000000,"data":318},{"time":1534262400000,"data":657},{"time":1534348800000,"data":4998},{"time":1534435200000,"data":26},{"time":1534521600000,"data":3491},{"time":1534608000000,"data":4462},{"time":1534694400000,"data":1491},{"time":1534780800000,"data":1121},{"time":1534867200000,"data":1547},{"time":1534953600000,"data":2391},{"time":1535040000000,"data":1755},{"time":1535126400000,"data":1215},{"time":1535212800000,"data":2766},{"time":1535299200000,"data":3435},{"time":1535385600000,"data":3003},{"time":1535472000000,"data":1279},{"time":1535558400000,"data":1338},{"time":1535644800000,"data":4897},{"time":1535731200000,"data":285},{"time":1535817600000,"data":4024},{"time":1535904000000,"data":3344},{"time":1535990400000,"data":1972},{"time":1536076800000,"data":471},{"time":1536163200000,"data":597},{"time":1536249600000,"data":3672},{"time":1536336000000,"data":2015},{"time":1536422400000,"data":1131},{"time":1536508800000,"data":3891},{"time":1536595200000,"data":2791},{"time":1536681600000,"data":1461},{"time":1536768000000,"data":891},{"time":1536854400000,"data":2884},{"time":1536940800000,"data":629},{"time":1537027200000,"data":978},{"time":1537113600000,"data":1047},{"time":1537200000000,"data":2466},{"time":1537286400000,"data":3462},{"time":1537372800000,"data":1909},{"time":1537459200000,"data":1035},{"time":1537545600000,"data":1995},{"time":1537632000000,"data":4045},{"time":1537718400000,"data":73},{"time":1537804800000,"data":295},{"time":1537891200000,"data":2638},{"time":1537977600000,"data":2350},{"time":1538064000000,"data":4770},{"time":1538150400000,"data":3042},{"time":1538236800000,"data":2848},{"time":1538323200000,"data":488},{"time":1538409600000,"data":4033},{"time":1538496000000,"data":1064},{"time":1538582400000,"data":3121},{"time":1538668800000,"data":2797},{"time":1538755200000,"data":2586},{"time":1538841600000,"data":2013},{"time":1538928000000,"data":1838},{"time":1539014400000,"data":2617},{"time":1539100800000,"data":2007},{"time":1539187200000,"data":2672},{"time":1539273600000,"data":1404},{"time":1539360000000,"data":55},{"time":1539446400000,"data":3509},{"time":1539532800000,"data":311},{"time":1539619200000,"data":371},{"time":1539705600000,"data":4114},{"time":1539792000000,"data":806},{"time":1539878400000,"data":1284},{"time":1539964800000,"data":424},{"time":1540051200000,"data":4601},{"time":1540137600000,"data":3755},{"time":1540224000000,"data":4804},{"time":1540310400000,"data":4344},{"time":1540396800000,"data":2345},{"time":1540483200000,"data":3652},{"time":1540569600000,"data":1668},{"time":1540656000000,"data":341},{"time":1540742400000,"data":1809},{"time":1540828800000,"data":3967},{"time":1540915200000,"data":2534},{"time":1541001600000,"data":621},{"time":1541088000000,"data":1793},{"time":1541174400000,"data":27},{"time":1541260800000,"data":2990},{"time":1541347200000,"data":2112},{"time":1541433600000,"data":686},{"time":1541520000000,"data":4253},{"time":1541606400000,"data":1138},{"time":1541692800000,"data":98},{"time":1541779200000,"data":137},{"time":1541865600000,"data":2932},{"time":1541952000000,"data":2949},{"time":1542038400000,"data":3170},{"time":1542124800000,"data":4250},{"time":1542211200000,"data":4527},{"time":1542297600000,"data":3394},{"time":1542384000000,"data":3212},{"time":1542470400000,"data":561},{"time":1542556800000,"data":3751},{"time":1542643200000,"data":550},{"time":1542729600000,"data":3744},{"time":1542816000000,"data":1458},{"time":1542902400000,"data":832},{"time":1542988800000,"data":914},{"time":1543075200000,"data":4944},{"time":1543161600000,"data":1912},{"time":1543248000000,"data":4103},{"time":1543334400000,"data":3273},{"time":1543420800000,"data":1875},{"time":1543507200000,"data":1849},{"time":1543593600000,"data":106},{"time":1543680000000,"data":4342},{"time":1543766400000,"data":735},{"time":1543852800000,"data":1727},{"time":1543939200000,"data":3933},{"time":1544025600000,"data":3015},{"time":1544112000000,"data":6},{"time":1544198400000,"data":4047},{"time":1544284800000,"data":1662},{"time":1544371200000,"data":1224},{"time":1544457600000,"data":2099},{"time":1544544000000,"data":3905},{"time":1544630400000,"data":2608},{"time":1544716800000,"data":2682},{"time":1544803200000,"data":3964},{"time":1544889600000,"data":1459},{"time":1544976000000,"data":2087},{"time":1545062400000,"data":365},{"time":1545148800000,"data":1027},{"time":1545235200000,"data":4688},{"time":1545321600000,"data":2261},{"time":1545408000000,"data":1873},{"time":1545494400000,"data":2111},{"time":1545580800000,"data":3459},{"time":1545667200000,"data":3582},{"time":1545753600000,"data":275},{"time":1545840000000,"data":4540},{"time":1545926400000,"data":4704},{"time":1546012800000,"data":756},{"time":1546099200000,"data":1810}]}],
            //  查询的数据
            argu: null,
            //  图表Table 切换的值
            tab_table:null,

        },
        methods: {
            // 转换时间粒度
            timeType2: function (startTime, endTime) {
                var _that = this;
                var diff = +new Date(endTime) - new Date(startTime);
                //数据聚合时间类型1-时，2-天，4-月，5-年
                if (diff < (7 * 24 * 60 * 60 * 1000)) {
                    return 1;
                } else if (diff < (31 * 24 * 60 * 60 * 1000)) {
                    return 2;
                } else if (diff < (365 * 24 * 60 * 60 * 1000)) {
                    return 4;
                } else {
                    return 5;
                }

                return 1;
            },
            //  Tab 选项切换内容
            createHandlerClick: function (type) {
                var _that = this;

                return function (arr) {



                    _that.query[type] = arr;

                    //  查询对应的值的单位
                    if (type == "energy" || type == "areas") {

                        // 重新查询数据
                        _that.createHandlerClick();


                    } else {

                    }
                }
            },
            computeWidth: function () {
                //  计算宽度是否够容纳

                //                      正行宽度                             图表报表          下载详情图表          平方单位                        能源类型                padding-right
                this.iscombox = ((this.$refs.tab.clientWidth - this.$refs.vcheckbox.getWidth() - 84 - this.$refs.cobxs.getWidth() - this.$refs.cobxs1.getWidth() - 20) < 0);
            },
            // 模型面板取消选项
            handlercancelenergyModel: function () {
                this.showEnergyModel = false;
            },
            // 模型面板弹出选项
            handlerclickenergyModel: function (projects, arr) {
                this.energyProject = projects[0];
                this.energyModel = arr[0];
                //  模型面板取消选项
                this.handlercancelenergyModel();
                //  重新查询对应的分项树
                this.queryModelTree(this.energyModel.buildingLocalId, this.energyModel.energyModelId);
            },
            // 查询对应的分项树
            queryModelTree: function (buildingLocalId, energyModelLocalId) {

                var _that = this;
                singleController.querySubOption({
                    buildingLocalId: buildingLocalId,
                    energyModelLocalId: energyModelLocalId
                }).then(function (res) {
                    _that.energyModelList = res;
                })
            },
            // 分项返回值
            handlerclickSuboption: function (arr) {

                this.suboptionModel = arr;
            },
            // 获取对应的查询数据
            getQueryArgu: function (times) {
                var _that = this;

                _that.tab_table = 0;

                var timeType = times[0].timeType == 'w' ? '1' : '2';

                return {
                    "projectId": _that.energyProject.projectId, //类型：String  必有字段  备注：项目id
                    "buildingLocalId": _that.energyModel.buildingLocalId, //类型：String  必有字段  备注：建筑本地编码
                    "energyModelLocalId": _that.energyModel.energyModelId, //类型：String  必有字段  备注：能耗模型本地编码
                    "timeType": timeType, //类型：Number  必有字段  备注：数据聚合时间类型1-时，2-天，4-月，5-年
                    "dataKind": _.get(_that.query.areas, '[0].code'), //类型：Number  必有字段  备注：1-总能耗；2-单平米能耗；
                    "dataType": _.get(_that.query.energy, '[0].code'), //类型：Number  必有字段  备注：1-能耗；2-费用；3-CO2排放量；4-标煤
                    "paramList": times.map(function (item) {
                        return {
                            "energyItemLocalId": _.map(_that.suboptionModel, 'localId').join(''), //类型：String  必有字段  备注：分项本地编码
                            "timeFrom": new Date(item.startTime).format('yyyy-MM-dd hh:mm:ss'), //类型：String  必有字段  备注：开始时间yyyy-MM-dd HH:mm:ss（>=）
                            "timeTo": new Date(item.endTime).format('yyyy-MM-dd hh:mm:ss'), //类型：String  必有字段  备注：结束时间yyyy-MM-dd HH:mm:ss（<）
                        }
                    })
                }
            },
            // 查询对应图表需要的信息
            queryMasterTabel: function () {

                var _that = this;

                //  获取查询数据
                var argu = _that.getQueryArgu();

                return singleController.queryTable(argu).then(function (res) {

                    // 保存渲染的表格的数据
                    _that.queryBak = res;
                    _that.queryRes = res[0].dataList.map(function (item) {
                        return {
                            x: item.time,
                            y: item.data,
                        }
                    });

                    _that.queryDeatil = _.cloneDeep(_that.queryRes);

                    //  渲染的主表格
                    return _that.createMaster(_.cloneDeep(_that.queryRes));

                    //  渲染的渲染的对应子表格
                })
            },
            // 验证时间的长度是否同意
            vTimeLen: function (argu) {


                for (var index = 0; index < argu.length; index++) {
                    var item = argu[index];

                    if (item.timeType == 'y') continue;

                    if (index == 0) {
                        time = item.endTime - item.startTime;
                    } else {

                        if (time != item.endTime - item.startTime) {
                            fail("对比不同时间的数据需要保持时间间隔一致!");
                            return false;
                        }
                    }
                }

                return true;
            },
            //  时间控件点击选择事件
            timeClick: function (argu) {

                // 先赋值
                this.timer = argu;

                this.vTimeLen(argu);
            },
            // 获取分享模型信息
            getItemByEnergyModelList: function (localId) {
                return _.find(this.energyModelList, {
                    localId: localId
                });
            },
            // 创建表格 父子图表
            createCharts: function () {
                var _that = this;
                if (!_that.isColumnar()) {

                    _that.queryMasterTabel().then(function () {
                        _that.getChilds(_that.suboptionModel[0].content);
                    })
                } else {
                    // 生成整体图表
                    _that.queryMasterTabel().then(function (res) {
                        // 生成参考信息
                        _that.createReference();
                        // 绑定总价
                        _that.Reference.total = _that.queryBak[0].sumData;
                        // 生成详情图表
                        _that.createDetail(res);
                    });
                }
            },
            // 根据时间粒度来转换时间字符串
            convertTimeByTimeType: function (time, timeType) {
                var date = new Date(time);

                return {
                    1: date.format('yyyy-MM-dd hh:mm'),
                    2: date.format('yyyy-MM-dd'),
                    4: date.format('yyyy-MM'),
                    5: date.format('yyyy'),
                }[timeType];
            },
            // 返回的统一的小数点
            fix2: function (num) {
                num = parseFloat(num);
                if (_.isNaN(num)) return 0;

                var len = _.get(num.toString().split('.'), '[1].length', 0);
                if (len === 0) return num;

                if (num < 1) return num.toFixed(3);
                return num.toFixed(1);
            },
            // 查询表格数据
            submitQuery: function () {
                var _that = this;

                _that.vTimeLen(_that.timer);

                _that.argu = _that.getQueryArgu(_that.timer);

                singleController.queryTable(_that.argu).then(function (res) {

                    _that.res = res;

                    _that.$nextTick(function () {
                        _that.createChart(_.cloneDeep(res), _that.timer[0].timeType);
                    })
                })
            },
            // 创建表格
            createChart: function (list, type) {
                var _that = this;
                Promise.all(list.map(function (item, index) {

                    return new Promise(function (resolve) {

                        if (type == 'y') {
                            pchart.initYearHeatmap({
                                title: {
                                    text: _that.suboptionModel[0].name,
                                    align: 'left',
                                },
                                yAxis: {
                                    title: { text: 'kWh' },
                                    align: 'low',
                                    y: -10,
                                    x: 600
                                },
                                container: _that.$refs['chart' + index][0],
                                series: {
                                    data: item.dataList.map(function (item) {
                                        return {
                                            x: new Date(item.time).format("yyyy-MM-dd hh:mm:00"),
                                            y: item.data,
                                        }
                                    }),
                                    name: _.get(_that.query, "energy[0].name", ''),
                                }
                            }, function () {
                                resolve()
                            });
                        } else {
                            pchart.initWeekHeatmap({
                                title: {
                                    text: _that.suboptionModel[0].name,
                                    align: 'high',
                                },
                                yAxis: {
                                    title: { text: 'kWh' },
                                    align: 'low',
                                    y: -10,
                                    x: 600
                                },
                                container: _that.$refs['chart' + index][0],
                                series: {
                                    data: item.dataList.map(function (item) {
                                        return {
                                            x: new Date(item.time).format("yyyy-MM-dd hh:mm:00"),
                                            y: item.data,
                                        }
                                    }),
                                    name: _.get(_that.query, "energy[0].name", ''),
                                }
                            }, function () {
                                resolve()
                            });
                        }


                    })
                }));

            },
            // 获取分享模型信息
            getItemByEnergyModelList: function (localId) {
                return _.find(this.energyModelList, {
                    localId: localId
                });
            },
            deleteRecordFn: function (obj) {

                var _that = this;

                var index = _that.selecteds.indexOf(obj);

                _that.res.splice(index, 1);

                _that.argu.paramList.splice(index, 1);

                // _that.res = _that.res.filter(function (item) {
                //     return !(obj.subentry.energyItemLocalId == item.energyItemLocalId && obj.time.st == item.timeFrom && obj.time.et == item.timeTo)
                // });
            },
            // 是否显示表格
            isAreas: function () {
                return _.isUndefined(_.find(this.query.tables, { code: 1 }));
            },
        },
        watch: {

        },
        computed: {
            canSubmit: function () {
                var _that = this;
                return _that.suboptionModel.length && _that.timer.length;
            },
            selecteds: function () {
                var _that = this;

                if (!_that.argu || !_that.res.length) return [];

                var MAX = _.max(_.map(_that.res, 'sumData'));

                return _that.argu.paramList.map(function (item, index) {

                    return {
                        "time": {
                            "st": new Date(item.timeFrom).format('yyyy-MM-dd hh:mm:ss'),
                            "et": new Date(item.timeTo).format('yyyy-MM-dd hh:mm:ss'),
                        },
                        "value": {
                            "num": _that.res[index].sumData,
                            "unit": "kwh"
                        },
                        "subentry": {
                            "energyItemLocalName": _.get(_that.getItemByEnergyModelList(_that.res[index].energyItemLocalId), 'name', '--'),
                            "energyItemLocalId": _that.res[index].energyItemLocalId,
                        },
                        "base": {
                            "width": _that.fix2((_that.res[index].sumData / MAX) * 140) + "px",
                            "color": pcolor.cd[index]
                        }
                    }
                });
            },
            energyModelTree: function () {
                var _that = this;
                return _.filter(_that.energyModelList, {
                    parentLocalId: false
                })
                    .map(function (info) {

                        var item = _.clone(info);

                        item.content = _.filter(_that.energyModelList, {
                            parentLocalId: item.localId
                        });

                        if (_.isArray(item.content) && item.content.length) {
                            item.content = item.content.map(arguments.callee);
                        };
                        return item;
                    })
            }
        }
    });


    app.$nextTick(function () {

        app.computeWidth();
    })


    window.onresize = app.computeWidth.bind(app);


    window.app = app;
})