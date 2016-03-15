define(['text!./@name@.html', 'css!./@name@.css', 'map', 'router', 'model'], function(html, css, Map, Router, Model) {
    var view = Athena.Page.extend({
        id : '@name@',
        className : 'page',

        init : function() {
            this.template = html.html || html;
            this.render();
            view.__super__.init.apply(this);

            var _self = this;

            $.each(this.$('li'), function(index, obj) {
                $(obj).on('click', function() {
                    _self._navHandler(index);
                    return false;
                });
            });

            //监听流程结束事件，检查更新当前页面的导航按钮状态
            this.listenTo(Athena, Athena.FLOW_COMPLETE, function() {
                this._checkNav();
            });

            this.$el.css({
                opacity : 0,
                visibility : 'hidden'
            });
        },

        destroy : function() {
            view.__super__.destroy.apply(this);
        },

        resize : function() {
            view.__super__.resize.apply(this);

            //this.$el.width(Athena.stageRect().width);

        },

        transitionIn : function() {
            view.__super__.transitionIn.apply(this);

            var _self = this;
            JT.to(this.$el, 0.5, {
                opacity: 1,
                onStart: function () {
                    this.target.style.visibility = 'visible';
                },
                onEnd: function () {
                    _self.transitionInComplete();
                }
            });
        },

        transitionInComplete: function(){
            view.__super__.transitionInComplete.apply(this);
        },

        transitionOut : function() {
            view.__super__.transitionOut.apply(this);

            var _self = this;
            JT.to(this.$el, 0.5, {
                opacity: 0,
                onEnd: function () {
                    this.target.style.visibility = 'hidden';
                    _self.transitionOutComplete();
                }
            });
        },

        transitionOutComplete : function() {
            view.__super__.transitionOutComplete.apply(this);
        },

        _checkNav : function() {
            var _page = Athena.getPageAt();
            var _id = 0;

            if (_page) {
                switch (_page.data) {
                case Map.home :
                    _id = 0;
                    break;
                case Map.work :
                    _id = 1;
                    break;
                }
            }

            $.each(this.$el.find('a'), function(index, obj) {
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
                Router.navigate(Map.home.id, {
                    trigger : true
                });
                break;
            case 1 :
                Router.navigate(Map.work.id, {
                    trigger : true
                });
                break;
            case 2 :
                Athena.pageTo(Map.tip1);
                break;
            }
        }

    });
    return view;
});
