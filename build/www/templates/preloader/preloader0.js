define(['map', 'model', 'router'], function(SiteMap, SiteModel, SiteRouter) {
    var view = Athena.view.BasePage.extend({
        id : '@name@',
        className : 'pop',
        $bar : null,

        init : function() {
            view.__super__.init.apply(this);
            var _self = this;

            this.$bar = $(this.el).find('#loading-bar');

        },

        resize : function() {
            view.__super__.resize.apply(this);
        },

        transitionIn : function() {
            var _self = this;
            view.__super__.transitionIn.apply(this);
            TweenMax.to(this.$el, 0.5, {
                opacity : 1,
                display : 'block',
                ease : Linear.easeNone,
                onComplete : function() {
                    _self.transitionInComplete();
                }
            });

            this.$bar.css({
                width : 0,
                left : '50%'
            });
        },

        transitionOut : function() {
            var _self = this;
            view.__super__.transitionOut.apply(this);
            TweenMax.to(this.$el, 0.5, {
                opacity : 0,
                display : 'none',
                ease : Linear.easeNone,
                onComplete : function() {
                    _self.transitionOutComplete();
                }
            });
        },

        transitionOutComplete : function() {
            this.trigger(Athena.TRANSITION_OUT_COMPLETE, {
                data : this.data
            });
        },

        progress : function(obj) {
            var _n = obj.progress ? obj.progress : 0;
            TweenMax.to(this.$bar, 0.3, {
                width : _n * 100 + '%',
                left : (1 - _n) * 0.5 * 100 + '%'
            });
        }

    });
    return view;
});
