define(['text!./home.html', 'css!./home.css', 'map', 'model', 'router'], function(html, css, SiteMap, SiteModel, SiteRouter) {
    var view = Athena.view.BasePage.extend({
        id : 'home-page',
        className : 'page',
        init : function() {
            this.template = html;
            this.render();
            view.__super__.init.apply(this);
            var _self = this;

            TweenMax.set(this.$el, {
                opacity : 0,
                display : 'none'
            });
        },
        destroy : function() {
            view.__super__.destroy.apply(this);
        },
        resize : function() {
            view.__super__.resize.apply(this);
        },
        transitionIn : function() {
            var _self = this;
            view.__super__.transitionIn.apply(this);
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
        },
        transitionOut : function() {
            var _self = this;
            view.__super__.transitionOut.apply(this);
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
        }
    });
    return view;
});
