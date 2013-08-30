define(["baseView","tweenMax","touchPath","easel"],function(BaseView,TweenMax,TouchPath){
	var socket = _.extend({}, Backbone.Events, {
		UPDATE:"update",
		socket:null,
		isConnecting:false,
		init:function(){
			var _self = this;
			this.socket = io.connect("http://192.168.150.52:8848/");
			this.socket.on("connect", function(){
				_self.isConnecting = true;
			});
			this.socket.on("disconnect", function(){console.log("disconnect");
				_self.isConnecting = false;
			});
			this.socket.on("game.fn", function(obj){
				_self.trigger(_self.UPDATE,obj);
			});
		},
		destroy:function(){
			this.socket.disconnect();
		},
		send:function(obj){
			if(this.isConnecting) this.socket.emit("game.fn", obj);
		}
	});
	var self;
	var view = BaseView.extend({
		stage:null,
		stageRect:null,
		touch:null,
		dots:null,
		dotInterval:null,
		init:function(args){
			BaseView.prototype.init.apply(this,[args]);
			self = this;
			this.$el.css({"display":"none"});
		},
		destroy:function(){
			BaseView.prototype.destroy.apply(this);
		},
		resize:function(){
			BaseView.prototype.resize.apply(this);
		},
		setSize:function(obj){
			this.stageRect = obj;
			this.$el.attr({"width":obj.width,"height":obj.height});
		},
		initCanvas:function(){
			this.$el.css({"display":"block"});
			this.stage = new createjs.Stage(this.el);
			createjs.Touch.enable(this.stage);
			createjs.Ticker.setFPS(30);
			//this.stage.enableMouseOver(10);
			this.stage.mouseMoveOutside = true;
			
			this.touch = new TouchPath();
			this.touch.init(this.stage);
			this.listenTo(this.touch, this.touch.DRAW, function(){
				socket.send({path:this.touch.pathPos,delta:this.touch.pathDelta});
			})
			
			createjs.Ticker.addEventListener("tick", this._tick);
			
			this._initStage();
			socket.init();
			this.listenTo(socket, socket.UPDATE, function(obj){
				this.touch.drawPath(obj.path,obj.delta,createjs.Graphics.getRGB(255,0,255,1.0));
			})
		},
		clearCanvas:function(){
			this._clearStage();
			this.touch.destroy();
			
			this.$el.css({"display":"none"});
			createjs.Ticker.removeEventListener("tick", this._tick);
			
			this.stage.clear();
			socket.destroy();
		},
		_tick:function(event){
			self._checkDots();
			self.stage.update();
		},
		_initStage:function(){
			this.dots = [];
			var _self = this;
			this.dotInterval = setInterval(function(){
				_self._createDot();
			},1000);
		},
		_clearStage:function(){
			clearInterval(this.dotInterval);
		},
		_createDot:function(){
			var _dot = new createjs.Shape();
			_dot.graphics.beginFill(createjs.Graphics.getRGB(255,0,0));
			_dot.graphics.drawCircle(0,0,20);
			_dot.x = Math.random()*this.stageRect.width|0;
			_dot.y = this.stageRect.height;
			_dot.vx = Math.max(-20,Math.min(20,Math.random()*(this.stageRect.width/2-_dot.x)*0.05));
			_dot.vy = -Math.random()*(this.stageRect.height*0.025)-(this.stageRect.height*0.025);
			this.dots.push(_dot);
			this.stage.addChild(_dot);
		},
		_checkDots:function(){
			var _self = this;
			var _len = this.dots.length;
			for(var i=_len-1; i>=0; i--){
				var _dot = this.dots[i];
				_dot.vy += 1;
				_dot.x = (_dot.x+_dot.vx)|0;
				_dot.y = (_dot.y+_dot.vy)|0;
				if(_dot.y > this.stageRect.height){
					this.stage.removeChild(_dot);
					this.dots.splice(i,1);
				}else{
					var _len2 = this.touch.pathPos.length;
					if(_len2 > 1){
						for(var j=0; j<_len2; j++){
							var _pos = this.touch.pathPos[j];
							var _w = _dot.x-_pos.x;
							var _h = _dot.y-_pos.y;
							var _d = Math.pow(Math.pow(_w,2)+Math.pow(_h,2),0.5);
							if(_d<20){
								TweenMax.to(_dot, 0.3, {alpha:0, scaleX:3, scaleY:3, onComplete:function(){
									_self.stage.removeChild(_dot);
								}});
								this.dots.splice(i,1);
								break;
							}
						}
					}
				}
			}
		}
	});
	return view;
});
