define(['text!./three.html', 'css!./three.css', 'map', 'model', 'router', 'css3d'], function(html, css, SiteMap, SiteModel, SiteRouter) {
    var view = Athena.view.BasePage.extend({
        id : 'three-page',
        className : 'page',
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
        destroy : function() {
            Athena.view.BasePage.prototype.destroy.apply(this);
        },
        resize : function() {
            Athena.view.BasePage.prototype.resize.apply(this);

            this.$el.width(Athena.stageRect().width);
            this.$el.height(Athena.stageRect().height);
            this.stage.size(Athena.stageRect().width, Athena.stageRect().height).update();
        },
        transitionIn : function() {
            var _self = this;

            this.init3D();

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
                    _self.clear3D();
                    _self.transitionOutComplete();
                }
            });
        },
        
        runIv:null,
        stage:null,
        init3D : function() {
            var s = this.stage = new Css3D.Stage();
            s.size("100%", "100%");
            s.material({
                color : "#cccccc"
            });
            s.update();
            this.$el.prepend(s.el);

            //创建一个三维容器（创建以方便分组使用）
            var sp = new Css3D.Sprite3D();
            sp.position(0, 0, -500).update();
            s.addChild(sp);

            //创建20个平面放入容器，并定义鼠标事件
            for (var i = 0; i < 20; i++) {
                var p = new Css3D.Plane();
                p.size(100);
                p.position(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
                p.rotation(Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150);
                p.material({
                    color : Css3D.getRandomColor()
                });
                p.buttonMode(true);
                p.update();
                sp.addChild(p);
                p.on("mouseover", function() {
                    this.le.scale(1.05).update();
                });
                p.on("mouseout", function() {
                    this.le.scale(1).update();
                });
            }

            //创建4个立方体放入容器，并定义鼠标事件
            for (var i = 0; i < 4; i++) {
                var p = new Css3D.Cube();
                p.size(100);
                p.position(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
                p.rotation(Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150);
                p.material({
                    color : Css3D.getRandomColor()
                });
                p.buttonMode(true);
                p.update();
                sp.addChild(p);
                p.on("mouseover", function() {
                    this.le.scale(1.1).update();
                });
                p.on("mouseout", function() {
                    this.le.scale(1).update();
                });
            }

            this.runIv = setInterval(function() {
                sp.rotate(0, 0.1, 0).update();
            }, 1000 / 60);
        },

        clear3D : function() {
            clearInterval(this.runIv);
            this.stage.destroy();
        }
    });
    return view;
});
