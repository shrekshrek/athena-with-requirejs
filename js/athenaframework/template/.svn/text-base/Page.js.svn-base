define(["basePage","siteMap","siteModel","siteRouter","athena","tweenMax"],function(BasePage,SiteMap,SiteModel,SiteRouter,Athena,TweenMax){
	var view = BasePage.extend({
		id:"xxx",
		className:"page",
		init:function(args){
			BasePage.prototype.init.apply(this,[args]);
		},
		destroy:function(){
			BasePage.prototype.destroy.apply(this);
		},
		resize:function(){
			$(this.el).width(Athena.stageRect.width);
			$(this.el).height(Athena.stageRect.height);
			BasePage.prototype.resize.apply(this);
		},
		transitionIn:function(){
			BasePage.prototype.transitionIn.apply(this);
			var _self = this;
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:1, onComplete:function(){
				_self.transitionInComplete();
			}});
		},
		transitionOut:function(){
			BasePage.prototype.transitionOut.apply(this);
			var _self = this;
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:0, onComplete:function(){
				_self.transitionOutComplete();
			}});
		}
	});
	return view;
});
