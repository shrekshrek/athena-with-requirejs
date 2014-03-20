define(["athena","tweenmax","scroller","jquery.mousewheel"],function(Athena,TweenMax,Scroller){
	var view = BaseView.extend({
		init:function(){
			Athena.view.BaseView.prototype.init.apply(this);
		},
		destroy:function(){
			Athena.view.BaseView.prototype.destroy.apply(this);
		}
	});
	return view;
});