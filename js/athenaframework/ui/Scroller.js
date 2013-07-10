define(["baseView","tweenMax"],function(BaseView,TweenMax){
	var view = BaseView.extend({
		$scrollContent:null,
		$dragBox:null,
		$dragBg:null,
		init:function(args){
			BaseView.prototype.init.apply(this,[args]);
			this.$scrollContent = this.$el.find(".scrollContent");
			this.$dragBox = this.$el.find(".dragBox");
			this.$dragBg = this.$el.find(".dragBg");
		},
		destroy:function(){
			BaseView.prototype.destroy.apply(this);
			
		},
		mouseOverHandler:function(){
			if(this.isSelected) return;
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.2, {"opacity":1});
		},
		mouseOutHandler:function(){
			if(this.isSelected) return;
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.2, {"opacity":0.8});
		}
	});
	return view;
});