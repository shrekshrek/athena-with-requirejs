/*!
 * VERSION: 2.0.0
 * DATE: 2014-11-20
 * GIT:https://github.com/shrekshrek/athenaframework
 *
 * @author: Shrek.wang, shrekshrek@gmail.com
 **/

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'jquery', 'backbone', 'exports'], function(_, $, Backbone, exports) {
            root.Athena = factory(root, exports, _, Backbone, $);
        });

    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore');
        var Backbone = require('backbone');
        factory(root, exports, _, Backbone);

    } else {
        root.Athena = factory(root, {}, root._, root.Backbone, (root.jQuery || root.Zepto || root.ender || root.$));
    }

}(this, function(root, Athena, _, Backbone, $) {

    var previousAthena = root.Athena;

    var array = [];
    var push = array.push;
    var slice = array.slice;
    var splice = array.splice;

    Athena.VERSION = '2.0.0';

    Athena.noConflict = function() {
        root.Athena = previousAthena;
        return this;
    };

    /*
     * 框架事件名
     */
    _.extend(Athena, {
        PRELOAD_START : "preloadStart",
        PRELOAD_PROGRESS : "preloadProgress",
        PRELOAD_COMPLETE : "preloadComplete",
        TRANSITION_IN : "transitionIn",
        TRANSITION_IN_COMPLETE : "transitionInComplete",
        TRANSITION_OUT : "transitionOut",
        TRANSITION_OUT_COMPLETE : "transitionOutComplete",
        /*
         * 页面深度常量
         * preload 相当于 z-index = 1500
         * top 相当于 z-index = 1000
         * middle 相当于z-index = 500
         * bottom 相当于 z-index = 0
         */
        PRELOAD : "preload",
        TOP : "top",
        MIDDLE : "middle",
        BOTTOM : "bottom",
        /*
         * 页面切换方式常量 normal 为普通切换方式，1。当前页面退场。2。加载新页面。3。新页面进场。 preload
         * 为普通切换方式，1。加载新页面。2。当前页面退场。3。新页面进场。 reverse
         * 为普通切换方式，1。加载新页面。2。新页面进场。3。当前页面退场。 cross
         * 为普通切换方式，1。加载新页面。2。新页面进场。当前页面退场。同时进行。
         */
        NORMAL : "normal",
        // PRELOAD:"preload",
        REVERSE : "reverse",
        CROSS : "cross",
        /*
         * 页面间切换状态常量
         */
        FLOW_START : "flowStart",
        FLOW_COMPLETE : "flowComplete",
        WINDOW_RESIZE : "windowResize",
        PRELOAD_PREPARE : "preloadPrepare"
    });

    /*
     * 框架主控制器逻辑
     */
    _.extend(Athena, Backbone.Events, {
        $body : null,
        $stage : null,
        $window : null,
        $document : null,
        _preloadFast : null,
        _flow : null,
        _isFlowing : false,
        _isFullScreen : false,
        _windowRect : {
            width : 0,
            height : 0
        },
        _windowRectMin : {
            width : 1,
            height : 1
        },
        _stageRect : {
            width : 0,
            height : 0
        },
        _depths:[1500,1000,500,0],
        _curPages : null,
        _tempPages : null,
        _actionQueue : null,
        _preloader : null,
        _tempData : null,
        _tempFlowIndex : null,
        _tempPreloadIndex : null,
        _tempLoadedProgress : null,
        init : function(stage) {
            var _self = this;
            this.$stage = stage ? stage : $("body");
            this.$body = $("body");
            this.$window = $(window);
            this.$document = $(document);

            this._preloadFast = false;
            this._flow = this.NORMAL;
            this._curPages = {};
            this._tempPages = {};
            this._actionQueue = [];

            this.$window.resize(function() {
                _self.resize();
            });
            this.resize();
        },
        pageOn : function(obj) {
            if (!this.$stage)
                throw "athena havn't stage!!!";

            obj = this._checkData(obj);
            this._actionQueue.push({action:"on",data:obj});

            if (this._isFlowing)
                return;

            this._playQueue();
        },
        pageTo : function(obj) {
            this.pageOn(obj);
        },
        pageOff : function(obj) {
            if (!this.$stage)
                throw "athena havn't stage!!!";

            obj = this._checkData(obj);
            this._actionQueue.push({action:"off",data:obj});

            if (this._isFlowing)
                return;

            this._playQueue();
        },
        _playQueue : function() {
            var _self = this;
            if (this._actionQueue.length >= 1) {
                var _data = this._actionQueue.shift();
                this._tempData = _data.data;
                this._isFlowing = true;
                switch(_data.action){
                    case "on":
                        this._tempFlowIndex = 0;
                        this._tempPreloadIndex = 0;
                        if (_.isArray(this._tempData)) {
                            this._tempLoadedProgress = {};
                            _.each(this._tempData, function(_obj, _index) {
                                _self._flowIn(_obj);
                            });
                        } else {
                            this._flowIn(this._tempData);
                        }
                        _self.trigger(_self.FLOW_START, {
                            data : this._tempData
                        });
                    break;
                    case "off":
                        var _data = {};
                        if (_.isArray(this._tempData)) {
                            var _fine = true;
                            for(var i in this._tempData){
                                var _obj = this._tempData[i];
                                _data = _obj.data?_obj.data:_obj;
                                var _page = _self._curPages[_data.depth];
                                if(!_page){
                                    _fine = false;
                                    break;
                                }
                            }

                            if(_fine){
                                for(var j in this._tempData){
                                    var _obj = this._tempData[j];
                                    _data = _obj.data?_obj.data:_obj;
                                    var _page = _self._curPages[_data.depth];
                                    _self.listenToOnce(_page, _self.TRANSITION_OUT_COMPLETE, function() {
                                        _self._flowOutComplete(_data);
                                    });
                                    _page.transitionOut();
                                }
                            }else{
                                _self._isFlowing = false;
                            }
                        } else {
                            if (_.isNumber(this._tempData)) {
                                _data.depth = this._tempData;
                            } else if (_.isString(this._tempData)) {
                                _data.depth = _self._checkDepth(this._tempData);
                            } else if (this._tempData.data) {
                                _data.depth = _self._checkDepth(this._tempData.data.depth);
                            } else {
                                _data.depth = _self._checkDepth(this._tempData.depth);
                            }
                            var _page = _self._curPages[_data.depth];
                            if(_page){
                                _self.listenToOnce(_page, _self.TRANSITION_OUT_COMPLETE, function() {
                                    _self._flowOutComplete(_data);
                                });
                                _page.transitionOut();
                            }else{
                                _self._isFlowing = false;
                            }
                        }
                    break;
                }
            } else {
                this._tempData = null;
                this._isFlowing = false;
            }
        },
        _checkData : function(obj) {
            if (!obj)
                throw "page data is undefined!";

            var _self = this;
            if (_.isArray(obj)) {
                var _a = [];
                _.each(obj, function(_obj, _index) {
                    if (!_obj)
                        throw "page data is undefined!";

                    var _data = _obj.data?_obj.data:_obj;

                    if (!(_data.view))
                        throw "each page data has wrong!!! must has 'data.view'";

                    _data.depth = _self._checkDepth(_data.depth);

                    var _isUnique = true;
                    _.each(_a, function(_obj2, _index2) {
                        if (_data.depth === _obj2.depth) {
                            _isUnique = false;
                        }
                    });

                    if (_isUnique) {
                        _a.push(_obj);
                    }
                });
                return _a;
            } else {
                var _data = obj.data?obj.data:obj;
                if (!(_data.view))
                    throw "each page data has wrong!!! must has 'data.view'";
                _data.depth = _self._checkDepth(_data.depth);
                return obj;
            }
        },
        calcDepth : function(depth) {
            return this._checkDepth(depth);
        },
        _checkDepth : function(depth) {
            var _depth = this._depths[2];

            if (_.isString(depth)) {
                depth = depth.toLowerCase();
                var _plus = "";
                var _n = 0;
                var _n1 = depth.indexOf("+");
                var _n2 = depth.indexOf("-");
                var _max = Math.max(_n1, _n2);
                var _min = Math.min(_n1, _n2);
                var _num = 0;

                if (_min >= 0) {
                    _n = _min;
                } else {
                    _n = _max;
                }

                if (_n > 0) {
                    _depth = depth.substring(0, _n);
                    _plus = depth.substring(_n, _n + 1);
                    _num = parseInt(depth.substring(_n + 1));
                } else {
                    _depth = depth;
                }

                switch (_depth) {
                    case this.PRELOAD :
                        _depth = this._depths[0];
                        break;
                    case this.TOP :
                        _depth = this._depths[1];
                        break;
                    case this.MIDDLE :
                        _depth = this._depths[2];
                        break;
                    case this.BOTTOM :
                        _depth = this._depths[3];
                        break;
                }

                switch (_plus) {
                    case "+" :
                        _depth += _num;
                        break;
                    case "-" :
                        _depth -= _num;
                        break;
                }
            }

            if (_.isNumber(depth)) {
                _depth = Math.floor(depth);
            }

            return _depth;
        },
        _flowIn : function(obj) {
            var _self = this;
            var _data = obj.data?obj.data:obj;
            var _curPage = this._curPages[_data.depth];
            var _tempPage = this._tempPages[_data.depth];
            var _flow = _data.flow ? _data.flow : this._flow;
            switch (_flow) {
                case this.NORMAL :
                    if (_curPage) {
                        this.listenToOnce(_curPage, this.TRANSITION_OUT_COMPLETE, function() {
                            _self._flowInComplete(obj);
                        });
                        _curPage.transitionOut();
                    } else {
                        this._flowInComplete(obj);
                    }
                    break;
                case this.PRELOAD :
                case this.REVERSE :
                case this.CROSS :
                    this._preloaderOn();
                    require([_data.view], function(view) {
                        _self._tempPage = new view(obj.data?obj:{data:obj});
                        _self._tempPages[_data.depth] = _self._tempPage;
                        if (!obj.el)
                            _self.$stage.append(_self._tempPage.el);
                        _self._tempPage.init();
                        _self._initPreloader(obj);
                        _self.listenToOnce(_self._tempPage, _self.PRELOAD_COMPLETE, function() {
                            _self._pageLoadComplete(obj);
                        });
                        _self._tempPage.preload(_self._preloadFast || _data.fast === "true");
                    });
                    break;
            }
        },
        _flowInComplete : function(obj) {
            var _self = this;
            var _data = obj.data?obj.data:obj;
            var _curPage = this._curPages[_data.depth];
            var _tempPage = this._tempPages[_data.depth];
            var _flow = _data.flow ? _data.flow : this._flow;
            switch (_flow) {
                case this.NORMAL :
                    this._preloaderOn();
                    require([_data.view], function(view) {
                        _self._tempPage = new view(obj.data?obj:{data:obj});
                        _self._tempPages[_data.depth] = _self._tempPage;
                        if (!obj.el)
                            _self.$stage.append(_self._tempPage.el);
                        _self._tempPage.init();
                        _self._initPreloader(obj);
                        _self.listenToOnce(_self._tempPage, _self.PRELOAD_COMPLETE, function() {
                            _self._pageLoadComplete(obj);
                        });
                        _self._tempPage.preload(_self._preloadFast || _data.fast === "true");
                    });
                    break;
                case this.PRELOAD :
                    if (_curPage) {
                        this.listenToOnce(_curPage, this.TRANSITION_OUT_COMPLETE, function() {
                            _self._flowOut(obj);
                        });
                        _curPage.transitionOut();
                    } else {
                        this._flowOut(obj);
                    }
                    break;
                case this.REVERSE :
                    this.listenToOnce(_tempPage, this.TRANSITION_IN_COMPLETE, function() {
                        _self._flowOut(obj);
                    });
                    _tempPage.transitionIn();
                    break;
                case this.CROSS :
                    if (_curPage) {
                        _curPage.transitionOut();
                    }
                    this._flowOut(obj);
                    break;
            }
        },
        _flowOut : function(obj) {
            var _self = this;
            var _data = obj.data?obj.data:obj;
            var _curPage = this._curPages[_data.depth];
            var _tempPage = this._tempPages[_data.depth];
            var _flow = _data.flow ? _data.flow : this._flow;
            switch (_flow) {
                case this.NORMAL :
                    this.listenToOnce(_tempPage, this.TRANSITION_IN_COMPLETE, function() {
                        _self._flowOutComplete(obj);
                    });
                    _tempPage.transitionIn();
                    break;
                case this.PRELOAD :
                    this.listenToOnce(_tempPage, this.TRANSITION_IN_COMPLETE, function() {
                        _self._flowOutComplete(obj);
                    });
                    _tempPage.transitionIn();
                    break;
                case this.REVERSE :
                    if (_curPage) {
                        this.listenToOnce(_curPage, this.TRANSITION_OUT_COMPLETE, function() {
                            _self._flowOutComplete(obj);
                        });
                        _curPage.transitionOut();
                    } else {
                        this._flowOutComplete(obj);
                    }
                    break;
                case this.CROSS :
                    this.listenToOnce(_tempPage, this.TRANSITION_IN_COMPLETE, function() {
                        _self._flowOutComplete(obj);
                    });
                    _tempPage.transitionIn();
                    break;
            }
        },
        _flowOutComplete : function(obj) {
            var _self = this;
            var _data = obj.data?obj.data:obj;
            var _curPage = this._curPages[_data.depth];
            var _tempPage = this._tempPages[_data.depth];
            var _flow = _data.flow ? _data.flow : this._flow;

            if (_curPage)
                delete this._curPages[_data.depth];

            if (_tempPage) {
                this._curPages[_data.depth] = _tempPage;
                delete this._tempPages[_data.depth];
            }

            if (_data.routing) {
                document.title = _data.routing;
            }

            if (_.isArray(this._tempData)) {
                this._tempFlowIndex++;
                if (this._tempFlowIndex >= this._tempData.length) {
                    _self.trigger(_self.FLOW_COMPLETE, {
                        data : this._tempData
                    });
                    this._playQueue();
                }
            } else {
                _self.trigger(_self.FLOW_COMPLETE, {
                    data : this._tempData
                });
                this._playQueue();
            }
        },
        _pageLoadComplete : function(obj) {
            var _self = this;
            var _data = obj.data?obj.data:obj;
            var _flow = _data.flow ? _data.flow : this._flow;
            if (_.isArray(this._tempData)) {
                this._tempFlowIndex++;
                if (this._tempFlowIndex >= this._tempData.length) {
                    this._tempFlowIndex = 0;
                    _.each(_self._tempData, function(_obj, _index) {
                        switch (_flow) {
                            case _self.NORMAL :
                                _self._flowOut(_obj);
                                break;
                            case _self.PRELOAD :
                            case _self.REVERSE :
                            case _self.CROSS :
                                _self._flowInComplete(_obj);
                                break;
                        }
                    });
                }
            } else {
                switch (_flow) {
                    case _self.NORMAL :
                        _self._flowOut(obj);
                        break;
                    case _self.PRELOAD :
                    case _self.REVERSE :
                    case _self.CROSS :
                        _self._flowInComplete(obj);
                        break;
                }
            }
        },
        preloader : function(obj) {
            var _self = this;
            if (obj) {
                if (!this.$stage)
                    throw "athena havn't stage!!!";

                if (this._preloader !== null) {
                    this._preloader.destroy();
                    this._preloader = null;
                }

                var _data = obj.data?obj.data:obj;
                _data.depth = this._checkDepth(this.PRELOAD);
                if (_data.view !== "") {
                    require([_data.view], function(view) {
                        _self._preloader = new view(obj.data?obj:{data:obj});
                        _self.$stage.append(_self._preloader.el);
                        _self._preloader.init();
                        _self.trigger(_self.PRELOAD_PREPARE);
                    });
                } else {
                    throw "preloader must have data.view!!!";
                }
                return this._preloader;
            } else {
                return this._preloader;
            }
        },
        _initPreloader : function(obj) {
            if (this._preloader === null)
                return;

            var _data = obj.data?obj.data:obj;
            var _tempPage = this._tempPages[_data.depth];
            this.listenTo(_tempPage, this.PRELOAD_PROGRESS, this._preloaderProgress);
            this.listenTo(_tempPage, this.PRELOAD_COMPLETE, this._preloaderOff);
        },
        _clearPreloader : function(obj) {
            if (this._preloader === null)
                return;

            var _data = obj.data?obj.data:obj;
            var _tempPage = this._tempPages[_data.depth];
            this.stopListening(_tempPage, this.PRELOAD_PROGRESS, this._preloaderProgress);
            this.stopListening(_tempPage, this.PRELOAD_COMPLETE, this._preloaderOff);
        },
        _preloaderOn : function(obj) {
            if (this._preloader === null)
                return;

            if (_.isArray(this._tempData)) {
                this._tempPreloadIndex++;
                if (this._tempPreloadIndex >= this._tempData.length) {
                    this._tempPreloadIndex = 0;
                    this._preloader.transitionIn();
                }
            } else {
                this._preloader.transitionIn();
            }
        },
        _preloaderProgress : function(obj) {
            var _self = this;
            if (this._preloader === null)
                return;

            if (_.isArray(this._tempData)) {
                var _n = 0;
                this._tempLoadedProgress[obj.data.depth] = obj.progress;
                _.each(this._tempLoadedProgress, function(_obj) {
                    if (_obj)
                        _n += _obj / _self._tempData.length;
                });
                this._preloader.progress({
                    progress : _n
                });
            } else {
                this._preloader.progress(obj);
            }
        },
        _preloaderOff : function(obj) {
            if (this._preloader === null)
                return;

            this._clearPreloader(obj.data);
            if (_.isArray(this._tempData)) {
                this._tempPreloadIndex++;
                if (this._tempPreloadIndex >= this._tempData.length) {
                    this._tempPreloadIndex = 0;
                    this._preloader.transitionOut();
                }
            } else {
                this._preloader.transitionOut();
            }
        },
        getPage : function(data) {
            var _page = null;
            _.each(this._tempPages, function(_obj, _index) {
                if (_obj.data === data) {
                    _page = _obj;
                }
            });

            if (_page)
                return _page;

            _.each(this._curPages, function(_obj, _index) {
                if (_obj.data === data) {
                    _page = _obj;
                }
            });
            return _page;
        },
        getPageAt : function(depth) {
            var _depth = this._depths[2];
            if (depth)
                _depth = this._checkDepth(depth);

            var _page = this._tempPages[_depth];
            if (_page)
                return _page;

            var _page = this._curPages[_depth];
            return _page;
        },
        fullScreen : function(bool) {
            if (!this.$stage)
                throw "athena havn't stage!!!";

            if (bool) {
                if (_.isBoolean(bool)) {
                    this._isFullScreen = bool;
                } else {
                    throw "setFullScreen params must be bool!!!";
                }
                this.resize();
            }

            return this._isFullScreen;
        },
        preloadFast : function(bool) {
            if (bool)
                this._preloadFast = bool;

            return this._preloadFast;
        },
        isFlowing : function() {
            return _isFlowing;
        },
        windowRect : function() {
            if (!this.$stage)
                throw "athena havn't stage!!!";

            return this._windowRect;
        },
        windowRectMin : function(rect) {
            if (!this.$stage)
                throw "athena havn't stage!!!";

            if (rect) {
                if (rect.width) {
                    this._windowRectMin.width = rect.width;
                }
                if (rect.height) {
                    this._windowRectMin.height = rect.height;
                }
                this.resize();
            }

            return this._windowRectMin;
        },
        stageRect : function() {
            if (!this.$stage)
                throw "athena havn't stage!!!";

            return this._stageRect;
        },
        flow : function(str) {
            if (!this.$stage)
                throw "athena havn't stage!!!";

            if (str) {
                str = str.toLowerCase();
                switch (str) {
                    case this.NORMAL :
                    case this.PRELOAD :
                    case this.REVERSE :
                    case this.CROSS :
                        this._flow = str;
                        break;
                }
            }

            if (!this._flow)
                this._flow = this.NORMAL;

            return this._flow;
        },
        resize : function() {
            if (!this.$stage)
                throw "athena havn't stage!!!";

            this._windowRect.width = this.$window.width();
            this._windowRect.height = this.$window.height();
            if (this._isFullScreen) {
                if (this._windowRect.width < this._windowRectMin.width) {
                    this.$body.css("overflow-x", "auto");
                } else {
                    this.$body.css("overflow-x", "hidden");
                }
                if (this._windowRect.height < this._windowRectMin.height) {
                    this.$body.css("overflow-y", "auto");
                } else {
                    this.$body.css("overflow-y", "hidden");
                }
                this._windowRect.width = this.$window.width();
                this._windowRect.height = this.$window.height();
                this._stageRect.width = Math.max(this._windowRect.width, this._windowRectMin.width);
                this._stageRect.height = Math.max(this._windowRect.height, this._windowRectMin.height);
                this.$stage.width(this._stageRect.width);
                this.$stage.height(this._stageRect.height);
            } else {
                this.$body.css("overflow", "auto");
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

    var apiMethods = ["init", "pageTo", "pageOn", "pageOff", "calcDepth", "preloader", "getPage", "getPageAt", "fullScreen", "preloadFast", "isFlowing", "windowRect", "windowRectMin", "stageRect",
            "flow", "resize", "on", "once", "off", "trigger", "listenTo", "listenToOnce", "stopListening"];

    _.each(apiMethods, function(method) {
        Athena.api[method] = function() {
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
        template : null,
        parent : null,
        children : null,
        args : null,
        _isInited : null,
        events : {},
        initialize : function(args) {
            this.children = [];
            if (!args)
                return;
            this.args = args;
            if (args.template) {
                this.template = args.template;
                this.render();
            }
        },
        init : function(args) {
            if (this._isInited)
                return;
            this._isInited = true;
        },
        destroy : function() {
            this.parent = null;
            _.each(this.children, function(obj) {
                obj.destroy();
            });
            this.children = null;
            this.remove();
        },
        render : function() {
            if (this.template)
                this.$el.html(this.template);
        },
        resize : function() {
            _.each(this.children, function(obj) {
                obj.resize();
            });
        },
        addChild : function(view, $dom) {
            _.each(this.children, function(obj) {
                if (obj === view)
                    return;
            });
            view.parent = this;
            this.children.push(view);
            if ($dom) {
                $dom.append(view.el);
                view.init();
            }
        },
        removeChild : function(view) {
            _.each(this.children, function(index, obj) {
                if (obj === view) {
                    this.children.splice(index, 1);
                    view.destroy();
                    return;
                }
            });
        }
    });

    Athena.view.BaseBtn = Athena.view.BaseView.extend({
        MOUSE_OVER : "mouseover",
        MOUSE_OUT : "mouseout",
        CLICK : "click",
        _isMouseOver : null,
        _isSelected : null,
        _isEnable : null,
        init : function() {
            Athena.view.BaseBtn.__super__.init.apply(this);
            this._isMouseOver = false, this._isSelected = false, this._isEnable = false, this.enable(true);
        },
        destroy : function() {
            this.enable(false);
            Athena.view.BaseBtn.__super__.destroy.apply(this);
        },
        mouseOverHandler : function() {
        },
        mouseOutHandler : function() {
        },
        clickHandler : function() {
        },
        selected : function(bool) {
            if (bool === this._isSelected)
                return;
            if (bool) {
                this.mouseOverHandler();
                this._isSelected = bool;
            } else {
                this._isSelected = bool;
                this.mouseOutHandler();
            }
        },
        enable : function(bool) {
            if (bool === this._isEnable)
                return;
            var _self = this;
            if (bool) {
                this.$el.css("cursor", "pointer");
                this.$el.on("mouseenter", function(event) {
                    _self._isMouseOver = true;
                    _self.trigger(_self.MOUSE_OVER);
                    _self.mouseOverHandler(event);
                    return false;
                });
                this.$el.on("mouseleave", function(event) {
                    _self._isMouseOver = false;
                    _self.trigger(_self.MOUSE_OUT);
                    _self.mouseOutHandler(event);
                    return false;
                });
                this.$el.on("click", function(event) {
                    _self.trigger(_self.CLICK);
                    _self.clickHandler(event);
                    return false;
                });
            } else {
                this.$el.css("cursor", "auto");
                this.$el.off("mouseenter");
                this.$el.off("mouseleave");
                this.$el.off("click");
            }
            this._isEnable = bool;
        }
    });

    Athena.view.BasePage = Athena.view.BaseView.extend({
        _loadMax : null,
        _loaded : null,
        data : null,
        initialize : function(args) {
            Athena.view.BasePage.__super__.initialize.apply(this, [args]);
            var _self = this;
            this.data = args.data;
            this.$el.css({
                "z-index" : this.data.depth
            });

            var _assets = [];
            var _imgs = this.data.assets && _.isArray(this.data.assets) ? this.data.assets : [];
            _.each(_imgs, function(obj, index) {
                _assets.push($(new Image()).attr({
                    src : obj
                })[0].src);
            });
            this.data.assets = _assets;
        },
        init : function(args) {
            Athena.view.BasePage.__super__.init.apply(this, [args]);

            this.listenTo(Athena, Athena.WINDOW_RESIZE, function() {
                this.resize();
            });
        },
        destroy : function() {
            Athena.view.BasePage.__super__.destroy.apply(this);
        },
        preload : function(skip) {
            this.trigger(Athena.PRELOAD_START, {
                data : this.data
            });

            if (skip) {
                this.completeHandle();
                return;
            }

            var _self = this;
            var _imgs = _.without(_.pluck(this.$el.find("img"), "src"), "").concat(this.data.assets);
            this._loadMax = _imgs.length;
            this._loaded = 0;
            if (this._loadMax === 0) {
                this.progressHandle(1);
                this.completeHandle();
            } else {
                _.each(_imgs, function(url) {
                    $(new Image()).load(function() {
                        _self._assetLoadComplete();
                    }).error(function() {
                        _self._assetLoadComplete();
                    }).attr("src", url);
                });
            }
        },
        _assetLoadComplete : function() {
            this._loaded++;
            this.progressHandle(this._loaded / this._loadMax);
            if (this._loaded >= this._loadMax) {
                this.completeHandle();
            }
        },
        progressHandle : function(obj) {
            this.trigger(Athena.PRELOAD_PROGRESS, {
                data : this.data,
                progress : obj
            });
        },
        completeHandle : function() {
            this.trigger(Athena.PRELOAD_COMPLETE, {
                data : this.data
            });
        },
        transitionIn : function() {
            this.resize();
            this.trigger(Athena.TRANSITION_IN, {
                data : this.data
            });
        },
        transitionInComplete : function() {
            this.trigger(Athena.TRANSITION_IN_COMPLETE, {
                data : this.data
            });
        },
        transitionOut : function() {
            this.trigger(Athena.TRANSITION_OUT, {
                data : this.data
            });
        },
        transitionOutComplete : function() {
            this.destroy();
            this.trigger(Athena.TRANSITION_OUT_COMPLETE, {
                data : this.data
            });
        }
    });

    return Athena;
}));
