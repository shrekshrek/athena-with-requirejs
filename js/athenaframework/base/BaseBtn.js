define(["baseView"],function(BaseView){
	var view = BaseView.extend({
		MOUSE_OVER:"mouseover",
		MOSUE_OUT:"mouseout",
		CLICK:"click",
		isMouseOver:false,
		isSelected:false,
		navID:null,
		init:function(args){
			BaseView.prototype.init.apply(this,[args]);
			this.navID = args.navID;
			var _self = this;
			if(this.$el){
				this.$el.css("cursor","pointer");
				this.$el.mouseenter(function() {
					_self.isMouseOver = true;
					_self.trigger(_self.MOUSE_OVER);
					_self.mouseOverHandler();
				});
				this.$el.mouseleave(function() {
					_self.isMouseOver = false;
					_self.trigger(_self.MOSUE_OUT);
					_self.mouseOutHandler();
				});
				this.$el.click(function() {
					_self.trigger(_self.CLICK);
					_self.clickHandler();
				});
			}
		},
		destroy:function(){
			this.$el.off();
		},
		mouseOverHandler:function(){
		},
		mouseOutHandler:function(){
		},
		clickHandler:function(){
		},
		selected:function(_bool){
			if(_bool == this.isSelected) return;
			if(_bool){
				this.mouseOverHandler();
				this.isSelected = _bool;
			}else{
				this.isSelected = _bool;
				if(this.isMouseOver){
					this.mouseOverHandler();
				}else{
					this.mouseOutHandler();
				}
			}
		}
	});
	return view;
});


