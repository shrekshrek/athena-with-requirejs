define(["athena","siteModel"],function(Athena,SiteModel){
	var view = Athena.view.BasePage.extend({
		className:"pop",
		$main:null,
		$bg:null,
		events:{
			"click .pop-bg":"closeHandler",
			"click .close":"closeHandler"
		},
		init:function(args){
			Athena.view.BasePage.prototype.init.apply(this,[args]);
			
			this.$main = this.$el.find(".pop-main");
			this.$bg = this.$el.find(".pop-bg");
		},
		resize:function(){
			this.$el.width(Athena.api.stageRect().width);
			this.$el.height(Athena.api.stageRect().height);
			
			Athena.view.BasePage.prototype.resize.apply(this);
		},
		closeHandler:function(){
			Athena.api.pageOff(Athena.TOP);
		}
	});
	return view;
});