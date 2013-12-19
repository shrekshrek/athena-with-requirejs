/*
 * authur:shrek.wang
 * git:https://github.com/shrekshrek/athenaframework
 */
define(["underscore","backbone","basePageConst"],function(_,Backbone,BasePageConst){
	var self;
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
		FLOW_START:"flowStart",
		FLOW_COMPLETE:"flowComplete",
		WINDOW_RESIZE:"windowResize",
		PRELOAD_PREPARE:"preloadPrepare",
		/*
		 * 其他参数
		 */
		$body:null,
		$stage:null,
		$window:null,
		$document:null,
		_flow:null,
		_isFlowing:false,
		_isFullScreen:false,
		_windowRect:{width:0,height:0},
		_windowRectMin:{width:1,height:1},
		_stageRect:{width:0,height:0},
		_curPages:null,
		_tempPages:null,
		_pageQueue:null,
		_preloader:null,
		_tempData:null,
		_tempFlowIndex:null,
		_tempPreloadIndex:null,
		_tempLoadedProgress:null,
		init:function(stage){
			self = this;
			this.$stage = stage?stage:$("body");
			this.$body = $("body");
			this.$window = $(window);
			this.$document = $(document);
			
			this._flow = this.NORMAL;
			this._curPages = {};
			this._tempPages = {};
			this._pageQueue = [];
			
			this.$window.resize(function(){
				self.resize();
			});
			this.resize();
		},
		pageTo:function(data){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			data = this._checkData(data);
			this._pageQueue.push(data);
			
			if(this._isFlowing) return;
			
			this._playQueue();
		},
		pageOn:function(data){
			this.pageTo(data);
		},
		pageOff:function(data){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			if(this._isFlowing) return;
			
			this._isFlowing = true;
			this._tempData = data;
			
			var _page = null;
			var _data = {};
			if(_.isArray(data)){
				_.each(data, function(_obj, _index){
					_obj.depth = self._checkDepth(_obj.depth);
					_page = self._curPages[_obj.depth];
					self.listenToOnce(_page, BasePageConst.TRANSITION_OUT_COMPLETE, function(){
						self._flowOutComplete(_data);
					});
					_page.transitionOut();
				});
			}else{
				if(_.isString(data)){
					_data.depth = self._checkDepth(data);
				}else{
					_data.depth = self._checkDepth(data.depth);
				}
				_page = self._curPages[_data.depth];
				self.listenToOnce(_page, BasePageConst.TRANSITION_OUT_COMPLETE, function(){
					self._flowOutComplete(_data);
				});
				_page.transitionOut();
			}
		},
		_playQueue:function(){
			if(this._pageQueue.length >= 1){
				this._tempData = this._pageQueue.shift();
				this._isFlowing = true;
				this._tempFlowIndex = 0;
				this._tempPreloadIndex = 0;
				if(_.isArray(this._tempData)){
					this._tempLoadedProgress = [];
					_.each(this._tempData, function(_obj, _index){
						self._flowIn(_obj);
					});
				}else{
					this._flowIn(this._tempData);
				}
				this.trigger(this.FLOW_START, {data:this._tempData});
			}else{
				this._tempData = null;
				this._isFlowing = false;
			}
		},
		_checkData:function(data){
			if(_.isArray(data)){
				var _a = [];
				_.each(data,function(_obj,_index){
					if(!(_obj.view && _obj.template)) throw "each page data has wrong!!! must has 'data.view','data.template'";
					_obj.depth = self._checkDepth(_obj.depth);
					
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
				data.depth = self._checkDepth(data.depth);
				return data;
			}
		},
		calcDepth:function(depth){
			return this._checkDepth(depth);
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
				var _num = 0;
				
				if(_min >=0 ){
					_n = _min;
				}else{
					_n = _max;
				}
				
				if(_n > 0){
					_depth = depth.substring(0,_n);
					_plus = depth.substring(_n,_n+1);
					_num = parseInt(depth.substring(_n+1));
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
						_depth += _num;
						break;
					case "-":
						_depth -= _num;
						break;
				}
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
							self._flowInComplete(data);
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
					
					require([data.view,"text!"+data.template],function(view,template){
						self._tempPage = new view({template:_.template(template.html?template.html:template,{}),data:data});
						self._tempPages[data.depth] = self._tempPage;
						self._initPreloader(data);
						
						self.$stage.append(self._tempPage.el);
						self.listenToOnce(self._tempPage, BasePageConst.PRELOAD_COMPLETE, function(){
							self._preloadComplete(data);
						});
						self._tempPage.preload();
					});
					break;
			}
		},
		_flowInComplete:function(data){
			var _curPage = this._curPages[data.depth];
			var _tempPage = this._tempPages[data.depth];
			var _flow = data.flow?data.flow:this._flow;
			switch(_flow)
			{
				case this.NORMAL:
					if(_curPage) _curPage.destroy();
					this._preloaderOn();
					require([data.view,"text!"+data.template],function(view,template){
						self._tempPage = new view({template:_.template(template.html?template.html:template,{}),data:data});
						self._tempPages[data.depth] = self._tempPage;
						self._initPreloader(data);
						
						self.$stage.append(self._tempPage.el);
						self.listenToOnce(self._tempPage, BasePageConst.PRELOAD_COMPLETE, function(){
							self._preloadComplete(data);
						});
						self._tempPage.preload();
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
					this.listenToOnce(_tempPage, BasePageConst.TRANSITION_IN_COMPLETE, function(){
						this._flowOutComplete(data);
					});
					_tempPage.transitionIn();
					break;
				case this.PRELOAD:
					if(_curPage) _curPage.destroy();
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
				case this.CROSS:
					this.listenToOnce(_tempPage, BasePageConst.TRANSITION_IN_COMPLETE, function(){
						this._flowOutComplete(data);
					});
					_tempPage.transitionIn();
					break;
			}
		},
		_flowOutComplete:function(data){
			var _curPage = this._curPages[data.depth];
			var _tempPage = this._tempPages[data.depth];
			var _flow = data.flow?data.flow:this._flow;
			switch(_flow)
			{
				case this.REVERSE:
				case this.CROSS:
					if(_curPage){
						_curPage.destroy();
						//requirejs.undef(this._curPage.data.view);
						//requirejs.undef("text!"+this._curPage.data.template);
					}
					break;
			}
			
			if(_tempPage){
				this._curPages[data.depth] = _tempPage;
			}else{
				if(this._curPages[data.depth]) delete this._curPages[data.depth];
			}
			
			delete this._tempPages[data.depth];
			
			if(data.routing){
				document.title = data.routing;
			}
			
			if(_.isArray(this._tempData)){
				this._tempFlowIndex++;
				if(this._tempFlowIndex >= this._tempData.length){
					this.trigger(this.FLOW_COMPLETE, {data:this._tempData});
					this._playQueue();
				}
			}else{
				this.trigger(this.FLOW_COMPLETE, {data:this._tempData});
				this._playQueue();
			}
		},
		_preloadComplete:function(data){
			var _flow = data.flow?data.flow:this._flow;
			if(_.isArray(this._tempData)){
				this._tempFlowIndex++;
				if(this._tempFlowIndex >= this._tempData.length){
					this._tempFlowIndex = 0;
					setTimeout(function(){
						_.each(self._tempData,function(_obj,_index){
							switch(_flow)
							{
								case self.NORMAL:
									self._flowOut(_obj);
									break;
								case self.PRELOAD:
								case self.REVERSE:
								case self.CROSS:
									self._flowInComplete(_obj);
									break;
							}
						});
					},10);
				}
			}else{
				setTimeout(function(){
					switch(_flow)
					{
						case self.NORMAL:
							self._flowOut(data);
							break;
						case self.PRELOAD:
						case self.REVERSE:
						case self.CROSS:
							self._flowInComplete(data);
							break;
					}
				},10);
			}
		},
		preloader:function(data, obj){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			if(this._preloader != null){
				//requirejs.undef(this._preloader.data.view);
				//requirejs.undef("text!"+this._preloader.data.template);
				this._preloader.destroy();
				this._preloader = null;
			}
			
			if(!data){
				return;
			}
			
			data.depth = this._checkDepth(this.PRELOAD);
			if(data.view && data.template && data.template != ""){
				require([data.view,"text!"+data.template],function(view,template){
					self._preloader = new view({template:_.template(template.html?template.html:template,{}),data:data});
					self.$stage.append(self._preloader.el);
					//if(obj.complete && _.isFunction(obj.complete)) obj.complete();
					self.trigger(self.PRELOAD_PREPARE);
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
			if(_.isArray(this._tempData)){
				this._tempPreloadIndex++;
				if(this._tempPreloadIndex >= this._tempData.length){
					this._tempPreloadIndex = 0;
					this._preloader.transitionIn(obj);
				}
			}else{
				this._preloader.transitionIn(obj);
			}
		},
		_preloaderProgress:function(obj){
			if(this._preloader == null) return;
			if(_.isArray(this._tempData)){
				var _n = 0;
				this._tempLoadedProgress[obj.data.depth] = obj.progress;
				_.each(this._tempLoadedProgress, function(_obj,_index){
					_n += _obj/self._tempData.length;
				});
				this._preloader.progress({progress:_n});
			}else{
				this._preloader.progress(obj);
			}
		},
		_preloaderOff:function(obj){
			if(this._preloader == null) return;
			this._clearPreloader(obj.data);
			if(_.isArray(this._tempData)){
				this._tempPreloadIndex++;
				if(this._tempPreloadIndex >= this._tempData.length){
					this._tempPreloadIndex = 0;
					this._preloader.transitionOut(obj);
				}
			}else{
				this._preloader.transitionOut(obj);
			}
		},
		getPage:function(data){
			var _page = null;
			_.each(this._tempPages, function(_obj, _index){
				if(_obj.data == data){
					_page = _obj;
				}
			});
			if(_page) return _page;
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
			var _page = this._tempPages[_depth];
			if(_page) return _page;
			var _page = this._curPages[_depth];
			return _page;
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
			
			this._windowRect.width = this.$window.width();
			this._windowRect.height = this.$window.height();
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
				this._windowRect.width = this.$window.width();
				this._windowRect.height = this.$window.height();
				this._stageRect.width = Math.max(this._windowRect.width, this._windowRectMin.width);
				this._stageRect.height = Math.max(this._windowRect.height, this._windowRectMin.height);
				this.$stage.width(this._stageRect.width);
				this.$stage.height(this._stageRect.height);
			}else{
				this.$body.css("overflow","auto");
				this._windowRect.width = this.$window.width();
				this._windowRect.height = this.$window.height();
				this._stageRect.width = this.$document.width();
				this._stageRect.height = this.$document.height();
			}
			
			this.trigger(this.WINDOW_RESIZE);
		}
	});
	return athena;
});
