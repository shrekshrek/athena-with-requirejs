define(["tracker","athena","siteMap","siteModel","siteRouter","tweenmax","scroller"],function(Tracker,Athena,SiteMap,SiteModel,SiteRouter,TweenMax,Scroller){
	var view = Athena.view.BasePage.extend({
		id:"works-page",
		className:"page",
		init:function(args){
			Athena.view.BasePage.prototype.init.apply(this,[args]);
			
			this.scroller = new Scroller({el:this.$el.find("#content"),bar:this.$el.find(".scroll-bar")});
			this.addChild(this.scroller);
			
			this.$el.css({opacity:0});
		},
		destroy:function(){
			Athena.view.BasePage.prototype.destroy.apply(this);
		},
		resize:function(){
			Athena.view.BasePage.prototype.resize.apply(this);
		},
		transitionIn:function(){
			var _self = this;
			Athena.view.BasePage.prototype.transitionIn.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:1, ease:Quart.easeOut, onComplete:function(){
				_self.transitionInComplete();
			}});
			
			this.scroller.update();
		},
		transitionOut:function(){
			var _self = this;
			Athena.view.BasePage.prototype.transitionOut.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:0, ease:Quart.easeIn, onComplete:function(){
				_self.transitionOutComplete();
			}});
		}
	});
	return view;
});
