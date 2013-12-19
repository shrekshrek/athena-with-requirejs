define(["basePage","athena","siteModel","tweenmax"],function(BasePage,Athena,SiteModel,TweenMax){
	var self;
	var view = BasePage.extend({
		id:"preloader",
		className:"pop",
		$bar:null,
		init:function(args){
			self = this;
			BasePage.prototype.init.apply(this,[args]);
			
			this.$bar = $(this.el).find(".loading_bar");
			
			this.$el.css({opacity:0});
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
			
			this.$bar.css({width:0, left:Athena.stageRect().width/2});
		},
		transitionOut:function(){
			BasePage.prototype.transitionOut.apply(this);
			
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:0, ease:Quart.easeIn, onComplete:function(){
				self.transitionOutComplete();
			}});
		},
		progress:function(obj){
			if(TweenMax.isTweening(this.$bar)) TweenMax.killTweensOf(this.$bar);
			TweenMax.to(this.$bar, 0.3, {width:Athena.stageRect().width*obj.progress, left:Athena.stageRect().width*(1-obj.progress)*0.5});
		}
	});
	return view;
});
