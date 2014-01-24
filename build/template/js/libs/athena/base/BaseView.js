define(["backbone"],function(BackBone){
	var view = Backbone.View.extend({
		template:null,
		children:null,
		_inited:null,
		events:{
		},
		initialize:function(args){
			this.children = [];
			if(!args) return;
			if(args.template){
				this.template = args.template;
			}
			if(args.el){
				this.init(args);
			}else{
				this.render();
			}
		},
		init:function(args){
			if(this._inited) return;
			this._inited = true;
		},
		destroy:function(){
			_.each(this.children, function(obj){
				obj.destroy();
			});
			this.children = null;
			this.remove();
		},
		render:function(){
			if(this.template) this.$el.html(this.template);
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
				view.init();
			}
		},
		removeChild:function(view){
			_.each(this.children, function(index,obj){
				if(obj == view){
					this.children.splice(index,1);
					view.destroy();
					return;
				}
			});
		}
	});
	return view;
});


