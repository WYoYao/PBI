var manageEvent = {
    menuSel: function (event, code) {
        var currJqTarget = $(event.currentTarget);
        var selClass = 'menuTypeActive';
        currJqTarget.siblings().removeClass(selClass);
        currJqTarget.addClass(selClass);
        $('#frameManageRegion').attr('src', '/bi/' + code);
    }
};

$(function () {
    $('#divManageLeft').children()[0].click();
});