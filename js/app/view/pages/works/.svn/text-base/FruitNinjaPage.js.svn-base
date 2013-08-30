define(["basePage","siteMap","siteModel","siteRouter","athena","tweenMax","fruitNinja"],function(BasePage,SiteMap,SiteModel,SiteRouter,Athena,TweenMax,FruitNinja){
	var view = BasePage.extend({
		id:"fruitNinja_page",
		className:"page",
		game:null,
		init:function(args){
			BasePage.prototype.init.apply(this,[args]);
			
			this.game = new FruitNinja({el:this.$el.find("#stageCanvas")});
			this.addChild(this.game);
		},
		destroy:function(){
			BasePage.prototype.destroy.apply(this);
		},
		resize:function(){
			this.$el.width(Athena.stageRect().width);
			this.$el.height(Athena.stageRect().height);
			
			this.game.setSize({width:Athena.stageRect().width,height:Athena.stageRect().height});
			
			BasePage.prototype.resize.apply(this);
		},
		transitionIn:function(){
			BasePage.prototype.transitionIn.apply(this);
			var _self = this;
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.3, {opacity:1, ease:Linear.easeNone, onComplete:function(){
				_self.game.initCanvas();
				_self.transitionInComplete();
			}});
		},
		transitionOut:function(){
			this.game.clearCanvas();
				
			BasePage.prototype.transitionOut.apply(this);
			var _self = this;
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.3, {opacity:0, ease:Linear.easeNone, onComplete:function(){
				_self.transitionOutComplete();
			}});
		}
	});
	return view;
});
