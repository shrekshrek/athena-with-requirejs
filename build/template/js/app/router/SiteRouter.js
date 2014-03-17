define(["backbone","athena","siteMap"],function(BackBone,Athena,SiteMap){
	var router = Backbone.Router.extend({
		routes: {
			"*actions":"defaultRoute"
		},
		defaultRoute:function(actions){
			switch(actions){
				case null:
					this.navigate(SiteMap.home.title, {trigger: true});
				break;
				default:
					var _action = actions.split("?")[0];
					_.each(SiteMap, function(obj, index){
						if(_action == obj.title){
							if(Athena.api.getPage(SiteMap.header)){
								Athena.api.pageTo(obj);
							}else{
								Athena.api.pageTo([SiteMap.header,SiteMap.footer,obj]);
							}
						}
					});
				break;
			}
		}
	});
	return new router;
});