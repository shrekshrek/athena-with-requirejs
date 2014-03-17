define(["athena","siteModel","tweenmax"],function(Athena,SiteModel,TweenMax){
	var view = Athena.view.BasePage.extend({
		id:"preloader",
		className:"pop",
		$bar:null,
		init:function(args){
			Athena.view.BasePage.prototype.init.apply(this,[args]);
			
			this.$bar = $(this.el).find("#loading-bar");
			
			this.$el.css({opacity:0});
		},
		resize:function(){
			Athena.view.BasePage.prototype.resize.apply(this);
		},
		transitionIn:function(){
			var _self = this;
			Athena.view.BasePage.prototype.transitionIn.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			this.$el.css({"display":"block"});
			TweenMax.to(this.$el, 0.5, {opacity:1, ease:Quart.easeOut, onComplete:function(){
				_self.transitionInComplete();
			}});

			this.$bar.css({width:0,left:"50%"});
		},
		transitionOut:function(){
			var _self = this;
			Athena.view.BasePage.prototype.transitionOut.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:0, ease:Quart.easeIn, onComplete:function(){
				_self.transitionOutComplete();
				_self.$el.css({"display":"none"});
			}});
		},
		progress:function(obj){
			if(TweenMax.isTweening(this.$bar)) TweenMax.killTweensOf(this.$bar);
			TweenMax.to(this.$bar, 0.3, {width:obj.progress*100+"%", left:(1-obj.progress)*0.5*100+"%"});
		}
	});
	return view;
});
