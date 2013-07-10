define(["baseBtn","tweenMax"],function(BaseBtn,TweenMax){
	var view = BaseBtn.extend({
		$img:null,
		$img2:null,
		init:function(args){
			BaseBtn.prototype.init.apply(this,[args]);
			this.$img = $(this.el).children('img').eq(0);
			this.$img2 = $(this.el).children('img').eq(1);
			this.$el.css({"position":"relative"});
			this.$img.css({"position":"absolute"});
			this.$img2.css({"position":"absolute","opacity":0});
		},
		mouseOverHandler:function(){
			if(this.isSelected) return;
			if(TweenMax.isTweening(this.$img)){
				TweenMax.killTweensOf(this.$img);
				TweenMax.killTweensOf(this.$img2);
			}
			TweenMax.to(this.$img, 0.2, {"opacity":0});
			TweenMax.to(this.$img2, 0.2, {"opacity":1});
		},
		mouseOutHandler:function(){
			if(this.isSelected) return;
			if(TweenMax.isTweening(this.$img)){
				TweenMax.killTweensOf(this.$img);
				TweenMax.killTweensOf(this.$img2);
			}
			TweenMax.to(this.$img, 0.2, {"opacity":1});
			TweenMax.to(this.$img2, 0.2, {"opacity":0});
		}
	});
	return view;
});