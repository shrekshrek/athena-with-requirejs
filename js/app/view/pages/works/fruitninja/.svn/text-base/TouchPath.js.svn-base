define(["easel"],function(){
	var self;
	var view = Backbone.View.extend({
		DRAW:"draw",
		stage:null,
		touchShape:null,
		pathPos:null,
		pathPosMax:20,
		pathThickness:10,
		pathInterval:null,
		pathDelta:0,
		pathDeltaMax:10,
		init:function(stage){
			this.stage = stage;
			
			self = this;
			this.touchShape = new createjs.Shape();
			this.stage.addChild(this.touchShape);
			this.pathPos = [];
			
			createjs.Ticker.addEventListener("tick", self._tick);
			this.stage.addEventListener("stagemousedown", self._mouseDown);
			this.stage.addEventListener("stagemouseup", self._mouseUp);
		},
		destroy:function(){
			createjs.Ticker.removeEventListener("tick", self._tick);
			this.stage.removeEventListener("stagemousedown", self._mouseDown);
			this.stage.removeEventListener("stagemouseup", self._mouseUp);
			this.stage.removeEventListener("stagemousemove", self._mouseMove);
			
			this.touchShape.graphics.clear();
			
			this.remove();
		},
		_mouseDown:function(event){
			if(event.pointerID>0) return;
			self.stage.addEventListener("stagemousemove", self._mouseMove);
			
			self.pathPos = [];
			self.pathPos.push({x:self.stage.mouseX, y:self.stage.mouseY});
			self.pathDelta = self.pathDeltaMax;
		},
		_mouseUp:function(event){
			if(event.pointerID>0) return;
			self.stage.removeEventListener("stagemousemove", self._mouseMove);
		},
		_mouseMove:function(event){
			if(event.pointerID>0) return;
			var _oldPos = self.pathPos[0];
			var _newPos = {x:event.stageX,y:event.stageY};
			if(Math.abs(_newPos.y-_oldPos.y)+Math.abs(_newPos.x-_oldPos.x)<20) return;
			var _r = Math.atan2(_oldPos.y-_newPos.y, _oldPos.x-_newPos.x);
			var _r2 = _r+Math.PI/2;
			self.pathPos.unshift({x:_newPos.x, y:_newPos.y, r1:_r, sin1:Math.sin(_r), cos1:Math.cos(_r), r2:_r2, sin2:Math.sin(_r2), cos2:Math.cos(_r2)});
			self.pathDelta = Math.min(self.pathDelta+2,self.pathDeltaMax);
			if(self.pathPos.length > self.pathPosMax) self.pathPos.pop();
		},
		_tick:function(event){
			self.pathDelta = Math.max(self.pathDelta-2,0);
			
			var _len = self.pathPos.length;
			if(_len > 1){
				self.pathPos.pop();
				self.trigger(self.DRAW);
				self.drawPath(self.pathPos,self.pathDelta);
			}
			
			if(self.pathDelta == 0 && _len > 2){
				self.pathPos.length = 1;
			}
		},
		drawPath:function(path,delta,color){
			var _self = this;
			var _path = [];
			var _pos = null;
			var _r0 = 0;
			var _r1 = 0;
			var _r2 = 0;
			var _w = this.pathThickness;
			var _len = path.length;
			for(var i=_len-1; i>=0; i--){
				if(i == _len-1){
					_path.push(path[i]);
				}else{
					_pos = path[i];
					_w = (_len-i)/_len*this.pathThickness;
					_path.push({x:_pos.x+_pos.cos2*_w*(delta/this.pathDeltaMax),y:_pos.y+_pos.sin2*_w*(delta/this.pathDeltaMax)});
					_path.unshift({x:_pos.x-_pos.cos2*_w*(delta/this.pathDeltaMax),y:_pos.y-_pos.sin2*_w*(delta/this.pathDeltaMax)});
					if(i == 0){
						_path.unshift({x:_pos.x-_pos.cos1*_w,y:_pos.y-_pos.sin1*_w});
					}
				}
			}
			
			this.touchShape.graphics.clear();
			var _color = color?color:createjs.Graphics.getRGB(255,255,255,1.0);
			this.touchShape.graphics.beginFill(_color);
			var _len2 = _path.length;
			for(var j=0; j<_len2; j++){
				if(j==0) this.touchShape.graphics.moveTo(_path[j].x,_path[j].y);
				else this.touchShape.graphics.lineTo(_path[j].x,_path[j].y);
			}
			this.touchShape.graphics.endFill();
		}
	});
	return view;
});
