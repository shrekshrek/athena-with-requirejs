define(["baseView","tweenmax","scroller","jquery.mousewheel"],function(BaseView,TweenMax,Scroller){
	var view = BaseView.extend({
		init:function(args){
			BaseView.prototype.init.apply(this,[args]);
			
		},
		destroy:function(){
			BaseView.prototype.destroy.apply(this);
		}
	});
	return view;
});