define(['athena', 'jstween'], function (Athena, JT) {
    var view = Athena.Page.extend({
        className: "pop",

        events: {
            "click .pop-bg": "closeHandler",
            "click .close": "closeHandler"
        },

        init: function () {
            view.__super__.init.apply(this);

            JT.set(this.$el, {autoAlpha: 0});
        },

        resize: function () {
            view.__super__.resize.apply(this);

            this.$el.css({
                width: Athena.stageRect().width,
                height: Athena.stageRect().height
            });
        },

        transitionIn: function () {
            view.__super__.transitionIn.apply(this);

            var _self = this;
            JT.to(this.$el, 0.3, {
                autoAlpha: 1, onEnd: function () {
                    _self.transitionInComplete();
                }
            });
        },

        transitionOut: function () {
            view.__super__.transitionOut.apply(this);

            var _self = this;
            JT.to(this.$el, 0.3, {
                autoAlpha: 0, onEnd: function () {
                    _self.transitionOutComplete();
                }
            });
        },

        closeHandler: function () {
            Athena.pageOff(this.data);
        }

    });
    return view;
});
