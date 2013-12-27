define(["baseView","tweenmax","jquery.mousewheel"],function(BaseView,TweenMax){
	var self;
	var view = BaseView.extend({
		$parent:null,
		$bar:null,
		$box:null,
		$bg:null,
		mousePos0:{x:0,y:0},
		direction:"v",//v竖向，h横向
		compRect:{width:0,height:0},
		contentRect:{width:0,height:0},
		dragRect:{width:0,height:0},
		init:function(args){
			self = this;
			BaseView.prototype.init.apply(this,[args]);
			
			if(args.direction || args.direction=="v" || args.direction=="h") this.direction = args.direction;
			this.$parent = this.$el.parent();
			if(this.$parent.css("position") != "absolute") this.$parent.css({"position":"relative"});
			this.$el.css({"position":"absolute","left":0,"top":0});
			if(this.$parent.find(".scroll-bar").length == 0) this.$parent.append("<div class='scroll-bar'><div class='scroll-bg'></div><div class='scroll-box'></div></div>");
			this.$bar = this.$parent.find(".scroll-bar");
			if(this.$bar.css("position") != "absolute") this.$bar.css({"position":"relative"});
			this.$bg = this.$bar.find(".scroll-bg");
			this.$bg.css({"position":"absolute","left":0,"top":0});
			this.$box = this.$bar.find(".scroll-box");
			this.$box.css({"position":"absolute","left":0,"top":0,"cursor":"pointer"});
			
			this.update();
			
			this.$box.on("mousedown",this._mouseDown);
			this.$parent.on("mousewheel",this._mouseWheel);
		},
		destroy:function(){
			this.$box.off("mousedown",this._mouseDown);
			this.$parent.off("mousewheel",this._mouseWheel);
			
			BaseView.prototype.destroy.apply(this);
		},
		_dragOn:function(){
			$(document).on("mousemove",this._mouseMove);
			$(document).on("mouseup",this._mouseUp);
		},
		_dragOff:function(){
			$(document).off("mousemove",this._mouseMove);
			$(document).off("mouseup",this._mouseUp);
		},
		_mouseDown:function(event){
			self.mousePos0.y = event.clientY - self.$box.position().top;
			self.mousePos0.x = event.clientX - self.$box.position().left;
			self._dragOn();
			return false;
		},
		_mouseWheel:function(event, delta){
			self._scrollTo(self.$box.position().top - delta*30);
		},
		_mouseMove:function(event){
			var event = event || window.event;
			switch(self.direction){
				case "v":
					var _dy = event.clientY - self.mousePos0.y;
		            self._scrollTo(_dy);
					break;
				case "h":
					var _dx = event.clientX - self.mousePos0.x;
		            self._scrollTo(_dx);
					break;
			}
			return false;
		},
		_mouseUp:function(event){
			self._dragOff();
			return false;
		},
		_scrollTo:function(num){
			switch(self.direction){
				case "v":
					var _dy = num;
		            _dy = Math.min(self.dragRect.height, Math.max(0, _dy));
		            self.$box.css({"top":_dy});
		            var _y = -_dy/self.dragRect.height*(self.contentRect.height-self.compRect.height);
		            TweenMax.to(self.$el, 0.3, {"top":_y});
					break;
				case "h":
					var _dx = num;
		            _dx = Math.min(self.dragRect.width, Math.max(0, _dx));
		            self.$box.css({"left":_dx});
		            var _x = -_dx/self.dragRect.width*(self.contentRect.width-self.compRect.width);
		            TweenMax.to(self.$el, 0.3, {"left":_x});
					break;
			}
		},
		update:function(){
			this.compRect.width = this.$parent.width();
			this.compRect.height = this.$parent.height();
			this.contentRect.width = this.$el.width();
			this.contentRect.height = this.$el.height();
			
			switch(this.direction){
				case "v":
					if(this.contentRect.height <= this.compRect.height){
						this.$bar.css({"display":"none"});
						return;
					}else{
						this.$bar.css({"display":"block"});
					}
					this.$bg.height(this.compRect.height);
					var _n = this.compRect.height/this.contentRect.height*this.compRect.height|0;
					this.$box.height(_n);
					this.dragRect.height = this.compRect.height-_n;
					this.$box.css({"top":this.$el.position().top/(this.compRect.height-this.contentRect.height)*this.dragRect.height});
					break;
				case "h":
					if(this.contentRect.width <= this.compRect.width){
						this.$bar.css({"display":"none"});
						return;
					}else{
						this.$bar.css({"display":"block"});
					}
					this.$bg.width(this.compRect.width);
					var _n = this.compRect.width/this.contentRect.width*this.compRect.width|0;
					this.$box.width(_n);
					this.dragRect.width = this.compRect.width-_n;
					this.$box.css({"left":this.$el.position.left/(this.contentRect.width-this.compRect.width)*this.dragRect.width});
					break;
			}
		},
		reset:function(){
			this.$box.css({"left":0,"top":0});
			this.$el.css({"left":0,"top":0});
		}
	});
	return view;
});