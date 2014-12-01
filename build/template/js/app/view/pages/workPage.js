define(['text!./work.html', 'css!./work.css', 'map', 'model', 'router', 'scroller'], function(html, css, SiteMap, SiteModel, SiteRouter, Scroller) {
    var view = Athena.view.BasePage.extend({
        id : 'work-page',
        className : 'page',
        init : function() {
            this.template = html;
            this.render();
            view.__super__.init.apply(this);
            var _self = this;

            this.scroller = new Scroller({
                content : this.$el.find('#content'),
                bar : this.$el.find('.scroll-bar')
            });
            this.scroller.init();
            this.addChild(this.scroller);

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

            // this.scroller.update();
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
