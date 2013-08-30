define(["baseView","tweenMax"],function(BaseView,TweenMax){
	var view = BaseView.extend({
		$list:null,
		$box:null,
		$bg:null,
		mousePos0:{x:0,y:0},
		dragRect:{width:0,height:0},
		init:function(args){
			BaseView.prototype.init.apply(this,[args]);
			this.$list = this.$el.find(".scroll_list");
			this.$box = this.$el.find(".scroll_box");
			this.$bg = this.$el.find(".scroll_bg");
			
			this.dragRect.width = this.$bg.width() - this.$box.width();
			
			var _self = this;
			this.$box.css("cursor","pointer");
			this.$box.on("mousedown",function(event){
				if(_self.dragRect.width == 0) _self.dragRect.width = _self.$bg.width() - _self.$box.width();
				_self.mousePos0.x = event.clientX - _self.$box.position().left;
				_self._dragOn();
				return false;
			});
			
		},
		destroy:function(){
			this.$box.off("mousedown");
			
			BaseView.prototype.destroy.apply(this);
		},
		_dragOn:function(){
			var _self = this;
			$(document).on("mousemove",function(event){
				var event = event || window.event;
                var _dx = event.clientX - _self.mousePos0.x;
                _dx = Math.min(_self.dragRect.width, Math.max(0, _dx));
                _self.$box.css({"left":_dx});
                var _x = -_dx/_self.dragRect.width*(_self.$list.width()-_self.$bg.width());
                TweenMax.to(_self.$list, 0.3, {"left":_x});
				return false;
			});
			$(document).on("mouseup",function(event){
				_self._dragOff();
				return false;
			});
		},
		_dragOff:function(){
			$(document).off("mousemove");
			$(document).off("mouseup");
		},
		reset:function(){
			this.$box.css({"left":0});
			this.$list.css({"left":0});
		}
	});
	return view;
});