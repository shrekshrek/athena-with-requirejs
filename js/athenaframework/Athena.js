/*
 * version:0.0.1
 * date:2013.06.13
 * authur:shrek.wang
 * Athena是一个基于Backbone的js前端框架，主要功能是通过SiteMap设置的网站结构
 * 主要API
 * init(stage); 设置关联根节点
 * pageTo(data); data为节点对象,一般情况下节点数据在sitemap.js中设置,一般转场都用这条命令即可
 * 节点数据：{title:"home",routing:"首页",view:"app/view/HomePage",template:"app/template/home.html",depth:"top",flow:"normal"} 
 * 		title:用于识别区分，暂时无用
 * 		routing:用于设置页面标头文本
 * 		view:每个页面的js文件地址，
 * 		template:为页面模板html文件地址，
 * 		depth:显示深度，可以使用关键词"preload","top","middle","bottom",也可以使用通配符"+","-",例如"top-"
 * 		flow:当前页面进场时流程设置，无效则使用全局流程
 * pageOn(data); data为SiteMap节点对象,效果同pageTo(data);
 * pageOff(data); data为SiteMap节点对象,此处也可以传string字符串，或者数字，用户指定页面中某层级的内容退场
 * preloader(data,function); data为节点对象，function为加载设置完成的回调函数，data为空则取消preload显示组件
 * fullScreen(bool); bool为布尔值，是否设置全屏，true为全屏显示无滚动条，false为普通显示，滚动条显示状态为auto。rect设置全屏状态下的最小分辨率，低于此分辨率强制出现滚动条(默认值为1000x560)。
 * fullScreen(); 返回bool布尔值
 * windowRectMin(rect); 设置页面最小分辨率
 * windowRectMin(); 获取页面最小分辨率
 * getPage(data); 获取指定data的页面实例
 * getPageAt(depth); 获取指定depth层级的页面实例
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
		_isFullScreen:false,
		_windowRect:{width:0,height:0},
		_windowRectMin:{width:1000,height:600},
		_stageRect:{width:0,height:0},
		_curPages:null,
		_tempPages:null,
		_tempDatas:null,
		_preloader:null,
		init:function(stage){
			this.$stage = stage?stage:$("body");
			this.$body = $("body");
			this.$window = $(window);
			
			this._flow = this.NORMAL;
			this._curPages = {};
			this._tempPages = {};
			this._tempDatas = {};
			
			var _self = this;
			this.$window.resize(function(){
				_self.resize();
			});
			this.resize();
			
			return this;
		},
		pageTo:function(data){
			if(!this.$stage) throw "athena havn't stage!!!";
			
			if(!_.isObject(data)) throw "page data must be object!!!";
			
			if(!(data.view && data.template)) throw "page data has wrong!!! must has 'data.view','data.template'";
			
			data.depth = this._checkDepth(data.depth);
			
			if(this._tempPages[data.depth]){
				this._tempDatas[data.depth] = data;
				return;
			}
			
			var _self = this;
			var _page;
			require([data.view,"text!"+data.template],function(view,template){
				_page = new view({template:_.template(template,{}),data:data});
				_self._tempPages[data.depth] = _page;
				_self._initPreloader(data);
				_self._flowIn(data);
			});
			
			if(data.routing){
				document.title = data.routing;
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
							if(!this._curPages[_depth] && !this._tempPages[_depth] && !this._tempDatas[_depth]) break;
						}
						break;
					case "-":
						while(_depth>-5000){
							_depth--;
							if(!this._curPages[_depth] && !this._tempPages[_depth] && !this._tempDatas[_depth]) break;
						}
						break;
				}
				this._tempDatas[_depth] = 1;
			}
			
			if(_.isNumber(depth)){
				_depth = Math.max(0,Math.floor(depth));
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
					this.listenToOnce(_tempPage, BasePageConst.PRELOAD_COMPLETE, function(){
						this._flowInComplete(data);
					});
					this.$stage.append(_tempPage.el);
					_tempPage.preload();
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
					this.listenToOnce(_tempPage, BasePageConst.PRELOAD_COMPLETE, function(){
						this._flowOut(data);
					});
					this.$stage.append(_tempPage.el);
					_tempPage.preload();
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
				/*requirejs.undef(this._curPage.data.view);
				requirejs.undef("text!"+this._curPage.data.template);*/
				_curPage.destroy();
			}
			
			if(_tempPage){
				this._curPages[data.depth] = _tempPage;
			}else{
				if(this._curPages[data.depth]) delete this._curPages[data.depth];
			}
			delete this._tempPages[data.depth];
			this.trigger(this.FLOW_OUT_COMPLETE, {data:data});
			
			if(this._tempDatas[data.depth]){
				if(this._tempDatas[data.depth]!=1) this.pageTo(this._tempDatas[data.depth]);
				delete this._tempDatas[data.depth];
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
			this.listenTo(_tempPage, BasePageConst.PRELOAD, this._preloaderOn);
			this.listenTo(_tempPage, BasePageConst.PRELOAD_PROGRESS, this._preloaderProgress);
			this.listenTo(_tempPage, BasePageConst.PRELOAD_COMPLETE, this._preloaderOff);
		},
		_clearPreloader:function(data){
			if(this._preloader == null) return;
			var _tempPage = this._tempPages[data.depth];
			this.stopListening(_tempPage, BasePageConst.PRELOAD, this._preloaderOn);
			this.stopListening(_tempPage, BasePageConst.PRELOAD_PROGRESS, this._preloaderProgress);
			this.stopListening(_tempPage, BasePageConst.PRELOAD_COMPLETE, this._preloaderOff);
		},
		_preloaderOn:function(obj){
			if(this._preloader == null) return;
			this._preloader.transitionIn(obj);
		},
		_preloaderProgress:function(obj){
			if(this._preloader == null) return;
			this._preloader.progress(obj);
		},
		_preloaderOff:function(obj){
			if(this._preloader == null) return;
			this._preloader.transitionOut(obj);
			this._clearPreloader(obj.data);
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
		stageRect:function(rect){
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
				this.$stage.width("100%");
				this.$stage.height("100%");
				this._stageRect.width = $(document).width();
				this._stageRect.height = $(document).height();
			}
			
			this.trigger(this.WINDOW_RESIZE);
		}
	});
	return athena;
});
