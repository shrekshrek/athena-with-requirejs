define([], function() {
    var view = Athena.view.BasePage.extend({
        className : "pop",
        $main : null,
        $bg : null,
        events : {
            "click .pop-bg" : "closeHandler",
            "click .close" : "closeHandler"
        },
        init : function() {
            Athena.view.BasePage.prototype.init.apply(this);

            this.$main = this.$el.find(".pop-main");
            this.$bg = this.$el.find(".pop-bg");
        },
        resize : function() {
            this.$el.width(Athena.api.stageRect().width);
            this.$el.height(Athena.api.stageRect().height);

            Athena.view.BasePage.prototype.resize.apply(this);
        },
        closeHandler : function() {
            Athena.api.pageOff(this.data);
        }
    });
    return view;
});