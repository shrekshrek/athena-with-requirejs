define(['text!./@name@.html', 'css!./@name@.css', 'pop', 'map', 'model', 'router'], function(html, css, BasePop, SiteMap, SiteModel, SiteRouter) {
    var view = BasePop.extend({
        id : "@name@-pop",

        init : function() {
            this.template = html.html || html;
            this.render();
            view.__super__.init.apply(this);
            var _self = this;

            TweenMax.set(this.$el, {
                opacity : 0,
                display : 'none'
            });
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

        closeHandler : function() {
            view.__super__.closeHandler.apply(this);
        }

    });
    return view;
});
