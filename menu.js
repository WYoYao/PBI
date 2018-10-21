var path = require("path");

module.exports = {
    single: {
        title: "单项目-分项能耗",
        contents: [
            {
                type: "SingleInquire",
                title: "数据查询",
                description: "通过图表直观了解某项目各分项能耗数据和总量，从而了解其能耗强度和能耗特征，发现能耗异常点。",
                icon: "α",
                src: "../../images/look/SingleInquire.png",
                url: "pages/single/SingleInquire"
            },
            {
                type: "SingleCompared",
                title: "数据对比",
                description: "通过图表直观了解不同分项分项不同时间内的能耗规律，帮助判断设备开启策略合理性。",
                icon: "β",
                src: "../../images/look/SingleCompared.png",
                url: "pages/single/SingleCompared"
            },
            {
                type: "SingleSlide",
                title: "滑动平均",
                description: "每个滑动周期都包含完整一年的数据，剔除季节影响因素，展示能耗水平变化",
                icon: "﹂",
                src: "../../images/look/SingleSlide.png",
                url: "pages/single/SingleSlide"
            },
            {
                type: "SingleHeatMap",
                title: "热图分析",
                description: "将数据进行排列并染色，可直观了解分项能耗在时间及空间上的变化规律",
                icon: "γ",
                src: "../../images/look/SingleHeatMap.png",
                url: "pages/single/SingleHeatMap.html"
            },
        ]
    },
    multiple: {
        title: "多项目-分项能耗",
        contents: [
            {
                type: "MultipleInquire",
                title: "数据查询",
                description: "可选择多个项目进行能耗数据分析，从而了解多项目总体能耗强度和能耗特征，以及不同项目类型的能耗特征。",
                icon: "α",
                src: "../../images/look/MultipleInquire.png",
                url: "pages/multiple/MultipleInquire"
            },
            {
                type: "MultipleCompared",
                title: "数据对比",
                description: "实现多项目、多分项、多时间段的能耗对比",
                icon: "β",
                src: "../../images/look/MultipleCompared.png",
                url: "pages/multiple/MultipleCompared"
            },
            {
                type: "MultipleSlide",
                title: "滑动平均",
                description: "可了解多个项目或集团所有项目能耗水平变化，总结能耗管理成果",
                icon: "﹂",
                src: "../../images/look/MultipleSlide.png",
                url: "pages/multiple/MultipleSlide"
            },
            {
                type: "MultiplePop",
                title: "项目对比气泡",
                description: "多维度展示各项目面积、能耗、单平米能耗，从而总结出三者之间的分布关系",
                icon: "∈",
                src: "../../images/look/MultiplePop.png",
                url: "pages/multiple/MultiplePop"
            },
            {
                type: "MultipleLandscape",
                title: "项目横向对比",
                description: "将多项目同一时间段内各分项能耗水平进行横向对比，定位各项目能耗水平高低",
                icon: "∩",
                src: "../../images/look/MultipleLandscape.png",
                url: "pages/multiple/MultipleLandscape"
            }
        ]
    },
    /*系统管理内的菜单配置，code必须以m_开头*/
    manageMenuType: [{
        name: '电耗模型设置',
        code: 'm_powerenergymodel'
    }]
}