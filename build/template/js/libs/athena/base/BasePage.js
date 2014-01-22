define(["baseView","basePageConst","athena"],function(BaseView,BasePageConst,Athena){
	var view = BaseView.extend({
		loadMax:null,
		loaded:null,
		data:null,
		initialize:function(args){
			BaseView.prototype.initialize.apply(this,[args]);
			
			this.data = args.data;
			this.$el.css({"z-index":this.data.depth});
			this.preloadArray = [];
		},
		init:function(args){
			BaseView.prototype.init.apply(this,[args]);
			
			this.listenTo(Athena, Athena.WINDOW_RESIZE, function(){
				this.resize();
			});
		},
		destroy:function(){
			BaseView.prototype.destroy.apply(this);
		},
		preload:function(skip){
			this.trigger(BasePageConst.PRELOAD, {data:this.data});
			
			if(skip){
				this.completeHandle();
				return;
			}
			
			var _self = this;
			var _imgs = _.without(_.pluck(this.$el.find("img"),"src"),"");
			this.loadMax = _imgs.length;
			this.loaded = 0;
			if(this.loadMax == 0){ 
				this.completeHandle();
			}else{
				_.each(_imgs, function(url){
					$(new Image()).load(function(){
						_self._assetLoadComplete();
				    }).error(function() {
				    	_self._assetLoadComplete();
					}).attr("src", url);
				});
			}
		},
		_assetLoadComplete:function(){
			this.loaded++;
			this.progressHandle(this.loaded/this.loadMax);
			if(this.loaded >= this.loadMax){
				this.completeHandle();
			}
		},
		progressHandle:function (obj) {
			this.trigger(BasePageConst.PRELOAD_PROGRESS, {data:this.data, progress:obj});
		},
		completeHandle:function () {
			this.trigger(BasePageConst.PRELOAD_COMPLETE, {data:this.data});
		},
		transitionIn:function(){
			//this.$el.css({"display":"block"});
			this.resize();
			this.trigger(BasePageConst.TRANSITION_IN, {data:this.data});
		},
		transitionInComplete:function(){
			this.trigger(BasePageConst.TRANSITION_IN_COMPLETE, {data:this.data});
		},
		transitionOut:function(){
			this.trigger(BasePageConst.TRANSITION_OUT, {data:this.data});
		},
		transitionOutComplete:function(){
			//this.$el.css({"display":"none"});
			this.trigger(BasePageConst.TRANSITION_OUT_COMPLETE, {data:this.data});
		}
	});
	return view;
});


