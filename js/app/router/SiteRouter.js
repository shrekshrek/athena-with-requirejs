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
				case SiteMap.home.title:
					Athena.pageTo(SiteMap.home);
					break;
				case SiteMap.works.title:
					Athena.pageTo(SiteMap.works);
					break;
			}
		}
	});
	return new router;
});