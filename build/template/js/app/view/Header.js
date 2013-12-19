define(["tracker","basePage","athena","siteMap","siteModel","siteRouter","tweenmax"],function(Tracker,BasePage,Athena,SiteMap,SiteModel,SiteRouter,TweenMax){
	var self;
	var view = BasePage.extend({
		id:"header",
		className:"page",
		init:function(args){
			self = this;
			BasePage.prototype.init.apply(this,[args]);
			
			_.each(this.$el.find("a"), function(obj, index) {
				$(obj).on("click",function(){
					self._navHandler(index);
					return false;
				});
			});
			
			this.listenTo(Athena, Athena.FLOW_COMPLETE, function(){
				this._checkPage();
			});
			
			this.$el.css({opacity:0});
		},
		destroy:function(){
			BasePage.prototype.destroy.apply(this);
		},
		resize:function(){
			BasePage.prototype.resize.apply(this);
		},
		transitionIn:function(){
			BasePage.prototype.transitionIn.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:1, ease:Quart.easeOut, onComplete:function(){
				self.transitionInComplete();
			}});
		},
		transitionOut:function(){
			BasePage.prototype.transitionOut.apply(this);
			if(TweenMax.isTweening(this.$el)) TweenMax.killTweensOf(this.$el);
			TweenMax.to(this.$el, 0.5, {opacity:0, ease:Quart.easeIn, onComplete:function(){
				self.transitionOutComplete();
			}});
		},
		_checkPage:function(){
			var _page = Athena.getPageAt();
			var _id = 0;
			
			if(_page){
				switch(_page.data){
					case SiteMap.home:
						_id = 0;
					break;
					case SiteMap.works:
						_id = 1;
					break;
				}
			}
			
			_.each(this.$el.find("a"), function(obj, index) {
				if(index == _id){
					$(obj).addClass("selected");
				}else{
					$(obj).removeClass("selected");
				}
			});
		},
		_navHandler:function(id){
			switch(id)
			{
				case 0:
					SiteRouter.navigate(SiteMap.home.title, {trigger: true});
				break;
				case 1:
					SiteRouter.navigate(SiteMap.works.title, {trigger: true});
				break;
			}
		}
	});
	return view;
});
