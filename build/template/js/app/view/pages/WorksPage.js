define(["tracker","basePage","athena","siteMap","siteModel","siteRouter","tweenmax"],function(Tracker,BasePage,Athena,SiteMap,SiteModel,SiteRouter,TweenMax){
	var view = BasePage.extend({
		id:"works-page",
		className:"page",
		init:function(args){
			BasePage.prototype.init.apply(this,[args]);

			this.$el.css({opacity:0});
		},
		destroy:function(){
			BasePage.prototype.destroy.apply(this);
		},
		resize:function(){
			BasePage.prototype.resize.apply(this);
		},
		transitionIn:function(){
			var _self = this;
			BasePage.prototype.transitionIn.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:1, ease:Quart.easeOut, onComplete:function(){
				_self.transitionInComplete();
			}});
		},
		transitionOut:function(){
			var _self = this;
			BasePage.prototype.transitionOut.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:0, ease:Quart.easeIn, onComplete:function(){
				_self.transitionOutComplete();
			}});
		}
	});
	return view;
});
