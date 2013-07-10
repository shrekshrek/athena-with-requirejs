define(["baseBtn","tweenMax"],function(BaseBtn,TweenMax){
	var view = BaseBtn.extend({
		init:function(args){
			BaseBtn.prototype.init.apply(this,[args]);
			this.$el.css({"opacity":0.8});
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