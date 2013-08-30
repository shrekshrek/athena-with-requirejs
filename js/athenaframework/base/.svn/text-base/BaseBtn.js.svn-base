define(["baseView"],function(BaseView){
	var view = BaseView.extend({
		MOUSE_OVER:"mouseover",
		MOSUE_OUT:"mouseout",
		CLICK:"click",
		_isMouseOver:null,
		_isSelected:null,
		_isEnable:null,
		init:function(args){
			BaseView.prototype.init.apply(this,[args]);
			this._isMouseOver = false,
			this._isSelected = false,
			this._isEnable = false,
			this.enable(true);
		},
		destroy:function(){
			this.enable(false);
			BaseView.prototype.destroy.apply(this);
		},
		mouseOverHandler:function(){
		},
		mouseOutHandler:function(){
		},
		clickHandler:function(){
		},
		selected:function(_bool){
			if(_bool == this._isSelected) return;
			var _self = this;
			if(_bool){
				this.mouseOverHandler();
				this._isSelected = _bool;
			}else{
				this._isSelected = _bool;
				this.mouseOutHandler();
			}
			//this.enable(!_bool);
		},
		enable:function(_bool){
			if(_bool == this._isEnable) return;
			var _self = this;
			if(_bool){
				this.$el.css("cursor","pointer");
				this.$el.on("mouseenter",function(event){
					_self._isMouseOver = true;
					_self.trigger(_self.MOUSE_OVER);
					_self.mouseOverHandler(event);
					//return false;
				});
				this.$el.on("mouseleave",function(event){
					_self._isMouseOver = false;
					_self.trigger(_self.MOSUE_OUT);
					_self.mouseOutHandler(event);
					//return false;
				});
				this.$el.on("click",function(event){
					_self.trigger(_self.CLICK);
					_self.clickHandler(event);
					//return false;
				});
			}else{
				this.$el.css("cursor","auto");
				this.$el.off("mouseenter");
				this.$el.off("mouseleave");
				this.$el.off("click");
			}
			this._isEnable = _bool;
		}
	});
	return view;
});


