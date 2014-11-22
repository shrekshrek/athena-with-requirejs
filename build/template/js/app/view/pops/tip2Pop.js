define(['text!./tip2.html', 'css!./tip2.css', 'map', 'model', 'router', './basePop'], function(html, css, SiteMap, SiteModel, SiteRouter, BasePop) {
    var view = BasePop.extend({
        id : "tip2-pop",
        init : function() {
            this.template = html;
            this.render();
            Athena.view.BasePage.prototype.init.apply(this);
            var _self = this;

            TweenMax.set(this.$el, {
                opacity : 0,
                display : 'none'
            });
        },
        resize : function() {
            BasePop.prototype.resize.apply(this);
        },
        transitionIn : function() {
            var _self = this;
            BasePop.prototype.transitionIn.apply(this);
            if (TweenMax.isTweening(this.$el))
                TweenMax.killTweensOf(this.$el);
            TweenMax.to(this.$el, 0.3, {
                opacity : 1,
                display : 'block',
                ease : Linear.easeNone,
                onComplete : function() {
                    _self.transitionInComplete();
                }
            });
        },
        transitionOut : function() {
            var _self = this;
            BasePop.prototype.transitionOut.apply(this);
            if (TweenMax.isTweening(this.$el))
                TweenMax.killTweensOf(this.$el);
            TweenMax.to(this.$el, 0.3, {
                opacity : 0,
                display : 'none',
                ease : Linear.easeNone,
                onComplete : function() {
                    _self.transitionOutComplete();
                }
            });
        },
        closeHandler : function() {
            BasePop.prototype.closeHandler.apply(this);
        }
    });
    return view;
});
