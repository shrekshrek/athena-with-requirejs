define(["baseBtn","tweenMax"],function(BaseBtn,TweenMax){
	var view = BaseBtn.extend({
		$img:null,
		$img2:null,
		init:function(args){
			BaseBtn.prototype.init.apply(this,[args]);
			this.$img = $(this.el).children('.normal');
			this.$img2 = $(this.el).children('.hover');
			this.$img2.css({"opacity":0});
		},
		mouseOverHandler:function(){
			if(this._isSelected) return;
			if(TweenMax.isTweening(this.$img)){
				TweenMax.killTweensOf(this.$img);
				TweenMax.killTweensOf(this.$img2);
			}
			TweenMax.to(this.$img, 0.2, {"opacity":0});
			TweenMax.to(this.$img2, 0.2, {"opacity":1});
		},
		mouseOutHandler:function(){
			if(this._isSelected) return;
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