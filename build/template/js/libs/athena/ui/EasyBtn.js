define(["baseBtn","tweenmax"],function(BaseBtn,TweenMax){
	var view = BaseBtn.extend({
		$obj1:null,
		$obj2:null,
		alpha1:[1,0],
		alpha2:[0,1],
		time:0.2,
		init:function(args){
			BaseBtn.prototype.init.apply(this,[args]);
			if(args.time){
				this.time = args.time;
			}
			if(args.alpha){
				if(args.alpha[0]) this.alpha1 = args.alpha[0];
				if(args.alpha[1]) this.alpha2 = args.alpha[1];
			}
			this.$obj1 = $(this.el).children('.normal');
			this.$obj2 = $(this.el).children('.hover');
			if(this.$obj1) this.$obj1.css({"opacity":this.alpha1[0]});
			if(this.$obj2) this.$obj2.css({"opacity":this.alpha2[0]});
		},
		mouseOverHandler:function(){
			if(this._isSelected) return;
			if(this.$obj1){
				if(TweenMax.isTweening(this.$obj1)) TweenMax.killTweensOf(this.$obj1);
				TweenMax.to(this.$obj1, this.time, {autoAlpha:this.alpha1[1]});
			}
			if(this.$obj2){
				if(TweenMax.isTweening(this.$obj2)) TweenMax.killTweensOf(this.$obj2);
				TweenMax.to(this.$obj2, this.time, {autoAlpha:this.alpha2[1]});
			}
		},
		mouseOutHandler:function(){
			if(this._isSelected) return;
			if(this.$obj1){
				if(TweenMax.isTweening(this.$obj1)) TweenMax.killTweensOf(this.$obj1);
				TweenMax.to(this.$obj1, this.time, {autoAlpha:this.alpha1[0]});
			}
			if(this.$obj2){
				if(TweenMax.isTweening(this.$obj2)) TweenMax.killTweensOf(this.$obj2);
				TweenMax.to(this.$obj2, this.time, {autoAlpha:this.alpha2[0]});
			}
		}
	});
	return view;
});