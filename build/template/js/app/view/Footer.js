define(["tracker", "athena", "siteMap", "siteModel", "siteRouter", "tweenmax"], function(Tracker, Athena, SiteMap, SiteModel, SiteRouter, TweenMax) {
    var view = Athena.view.BasePage.extend({
        id: "footer",
        className: "page",
        init: function() {
            Athena.view.BasePage.prototype.init.apply(this);

            this.$el.css({opacity: 0});
        },
        destroy: function() {
            Athena.view.BasePage.prototype.destroy.apply(this);
        },
        resize: function() {
            Athena.view.BasePage.prototype.resize.apply(this);
        },
        transitionIn: function() {
            var _self = this;
            Athena.view.BasePage.prototype.transitionIn.apply(this);
            if (TweenMax.isTweening(this.$el))
                TweenMax.killTweensOf(this.$el);
            TweenMax.to(this.$el, 0.5, {opacity: 1, ease: Linear.ease, onComplete: function() {
                    _self.transitionInComplete();
                }});
        },
        transitionOut: function() {
            var _self = this;
            Athena.view.BasePage.prototype.transitionOut.apply(this);
            if (TweenMax.isTweening(this.$el))
                TweenMax.killTweensOf(this.$el);
            TweenMax.to(this.$el, 0.5, {opacity: 0, ease: Linear.ease, onComplete: function() {
                    _self.transitionOutComplete();
                }});
        }
    });
    return view;
});
