define(["basePage","siteModel","athena"],function(BasePage,SiteModel,Athena){
	var view = BasePage.extend({
		className:"pop",
		$main:null,
		$bg:null,
		events:{
			"click .pop_bg":"closeHandler",
			"click .close":"closeHandler"
		},
		init:function(args){
			BasePage.prototype.init.apply(this,[args]);
			
			this.$main = this.$el.find(".pop_main");
			this.$bg = this.$el.find(".pop_bg");
		},
		resize:function(){
			$(this.el).width(Athena.stageRect().width);
			$(this.el).height(Athena.stageRect().height);
			
			BasePage.prototype.resize.apply(this);
		},
		closeHandler:function(){
			Athena.pageOff(Athena.TOP);
		}
	});
	return view;
});