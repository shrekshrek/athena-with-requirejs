/*
 * authur:shrek.wang
 * git:https://github.com/shrekshrek/athenaframework
 */

(function(root, factory) {

	root.Athena = factory(root, {}, root._, root.Backbone, (root.jQuery || root.Zepto || root.ender || root.$));

}(this, function(root, Athena, _, Backbone, $) {
	
	var previousAthena = root.Athena;
	
	var array = [];
	var push = array.push;
	var slice = array.slice;
	var splice = array.splice;
	
	Athena.VERSION = '1.0.1';
	
	Athena.noConflict = function() {
		root.Athena = previousAthena;
		return this;
	};
	
	/*
	 * 框架事件名
	 */
	_.extend(Athena, {
		PRELOAD:"preload",
		PRELOAD_PROGRESS:"preloadProgress",
		PRELOAD_COMPLETE:"preloadComplete",
		TRANSITION_IN:"transitionIn",
		TRANSITION_IN_COMPLETE:"transitionInComplete",
		TRANSITION_OUT:"transitionOut",
		TRANSITION_OUT_COMPLETE:"transitionOutComplete",
		
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
		PRELOAD_PREPARE:"preloadPrepare"
	});
	
	/*
	 * 框架主控制器逻辑
	 */
	_.extend(Athena, Backbone.Events, {
		$body:null,
		$stage:null,
		$window:null,
		$document:null,
		_preloadFast:null,
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
			var _self = this;
			this.$stage = stage?stage:$("body");
			this.$body = $("body");
			this.$window = $(window);
			this.$document = $(document);
			
			this._preloadFast = false;
			this._flow = this.NORMAL;
			this._curPages = {};
			this._tempPages = {};
			this._pageQueue = [];
			
			this.$window.resize(function(){
				_self.resize();
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

			var _self = this;
			this._isFlowing = true;
			this._tempData = data;
			
			var _page = null;
			var _data = {};
			if(_.isArray(data)){
				_.each(data, function(_obj, _index){
					_obj.depth = _self._checkDepth(_obj.depth);
					_page = _self._curPages[_obj.depth];
					_self.listenToOnce(_page, _self.TRANSITION_OUT_COMPLETE, function(){
						_self._flowOutComplete(_data);
					});
					_page.transitionOut();
				});
			}else{
				if(_.isString(data)){
					_data.depth = _self._checkDepth(data);
				}else{
					_data.depth = _self._checkDepth(data.depth);
				}
				_page = _self._curPages[_data.depth];
				_self.listenToOnce(_page, _self.TRANSITION_OUT_COMPLETE, function(){
					_self._flowOutComplete(_data);
				});
				_page.transitionOut();
			}
		},
		_playQueue:function(){
			var _self = this;
			if(this._pageQueue.length >= 1){
				this._tempData = this._pageQueue.shift();
				this._isFlowing = true;
				this._tempFlowIndex = 0;
				this._tempPreloadIndex = 0;
				if(_.isArray(this._tempData)){
					this._tempLoadedProgress = [];
					_.each(this._tempData, function(_obj, _index){
						_self._flowIn(_obj);
					});
				}else{
					this._flowIn(this._tempData);
				}
				_self.trigger(_self.FLOW_START, {data:this._tempData});
			}else{
				this._tempData = null;
				this._isFlowing = false;
			}
		},
		_checkData:function(data){
			var _self = this;
			if(_.isArray(data)){
				var _a = [];
				_.each(data,function(_obj,_index){
					if(!(_obj.view && _obj.tpl)) throw "each page data has wrong!!! must has 'data.view','data.tpl'";
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
				if(!(data.view && data.tpl)) throw "page data has wrong!!! must has 'data.view','data.tpl'";
				data.depth = _self._checkDepth(data.depth);
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
			var _self = this;
			var _curPage = this._curPages[data.depth];
			var _tempPage = this._tempPages[data.depth];
			var _flow = data.flow?data.flow:this._flow;
			switch(_flow)
			{
				case this.NORMAL:
					if(_curPage)
					{
						this.listenToOnce(_curPage, this.TRANSITION_OUT_COMPLETE, function(){
							_self._flowInComplete(data);
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
					
					require([data.view, data.css?"css!"+data.css:"", "text!"+data.tpl],function(view, css, tpl){
						_self._tempPage = new view({template:_.template(tpl.html?tpl.html:tpl,{}),data:data});
						_self._tempPages[data.depth] = _self._tempPage;
						_self.$stage.append(_self._tempPage.el);
						_self._tempPage.init();
						_self._initPreloader(data);
						_self.listenToOnce(_self._tempPage, _self.PRELOAD_COMPLETE, function(){
							_self._preloadComplete(data);
						});
						_self._tempPage.preload(_self._preloadFast||data.fast=="true");
					});
					break;
			}
		},
		_flowInComplete:function(data){
			var _self = this;
			var _curPage = this._curPages[data.depth];
			var _tempPage = this._tempPages[data.depth];
			var _flow = data.flow?data.flow:this._flow;
			switch(_flow)
			{
				case this.NORMAL:
					this._preloaderOn();
					require([data.view, data.css?"css!"+data.css:"", "text!"+data.tpl],function(view, css, tpl){
						_self._tempPage = new view({template:_.template(tpl.html?tpl.html:tpl,{}),data:data});
						_self._tempPages[data.depth] = _self._tempPage;
						_self.$stage.append(_self._tempPage.el);
						_self._tempPage.init();
						_self._initPreloader(data);
						_self.listenToOnce(_self._tempPage, _self.PRELOAD_COMPLETE, function(){
							_self._preloadComplete(data);
						});
						_self._tempPage.preload(_self._preloadFast||data.fast=="true");
					});
					break;
				case this.PRELOAD:
					if(_curPage)
					{
						this.listenToOnce(_curPage, this.TRANSITION_OUT_COMPLETE, function(){
							_self._flowOut(data);
						});
						_curPage.transitionOut();
					}else{
						this._flowOut(data);
					}
					break;
				case this.REVERSE:
					this.listenToOnce(_tempPage, this.TRANSITION_IN_COMPLETE, function(){
						_self._flowOut(data);
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
			var _self = this;
			var _curPage = this._curPages[data.depth];
			var _tempPage = this._tempPages[data.depth];
			var _flow = data.flow?data.flow:this._flow;
			switch(_flow)
			{
				case this.NORMAL:
					this.listenToOnce(_tempPage, this.TRANSITION_IN_COMPLETE, function(){
						_self._flowOutComplete(data);
					});
					_tempPage.transitionIn();
					break;
				case this.PRELOAD:
					this.listenToOnce(_tempPage, this.TRANSITION_IN_COMPLETE, function(){
						_self._flowOutComplete(data);
					});
					_tempPage.transitionIn();
					break;
				case this.REVERSE:
					if(_curPage)
					{
						this.listenToOnce(_curPage, this.TRANSITION_OUT_COMPLETE, function(){
							_self._flowOutComplete(data);
						});
						_curPage.transitionOut();
					}else{
						this._flowOutComplete(data);
					}
					break;
				case this.CROSS:
					this.listenToOnce(_tempPage, this.TRANSITION_IN_COMPLETE, function(){
						_self._flowOutComplete(data);
					});
					_tempPage.transitionIn();
					break;
			}
		},
		_flowOutComplete:function(data){
			var _self = this;
			var _curPage = this._curPages[data.depth];
			var _tempPage = this._tempPages[data.depth];
			var _flow = data.flow?data.flow:this._flow;
			
			if(_curPage) delete this._curPages[data.depth];
			
			if(_tempPage){
				this._curPages[data.depth] = _tempPage;
				delete this._tempPages[data.depth];
			}
			
			if(data.routing){
				document.title = data.routing;
			}
			
			if(_.isArray(this._tempData)){
				this._tempFlowIndex++;
				if(this._tempFlowIndex >= this._tempData.length){
					_self.trigger(_self.FLOW_COMPLETE, {data:this._tempData});
					this._playQueue();
				}
			}else{
				_self.trigger(_self.FLOW_COMPLETE, {data:this._tempData});
				this._playQueue();
			}
		},
		_preloadComplete:function(data){
			var _self = this;
			var _flow = data.flow?data.flow:this._flow;
			if(_.isArray(this._tempData)){
				this._tempFlowIndex++;
				if(this._tempFlowIndex >= this._tempData.length){
					this._tempFlowIndex = 0;
					_.each(_self._tempData,function(_obj,_index){
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

			var _self = this;
			if(this._preloader != null){
				this._preloader.destroy();
				this._preloader = null;
			}
			
			if(!data){
				return;
			}
			
			data.depth = this._checkDepth(this.PRELOAD);
			if(data.view && data.tpl && data.tpl != ""){
				require([data.view, data.css?"css!"+data.css:"", "text!"+data.tpl],function(view, css, tpl){
					_self._preloader = new view({template:_.template(tpl.html?tpl.html:tpl,{}),data:data});
					_self.$stage.append(_self._preloader.el);
					_self._preloader.init();
					_self.trigger(_self.PRELOAD_PREPARE);
				});
			}else{
				throw "preloader must have data.tpl!!!";
			}
		},
		_initPreloader:function(data){
			if(this._preloader == null) return;
			var _tempPage = this._tempPages[data.depth];
			this.listenTo(_tempPage, this.PRELOAD_PROGRESS, this._preloaderProgress);
			this.listenTo(_tempPage, this.PRELOAD_COMPLETE, this._preloaderOff);
		},
		_clearPreloader:function(data){
			if(this._preloader == null) return;
			var _tempPage = this._tempPages[data.depth];
			this.stopListening(_tempPage, this.PRELOAD_PROGRESS, this._preloaderProgress);
			this.stopListening(_tempPage, this.PRELOAD_COMPLETE, this._preloaderOff);
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
			var _self = this;
			if(this._preloader == null) return;
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
		preloadFast:function(bool){
			if(bool) this._preloadFast = bool;
			
			return this._preloadFast;
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
	
	/* 
	 * 将Athena的所有方法归纳到 Athena.api下
	 */
	Athena.api = {};
	
	var apiMethods = ["init",
					"pageTo",
					"pageOn",
					"pageOff",
					"calcDepth",
					"preloader",
					"getPage",
					"getPageAt",
					"fullScreen",
					"preloadFast",
					"isFlowing",
					"windowRect",
					"windowRectMin",
					"stageRect",
					"flow",
					"resize",
					"on",
					"once",
					"off",
					"trigger",
					"listenTo",
					"listenToOnce",
					"stopListening"];
	
	_.each(apiMethods, function(method){
		Athena.api[method] = function(){
			var args = slice.call(arguments);
			return Athena[method].apply(Athena, args);
		};
	});
	
	/* 
	 * Athena.view下为本框架所有基本view类，包括BaseView,BaseBtn,BasePage。
	 * BaseView：所有视图类的基类，需要添加入本框架的视图元素都可以从此类扩展。
	 * BaseBtn：所有按钮类的基类，需要添加入本框架的按钮元素都可以从此类扩展。
	 * BasePage：所有页面类的基类，需要添加入本框架的页面元素都可以从此类扩展（sitemap中配置的就是网站所有页面）。
	 */
	Athena.view = {};
	
	Athena.view.BaseView = Backbone.View.extend({
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
	
	Athena.view.BaseBtn = Athena.view.BaseView.extend({
		MOUSE_OVER:"mouseover",
		MOUSE_OUT:"mouseout",
		CLICK:"click",
		_isMouseOver:null,
		_isSelected:null,
		_isEnable:null,
		init:function(args){
			Athena.view.BaseView.prototype.init.apply(this,[args]);
			this._isMouseOver = false,
			this._isSelected = false,
			this._isEnable = false,
			this.enable(true);
		},
		destroy:function(){
			this.enable(false);
			Athena.view.BaseView.prototype.destroy.apply(this);
		},
		mouseOverHandler:function(){
		},
		mouseOutHandler:function(){
		},
		clickHandler:function(){
		},
		selected:function(bool){
			if(bool == this._isSelected) return;
			if(bool){
				this.mouseOverHandler();
				this._isSelected = bool;
			}else{
				this._isSelected = bool;
				this.mouseOutHandler();
			}
		},
		enable:function(bool){
			if(bool == this._isEnable) return;
			var _self = this;
			if(bool){
				this.$el.css("cursor","pointer");
				this.$el.on("mouseenter",function(event){
					_self._isMouseOver = true;
					_self.trigger(_self.MOUSE_OVER);
					_self.mouseOverHandler(event);
					return false;
				});
				this.$el.on("mouseleave",function(event){
					_self._isMouseOver = false;
					_self.trigger(_self.MOUSE_OUT);
					_self.mouseOutHandler(event);
					return false;
				});
				this.$el.on("click",function(event){
					_self.trigger(_self.CLICK);
					_self.clickHandler(event);
					return false;
				});
			}else{
				this.$el.css("cursor","auto");
				this.$el.off("mouseenter");
				this.$el.off("mouseleave");
				this.$el.off("click");
			}
			this._isEnable = bool;
		}
	});
	
	Athena.view.BasePage = Athena.view.BaseView.extend({
		loadMax:null,
		loaded:null,
		data:null,
		initialize:function(args){
			Athena.view.BaseView.prototype.initialize.apply(this,[args]);
			
			this.data = args.data;
			this.$el.css({"z-index":this.data.depth});
			this.preloadArray = [];
		},
		init:function(args){
			Athena.view.BaseView.prototype.init.apply(this,[args]);
			
			this.listenTo(Athena, Athena.WINDOW_RESIZE, function(){
				this.resize();
			});
		},
		destroy:function(){console.log("destroy",this.data);
			Athena.view.BaseView.prototype.destroy.apply(this);
		},
		preload:function(skip){
			this.trigger(Athena.PRELOAD, {data:this.data});
			
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
			this.trigger(Athena.PRELOAD_PROGRESS, {data:this.data, progress:obj});
		},
		completeHandle:function () {
			this.trigger(Athena.PRELOAD_COMPLETE, {data:this.data});
		},
		transitionIn:function(){
			this.resize();
			this.trigger(Athena.TRANSITION_IN, {data:this.data});
		},
		transitionInComplete:function(){
			this.trigger(Athena.TRANSITION_IN_COMPLETE, {data:this.data});
		},
		transitionOut:function(){
			this.trigger(Athena.TRANSITION_OUT, {data:this.data});
		},
		transitionOutComplete:function(){
			this.destroy();
			this.trigger(Athena.TRANSITION_OUT_COMPLETE, {data:this.data});
		}
	});
	
	return Athena;
}));
