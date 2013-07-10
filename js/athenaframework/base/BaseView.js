define(["backbone"],function(BackBone){
	var view = Backbone.View.extend({
		template:null,
		children:null,
		events:{
		},
		initialize:function(args){
			this.children = [];
			if((args && args.template)){
				this.template = args.template;
			}
			if(!(args && args.el)){
				this.render();
			}
			this.init(args);
		},
		init:function(args){
			
		},
		destroy:function(){
			_.each(this.children, function(obj){
				obj.destroy();
			});
			this.children = null;
			this.remove();
		},
		render:function(){
			if(this.template) $(this.el).html(this.template);
		},
		resize:function(){
			_.each(this.children, function(obj){
				obj.resize();
			});
		},
		addChild:function(view,$dom){
			_.each(this.children, function(obj){
				if(obj == view) return;
			});
			this.children.push(view);
			if($dom){
				$dom.append(view.el);
			}
		},
		removeChild:function(view){
			_.each(this.children, function(index,obj){
				if(obj == view) this.children.splice(index,1);
			});
		}
	});
	return view;
});


