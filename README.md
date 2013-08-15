athenaframework
===============
a js web framework base on backbone.js & require.js


Athena API:
init(stage);				设置关联根节点，初始化框架

pageTo(data);				data为节点对象 pagedata,一般情况下节点数据在sitemap.js中设置,一般转场都用这条命令即可
							data也可以为节点信息的数组 [pagedata,pagedata,pagedata]，会统一加载后一起执行进场程序
								pagedata:{title:"home",routing:"首页",view:"app/view/HomePage",template:"app/template/home.html",depth:"top",flow:"normal"} 
								title:用于识别区分，暂时无用
								routing:用于设置页面标头文本
								view:每个页面的js文件地址，
								template:为页面模板html文件地址，
								depth:显示深度，可以使用关键词"preload","top","middle","bottom",也可以使用通配符"+","-",例如"top-"
								flow:当前页面进场时流程设置，无效则使用全局流程
	
pageOn(data);				data为SiteMap节点对象,效果同pageTo(data);

pageOff(data);				data为SiteMap节点对象,此处也可以传string字符串，或者数字，用户指定页面中某层级的内容退场

preloader(data,complete);	data为节点对象，function为加载设置完成的回调函数，data为空则取消preload显示组件

fullScreen(bool);			bool为布尔值，是否设置全屏，true为全屏显示无滚动条，false为普通显示，滚动条显示状态为auto。rect设置全屏状态下的最小分辨率，低于此分辨率强制出现滚动条(默认值为1000x560)。
fullScreen();				返回bool布尔值

windowRectMin(rect);		设置页面最小分辨率
windowRectMin();			获取页面最小分辨率

getPage(data);				获取指定data的页面实例

getPageAt(depth);			获取指定depth层级的页面实例


文件结构说明：
Athena.js 为框架主文件，