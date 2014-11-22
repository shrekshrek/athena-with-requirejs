define(['text!./header.html', 'css!./header.css', 'map', 'model', 'router'], function(html, css, SiteMap, SiteModel, SiteRouter) {
    var view = Athena.view.BasePage.extend({
        id : 'header',
        className : 'page',
        init : function() {
            this.template = html;
            this.render();
            Athena.view.BasePage.prototype.init.apply(this);
            var _self = this;

            _.each(this.$el.find('li'), function(obj, index) {
                $(obj).on('click', function() {
                    _self._navHandler(index);
                    return false;
                });
            });

            this.listenTo(Athena, Athena.FLOW_COMPLETE, function() {
                this._checkPage();
            });

            TweenMax.set(this.$el, {
                opacity : 0,
                display : 'none'
            });
        },
        destroy : function() {
            Athena.view.BasePage.prototype.destroy.apply(this);
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
        _checkPage : function() {
            var _page = Athena.api.getPageAt();
            var _id = 0;

            if (_page) {
                switch (_page.data) {
                case SiteMap.home :
                    _id = 0;
                    break;
                case SiteMap.work :
                    _id = 1;
                    break;
                }
            }

            _.each(this.$el.find('a'), function(obj, index) {
                if (index == _id) {
                    $(obj).addClass('selected');
                } else {
                    $(obj).removeClass('selected');
                }
            });
        },
        _navHandler : function(id) {
            switch (id) {
            case 0 :
                SiteRouter.navigate(SiteMap.home.title, {
                    trigger : true
                });
                break;
            case 1 :
                SiteRouter.navigate(SiteMap.work.title, {
                    trigger : true
                });
                break;
            case 2 :
                Athena.api.pageTo(SiteMap.tip1);
                break;
            case 3 :
                Athena.api.pageTo(SiteMap.tip2);
                break;
            }
        }
    });
    return view;
});
