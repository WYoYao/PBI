var path = require("path");

module.exports = {
    single: {
        title: "单项目-分项能耗",
        contents: [
            {
                type: "SingleInquire",
                title: "数据查询",
                description: "数据查询",
                icon: "α",
                src: "../../images/look/SingleInquire.png",
                url: "pages/single/SingleInquire"
            },
            {
                type: "SingleCompared",
                title: "数据对比",
                description: "数据对比",
                icon: "β",
                src: "../../images/look/SingleCompared.png",
                url: "pages/single/SingleCompared"
            },
            {
                type: "SingleSlide",
                title: "滑动平均",
                description: "滑动平均",
                icon: "﹂",
                src: "../../images/look/SingleSlide.png",
                url: "pages/single/SingleSlide"
            },
            {
                type: "SingleHeatMap",
                title: "热图分析",
                description: "热图分析",
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
                description: "数据查询",
                icon: "α",
                src: "../../images/look/MultipleInquire.png",
                url: "pages/multiple/MultipleInquire"
            },
            {
                type: "MultipleCompared",
                title: "数据对比",
                description: "数据对比",
                icon: "β",
                src: "../../images/look/MultipleCompared.png",
                url: "pages/multiple/MultipleCompared"
            },
            {
                type: "MultipleSlide",
                title: "滑动平均",
                description: "滑动平均",
                icon: "﹂",
                src: "../../images/look/MultipleSlide.png",
                url: "pages/multiple/MultipleSlide"
            },
            {
                type: "MultiplePop",
                title: "项目对比气泡",
                description: "项目对比气泡",
                icon: "∈",
                src: "../../images/look/MultiplePop.png",
                url: "pages/multiple/MultiplePop"
            },
            {
                type: "MultipleLandscape",
                title: "项目横向对比",
                description: "项目横向对比",
                icon: "∩",
                src: "../../images/look/MultipleLandscape.png",
                url: "pages/multiple/MultipleLandscape"
            }
        ]
    }
}