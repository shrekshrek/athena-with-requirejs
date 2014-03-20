define(["tracker","basePop","athena","siteMap","siteModel","siteRouter","tweenmax"],function(Tracker,BasePop,Athena,SiteMap,SiteModel,SiteRouter,TweenMax){
	var view = BasePop.extend({
		id:"tips-pop",
		init:function(){
			BasePop.prototype.init.apply(this);
			this.$el.css({opacity:0});
		},
		resize:function(){
			BasePop.prototype.resize.apply(this);
		},
		transitionIn:function(){
			var _self = this;
			BasePop.prototype.transitionIn.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.3, {opacity:1, ease:Linear.ease, onComplete:function(){
				_self.transitionInComplete();
			}});
		},
		transitionOut:function(){
			var _self = this;
			BasePop.prototype.transitionOut.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.3, {opacity:0, ease:Linear.ease, onComplete:function(){
				_self.transitionOutComplete();
			}});
		},
		closeHandler:function(){
			BasePop.prototype.closeHandler.apply(this);
		}
	});
	return view;
});
