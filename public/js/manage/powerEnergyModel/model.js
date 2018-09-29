var powerEnergyModel = {
    energyStoreArr: [],             //能源的所有故事版
    energyStoreOfModelArr: [],       //设置过能耗模型的故事版
    selStory: {},                    //当前选择的故事版
    selCopyStory: {}                //选择的沿用某个故事版，不具有storyCode时，代表是新上传
};

var powerEnergyModelMthods = {
    /*故事版tab选择事件*/
    storySelEvent: function (model, event) {
        model.storyCode = model.type;
        powerEnergyModel.selStory = model;
        powerEnergyModel.selCopyStory = null;
        powerEnergyLogic.filterSetedModelObj();

        //把所有的单选按钮置为未选中
        $('#radNewModel').precover();
        var radios = $('.js-copymodel-models').children();
        radios.each(function () {
            $(this).precover();
        });

        //把文件选择框置为空
        $('#btnEnergyModelUpload').precover();

        //上传、下载按钮置为不可用
        $('#btnEnergyModelUpload').pdisable(true);
        $('#btnEnergyModelDown').pdisable(true);
    },
    /*沿用或者新上传单选按钮选择事件*/
    radioCopyStorySel: function (model, event) {
        var _model = arguments.length == 2 ? model : null;
        powerEnergyModel.selCopyStory = _model || {};
        if (!_model) {
            $('#btnEnergyModelUpload').pdisable(false);
            $('#btnEnergyModelDown').pdisable(false);
        } else {
            $('#btnEnergyModelUpload').pdisable(true);
            $('#btnEnergyModelDown').pdisable(true);
        }
    },
    /*分项模型模板下载*/
    energyModelTemplateDown: function () {
        pajax.download('123456789012345678901234567890BI故事版分项模型配置模板.xlsx');
    },
    /*分项模型确定按钮事件*/
    saveEnergyModelEvent: function () {
        if (!powerEnergyModel.selCopyStory) return $('#globalnotice').pshow({ text: '请先设置能耗模型', state: 'failure' });
        var storyCode = powerEnergyModel.selStory.storyCode;
        var emFileName;
        var attachments;
        //新上传
        if (!powerEnergyModel.selCopyStory.storyCode) {
            var file = $('#btnEnergyModelUpload').pval()[0];
            if (!file) return $('#globalnotice').pshow({ text: '请先上传分项模型附件', state: 'failure' });
            emFileName = file.name + '.' + file.suffix;
            attachments = {
                path: file.url,
                toPro: 'emFileKey',
                fileName: file.name,
                fileSuffix: file.suffix
            };
        } else {
            emFileName = powerEnergyModel.selCopyStory.emFileName;
            attachments = {
                path: psecret.create(powerEnergyModel.selCopyStory.emFileKey),
                toPro: 'emFileKey',
                isNewFile: false,
                fileName: emFileName.substring(0, emFileName.lastIndexOf('.')),
                fileSuffix: emFileName.substring(emFileName.lastIndexOf('.') + 1)
            };
        }
        $('#globalloading').pshow();
        powerEnergyController.saveEnergyModelForStore({
            emFileName: emFileName,
            storyCode: storyCode,
            attachments: attachments
        }, function () {
            powerEnergyLogic.getStoreOfModelArr(function () {
                $('#globalnotice').pshow({ text: '保存成功', state: 'success' });
            });
        }, function () {
            $('#globalloading').phide();
            $('#globalnotice').pshow({ text: '保存失败', state: 'failure' });
        });
    },
    /*下载设置过的分项模型*/
    downSetedEnergyModel: function (fileKey) {
        pajax.download(fileKey);
    }
};


var powerEnergyLogic = {
    init: function () {
        $('#globalloading').pshow();
        var vueModel = new Vue({
            el: "#divMaxPowerEnergy",
            data: powerEnergyModel,
            methods: powerEnergyModelMthods
        });
        vueModel.$nextTick(function () {
            $('#js_programSet_tab').psel(0);
        });
        this.getStoreOfModelArr();
    },
    /*获取已设置过能耗模型的所有故事版*/
    getStoreOfModelArr: function (call) {
        powerEnergyController.getStoreOfModelArr(function (result) {
            result = result || [];
            for (var i = 0; i < result.length; i++) {
                var curr = result[i];
                var tempArr = powerEnergyModel.energyStoreArr.filter(function (c) { return c.type === curr.storyCode; });
                curr.storyName = (tempArr[0] || {}).title || '';
            }
            powerEnergyModel.energyStoreOfModelArr = result;
        }, null, function () {
            powerEnergyLogic.filterSetedModelObj();
            $('#globalloading').phide();
            if (typeof call == 'function') call();
        });
    },
    /*从已设置过能耗模型的所有故事版中筛选出当前选择的故事版*/
    filterSetedModelObj: function () {
        var _obj = powerEnergyModel.energyStoreOfModelArr.filter(function (curr) {
            return curr.storyCode === powerEnergyModel.selStory.storyCode;
        })[0];
        if (_obj)
            powerEnergyModel.selStory = _obj;
    }
};


var powerEnergyController = {
    /*获取已设置过能耗模型的所有的故事版*/
    getStoreOfModelArr: function (successCall, errCall, completeCall) {
        pajax.post({
            url: 'ListEnergyModelOfStory',
            success: successCall,
            error: errCall,
            complete: completeCall
        });
    },
    /*保存能耗模型设置*/
    saveEnergyModelForStore: function (objParam, successCall, errCall, completeCall) {
        pajax.updateWithFile({
            url: 'SaveEnergyModelOfStory',
            data: objParam,
            success: successCall,
            error: errCall,
            complete: completeCall
        });
    }
};

$(function () {
    powerEnergyLogic.init();
});