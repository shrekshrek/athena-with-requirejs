define(['athena', 'jquery', 'jstween', 'map', 'router', 'model'], function (Athena, $, JT, Map, Router, Model) {
    var view = Athena.Page.extend({
        id: '@name@',
        className: 'pop',
        $bar: null,

        init: function () {
            view.__super__.init.apply(this);

            this.$bar = this.$('#loading-bar');
        },

        resize: function () {
            view.__super__.resize.apply(this);

            this.$el.width(Athena.stageRect().width);
            this.$el.height(Athena.stageRect().height);
        },

        transitionIn: function () {
            view.__super__.transitionIn.apply(this);

            var _self = this;
            JT.to(this.$el, 0.3, {
                autoAlpha: 1, onEnd: function () {
                    _self.transitionInComplete();
                }
            });

            this.$bar.css({
                width: 0,
                left: '50%'
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

        transitionOutComplete: function () {
            this.trigger(Athena.TRANSITION_OUT_COMPLETE, {
                data: this.data
            });
        },

        progress: function (obj) {
            var _n = obj.progress ? obj.progress : 0;
            JT.to(this.$bar, 0.3, {
                width: _n * 100 + '%',
                left: (1 - _n) * 0.5 * 100 + '%'
            });
        }

    });
    return view;
});
