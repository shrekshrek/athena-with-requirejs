define(["backbone"],function(BackBone){
	var model = _.extend({}, Backbone.Events, {
		url:"",
		
		shareContent:"",
		shareUrl:"",
		shareImg:"",
		shareVideo:"",
		
	});
	return model;
});