define(['map', 'model', 'router'], function(SiteMap, SiteModel, SiteRouter) {
    var view = Athena.view.BasePage.extend({
        id : 'preloader2',
        className : 'pop',
        $bar : null,
        init : function() {
            Athena.view.BasePage.prototype.init.apply(this);
            var _self = this;

            this.$bar = $(this.el).find('#loading-bar');

//            TweenMax.set(this.$el, {
//                opacity : 0,
//                display : 'none'
//            });
        },
        resize : function() {
            Athena.view.BasePage.prototype.resize.apply(this);
        },
        transitionIn : function() {
            var _self = this;
            Athena.view.BasePage.prototype.transitionIn.apply(this);
            if (TweenMax.isTweening(this.$el))
                TweenMax.killTweensOf(this.$el);
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
            Athena.view.BasePage.prototype.transitionOut.apply(this);
            if (TweenMax.isTweening(this.$el))
                TweenMax.killTweensOf(this.$el);
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
            if (TweenMax.isTweening(this.$bar))
                TweenMax.killTweensOf(this.$bar);
            var _n = obj.progress ? obj.progress : 0;
            TweenMax.to(this.$bar, 0.3, {
                width : _n * 100 + '%',
                left : (1 - _n) * 0.5 * 100 + '%'
            });
        }
    });
    return view;
});
