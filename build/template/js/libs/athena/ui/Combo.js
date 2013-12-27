define(["baseView","tweenmax","scroller","jquery.mousewheel"],function(BaseView,TweenMax,Scroller){
	var self;
	var view = BaseView.extend({
		init:function(args){
			self = this;
			BaseView.prototype.init.apply(this,[args]);
			
		},
		destroy:function(){
			BaseView.prototype.destroy.apply(this);
		}
	});
	return view;
});