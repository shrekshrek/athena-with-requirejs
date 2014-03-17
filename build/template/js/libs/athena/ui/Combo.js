define(["athena","tweenmax","scroller","jquery.mousewheel"],function(Athena,TweenMax,Scroller){
	var view = BaseView.extend({
		init:function(args){
			Athena.view.BaseView.prototype.init.apply(this,[args]);
		},
		destroy:function(){
			Athena.view.BaseView.prototype.destroy.apply(this);
		}
	});
	return view;
});