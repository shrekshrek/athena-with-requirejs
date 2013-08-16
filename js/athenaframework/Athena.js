/*
 * version:0.0.2
 * date:2013.08.11
 * 
 * version:0.0.1
 * date:2013.06.13
 * 
 * authur:shrek.wang
 * Athena是一个基于Backbone的js前端框架，主要功能是通过SiteMap设置的网站结构
 */
define(["underscore","backbone","basePageConst"],function(_,Backbone,BasePageConst){
	var athena = _.extend({}, Backbone.Events, {
		/*
		 * 页面深度常量
		 * preload 相当于 z-index = 1000
		 * top 相当于 z-index = 500
		 * middle 相当于 z-index = 0
		 * bottom 相当于 z-index = -500
		 */
		PRELOAD:"preload",
		TOP:"top",
		MIDDLE:"middle",
		BOTTOM:"bottom",
		/* 
		 * 页面切换方式常量
		 * normal 为普通切换方式，1。当前页面退场。2。加载新页面。3。新页面进场。
		 * preload 为普通切换方式，1。加载新页面。2。当前页面退场。3。新页面进场。
		 * reverse 为普通切换方式，1。加载新页面。2。新页面进场。3。当前页面退场。
		 * cross 为普通切换方式，1。加载新页面。2。新页面进场。当前页面退场。同时进行。
		 */
		NORMAL:"normal",
		PRELOAD:"preload",
		REVERSE:"reverse",
		CROSS:"cross",
		/*
		 * 页面间切换状态常量
		 */
		FLOW_IN:"flowIn",
		FLOW_IN_COMPLETE:"flowInComplete",
		FLOW_OUT:"flowOut",
		FLOW_OUT_COMPLETE:"flowOutComplete",
		WINDOW_RESIZE:"windowResize",
		/*
		 * 其他参数
		 */
		$body:null,
		$stage:null,
		$window:null,
		_flow:null,
		_isFlowing:false,
		_isFullScreen:false,
		_windowRect:{width:0,height:0},
		_windowRectMin:{width:1,height:1},
		_stageRect:{width:0,height:0},
		_curPages:null,
		_tempPages:null,
		_tempDepths:null,
		_pageQueue:null,
		_preloader:null,
		_tempData:null,
		_tempIndex:null,
		_tempLoadedProgress:null,
		init:function(stage){
			this.$stage = stage?stage:$("body");
			this.$body = $("body");
			this.$window = $(window);
			
			this._flow = this.NORMAL;
			this._curPages = {};
			this._tempPages = {};
			this._tempDepths = {};
			this._pageQueue = [];
			
			var _self = this;
			this.$window.resize(function(){
				_self.resize();
			});
			this.resize();
		},
		pageTo:function(data){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			data = this._checkData(data);
			
			this._pageQueue.push(data);
			
			if(!this._isFlowing){
				this._playQueue();
			}
		},
		pageOn:function(data){
			this.pageTo(data);
		},
		pageOff:function(data){
			var _data = {};
			if(_.isObject(data)){
				_data.depth = this._checkDepth(data.depth);
			}else{
				_data.depth = this._checkDepth(data);
			}
			var _curPage = this._curPages[_data.depth];
			var _tempPage = this._tempPages[_data.depth];
			if(_tempPage){
				return;
			}
			
			if(_curPage){
				var _self = this;
				this.listenToOnce(_curPage, BasePageConst.TRANSITION_OUT_COMPLETE, function(){
					this._flowOutComplete(_data);
				});
				_curPage.transitionOut();
			}
		},
		_playQueue:function(){
			var _self = this;
			if(this._pageQueue.length >= 1){
				this._isFlowing = true;
				this._tempData = this._pageQueue.shift();
				this._tempIndex = 0;
				if(_.isArray(this._tempData)){
					this._tempLoadedProgress = [];
					_.each(this._tempData, function(_obj, _index){
						_self._flowIn(_obj);
					});
				}else{
					this._flowIn(this._tempData);
				}
			}
		},
		_checkData:function(data){
			var _self = this;
			if(_.isArray(data)){
				var _a = [];
				_.each(data,function(_obj,_index){
					if(!(_obj.view && _obj.template)) throw "each page data has wrong!!! must has 'data.view','data.template'";
					_obj.depth = _self._checkDepth(_obj.depth);
					
					var _isUnique = true;
					_.each(_a,function(_obj2, _index2){
						if(_obj.depth == _obj2.depth){
							_isUnique = false;
						}
					});
					
					if(_isUnique){
						_a.push(_obj);
					}
				});
				return _a;
			}else{
				if(!(data.view && data.template)) throw "page data has wrong!!! must has 'data.view','data.template'";
				data.depth = _self._checkDepth(data.depth);
				return data;
			}
		},
		_checkDepth:function(depth){
			var _depth = 0;
			
			if(_.isString(depth)){
				depth = depth.toLowerCase();
				var _plus = "";
				var _n = 0;
				var _n1 = depth.indexOf("+");
				var _n2 = depth.indexOf("-");
				var _max = Math.max(_n1,_n2);
				var _min = Math.min(_n1,_n2);
				
				if(_min >=0 ){
					_n = _min;
				}else{
					_n = _max;
				}
				
				if(_n > 0){
					_depth = depth.substring(0,_n);
					_plus = depth.substring(_n,_n+1);
				}else{
					_depth = depth;
				}
				
				switch(_depth)
				{
					case this.PRELOAD:
						_depth = 1000;
						break;
					case this.TOP:
						_depth = 500;
						break;
					case this.MIDDLE:
						_depth = 0;
						break;
					case this.BOTTOM:
						_depth = -500;
						break;
					default:
						_depth = 0;
				}
				
				switch(_plus){
					case "+":
						while(_depth<5000){
							_depth++;
							if(!this._curPages[_depth] && !this._tempPages[_depth] && !this._tempDepths[_depth]) break;
						}
						break;
					case "-":
						while(_depth>-5000){
							_depth--;
							if(!this._curPages[_depth] && !this._tempPages[_depth] && !this._tempDepths[_depth]) break;
						}
						break;
				}
				this._tempDepths[_depth] = 1;
			}
			
			if(_.isNumber(depth)){
				_depth = Math.floor(depth);
			}
			
			return _depth;
		},
		_flowIn:function(data){
			var _curPage = this._curPages[data.depth];
			var _tempPage = this._tempPages[data.depth];
			var _flow = data.flow?data.flow:this._flow;
			switch(_flow)
			{
				case this.NORMAL:
					if(_curPage)
					{
						this.listenToOnce(_curPage, BasePageConst.TRANSITION_OUT_COMPLETE, function(){
							this._flowInComplete(data);
						});
						_curPage.transitionOut();
					}else{
						this._flowInComplete(data);
					}
					break;
				case this.PRELOAD:
				case this.REVERSE:
				case this.CROSS:
					this._preloaderOn();
					
					var _self = this;
					require([data.view,"text!"+data.template],function(view,template){
						_self._tempPage = new view({template:_.template(template,{}),data:data});
						_self._tempPages[data.depth] = _self._tempPage;
						_self._initPreloader(data);
						
						_self.$stage.append(_self._tempPage.el);
						_self.listenToOnce(_self._tempPage, BasePageConst.PRELOAD_COMPLETE, function(){
							_self._preloadComplete(data);
						});
						_self._tempPage.preload();
					});
					break;
			}
			
			this.trigger(this.FLOW_IN, {data:data});
		},
		_flowInComplete:function(data){
			this.trigger(this.FLOW_IN_COMPLETE, {data:data});
			
			var _curPage = this._curPages[data.depth];
			var _tempPage = this._tempPages[data.depth];
			var _flow = data.flow?data.flow:this._flow;
			switch(_flow)
			{
				case this.NORMAL:
					this._preloaderOn();
					
					var _self = this;
					require([data.view,"text!"+data.template],function(view,template){
						_self._tempPage = new view({template:_.template(template,{}),data:data});
						_self._tempPages[data.depth] = _self._tempPage;
						_self._initPreloader(data);
						
						_self.$stage.append(_self._tempPage.el);
						_self.listenToOnce(_self._tempPage, BasePageConst.PRELOAD_COMPLETE, function(){
							_self._preloadComplete(data);
						});
						_self._tempPage.preload();
					});
					break;
				case this.PRELOAD:
					if(_curPage)
					{
						this.listenToOnce(_curPage, BasePageConst.TRANSITION_OUT_COMPLETE, function(){
							this._flowOut(data);
						});
						_curPage.transitionOut();
					}else{
						this._flowOut(data);
					}
					break;
				case this.REVERSE:
					this.listenToOnce(_tempPage, BasePageConst.TRANSITION_IN_COMPLETE, function(){
						this._flowOut(data);
					});
					_tempPage.transitionIn();
					break;
				case this.CROSS:
					if(_curPage)
					{
						_curPage.transitionOut();
					}
					this._flowOut(data);
					break;
			}
		},
		_flowOut:function(data){
			var _curPage = this._curPages[data.depth];
			var _tempPage = this._tempPages[data.depth];
			var _flow = data.flow?data.flow:this._flow;
			switch(_flow)
			{
				case this.NORMAL:
				case this.PRELOAD:
				case this.CROSS:
					this.listenToOnce(_tempPage, BasePageConst.TRANSITION_IN_COMPLETE, function(){
						this._flowOutComplete(data);
					});
					_tempPage.transitionIn();
					break;
				case this.REVERSE:
					if(_curPage)
					{
						this.listenToOnce(_curPage, BasePageConst.TRANSITION_OUT_COMPLETE, function(){
							this._flowOutComplete(data);
						});
						_curPage.transitionOut();
					}else{
						this._flowOutComplete(data);
					}
					break;
			}
			
			this.trigger(this.FLOW_OUT, {data:data});
		},
		_flowOutComplete:function(data){
			var _curPage = this._curPages[data.depth];
			var _tempPage = this._tempPages[data.depth];
			
			if(_curPage){
				//requirejs.undef(this._curPage.data.view);
				//requirejs.undef("text!"+this._curPage.data.template);
				_curPage.destroy();
			}
			
			if(_tempPage){
				this._curPages[data.depth] = _tempPage;
			}else{
				if(this._curPages[data.depth]) delete this._curPages[data.depth];
			}
			
			delete this._tempPages[data.depth];
			this.trigger(this.FLOW_OUT_COMPLETE, {data:data});
			
			delete this._tempDepths[data.depth];
			
			if(data.routing){
				document.title = data.routing;
			}
			
			if(_.isArray(this._tempData)){
				this._tempIndex++;
				if(this._tempIndex >= this._tempData.length){
					this._tempIndex = 0;
					this._isFlowing = false;
					this._playQueue();
				}
			}else{
				this._isFlowing = false;
				this._playQueue();
			}
			
		},
		_preloadComplete:function(data){
			var _self = this;
			var _flow = data.flow?data.flow:this._flow;
			if(_.isArray(this._tempData)){
				this._tempIndex++;
				if(this._tempIndex >= this._tempData.length){
					this._tempIndex = 0;
					_.each(this._tempData,function(_obj,_index){
						switch(_flow)
						{
							case _self.NORMAL:
								_self._flowOut(_obj);
								break;
							case _self.PRELOAD:
							case _self.REVERSE:
							case _self.CROSS:
								_self._flowInComplete(_obj);
								break;
						}
					});
				}
			}else{
				switch(_flow)
				{
					case _self.NORMAL:
						_self._flowOut(data);
						break;
					case _self.PRELOAD:
					case _self.REVERSE:
					case _self.CROSS:
						_self._flowInComplete(data);
						break;
				}
			}
		},
		preloader:function(data, obj){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			if(this._preloader != null){
				requirejs.undef(this._preloader.data.view);
				requirejs.undef("text!"+this._preloader.data.template);
				this._preloader.destroy();
				this._preloader = null;
			}
			
			if(!data){
				return;
			}
			
			data.depth = this._checkDepth(this.PRELOAD);
			var _self = this;
			if(data.view && data.template && data.template != ""){
				require([data.view,"text!"+data.template],function(view,template){
					_self._preloader = new view({template:_.template(template,{}),data:data});
					_self.$stage.append(_self._preloader.el);
					if(obj.complete && _.isFunction(obj.complete)) obj.complete();
				});
			}else{
				throw "preloader must have data.template!!!";
			}
		},
		_initPreloader:function(data){
			if(this._preloader == null) return;
			var _tempPage = this._tempPages[data.depth];
			//this.listenTo(_tempPage, BasePageConst.PRELOAD, this._preloaderOn);
			this.listenTo(_tempPage, BasePageConst.PRELOAD_PROGRESS, this._preloaderProgress);
			this.listenTo(_tempPage, BasePageConst.PRELOAD_COMPLETE, this._preloaderOff);
		},
		_clearPreloader:function(data){
			if(this._preloader == null) return;
			var _tempPage = this._tempPages[data.depth];
			//this.stopListening(_tempPage, BasePageConst.PRELOAD, this._preloaderOn);
			this.stopListening(_tempPage, BasePageConst.PRELOAD_PROGRESS, this._preloaderProgress);
			this.stopListening(_tempPage, BasePageConst.PRELOAD_COMPLETE, this._preloaderOff);
		},
		_preloaderOn:function(obj){
			if(this._preloader == null) return;
			var _self = this;
			if(_.isArray(this._tempData)){
				this._tempIndex++;
				if(this._tempIndex >= this._tempData.length){
					this._tempIndex = 0;
					this._preloader.transitionIn(obj);
				}
			}else{
				this._preloader.transitionIn(obj);
			}
		},
		_preloaderProgress:function(obj){
			if(this._preloader == null) return;
			var _self = this;
			if(_.isArray(this._tempData)){
				var _n = 0;
				this._tempLoadedProgress[obj.data.depth] = obj.progress;
				_.each(this._tempLoadedProgress, function(_obj,_index){
					_n += _obj/_self._tempData.length;
				});
				this._preloader.progress({progress:_n});
			}else{
				this._preloader.progress(obj);
			}
		},
		_preloaderOff:function(obj){
			if(this._preloader == null) return;
			this._clearPreloader(obj.data);
			var _self = this;
			if(_.isArray(this._tempData)){
				this._tempIndex++;
				if(this._tempIndex >= this._tempData.length){
					this._tempIndex = 0;
					this._preloader.transitionOut(obj);
				}
			}else{
				this._preloader.transitionOut(obj);
			}
		},
		getPage:function(data){
			var _page = null;
			_.each(this._curPages, function(_obj, _index){
				if(_obj.data == data){
					_page = _obj;
				}
			});
			return _page;
		},
		getPageAt:function(depth){
			var _depth = 0;
			if(depth) _depth = this._checkDepth(depth);
			return this._curPages[_depth];
		},
		fullScreen:function(bool){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			if(bool){
				if(_.isBoolean(bool)){
					this._isFullScreen = bool;
				}else{
					throw "setFullScreen params must be bool!!!";
				}
				this.resize();
			}
			
			return this._isFullScreen;
		},
		isFlowing:function(){
			return _isFlowing;
		},
		windowRect:function(){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			return this._windowRect;
		},
		windowRectMin:function(rect){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			if(rect){
				if(rect.width){
					this._windowRectMin.width = rect.width;
				}
				if(rect.height){
					this._windowRectMin.height = rect.height;
				}
				this.resize();
			}
			
			return this._windowRectMin;
		},
		stageRect:function(){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			return this._stageRect;
		},
		flow:function(str){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			if(str){
				str = str.toLowerCase();
				switch(str){
					case this.NORMAL:
					case this.PRELOAD:
					case this.REVERSE:
					case this.CROSS:
						this._flow = str;
					break;
				}
			}
			
			if(!this._flow) this._flow = this.NORMAL;
			
			return this._flow;
		},
		resize:function(){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			this._windowRect.width = $(window).width();
			this._windowRect.height = $(window).height();
			
			if(this._isFullScreen){
				if(this._windowRect.width < this._windowRectMin.width){
					this.$body.css("overflow-x","auto");
				}else{
					this.$body.css("overflow-x","hidden");
				}
				if(this._windowRect.height < this._windowRectMin.height){
					this.$body.css("overflow-y","auto");
				}else{
					this.$body.css("overflow-y","hidden");
				}
				this._stageRect.width = Math.max(this._windowRect.width, this._windowRectMin.width);
				this._stageRect.height = Math.max(this._windowRect.height, this._windowRectMin.height);
				this.$stage.width(this._stageRect.width);
				this.$stage.height(this._stageRect.height);
			}else{
				this.$body.css("overflow","auto");
				this._stageRect.width = $(document).width();
				this._stageRect.height = $(document).height();
			}
			
			this.trigger(this.WINDOW_RESIZE);
		}
	});
	return athena;
});
