define(["tracker","basePage","athena","siteMap","siteModel","siteRouter","tweenmax"],function(Tracker,BasePage,Athena,SiteMap,SiteModel,SiteRouter,TweenMax){
	var self;
	var view = BasePage.extend({
		id:"works-page",
		className:"page",
		init:function(args){
			self = this;
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
			BasePage.prototype.transitionIn.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:1, ease:Quart.easeOut, onComplete:function(){
				self.transitionInComplete();
			}});
		},
		transitionOut:function(){
			BasePage.prototype.transitionOut.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:0, ease:Quart.easeIn, onComplete:function(){
				self.transitionOutComplete();
			}});
		}
	});
	return view;
});
