#Athenaframework  
a js web framework base on backbone.js & require.js  
Athena是一个基于Backbone和requirejs的前端框架。结构清晰，管理方便。

*version:1.1.1*  
*date:2014.08.27*  
添加assets加载机制，让每个页面的预载更灵活。

*version:1.1.0*  
*date:2014.07.31*  
添加grunt-imagemin图片压缩功能。

*version:1.0.1*  
*date:2014.03.17*

*version:1.0.0*  
*date:2014.01.23*

*version:0.0.1*  
*date:2013.06.13*

authur:shrek.wang  
http://shrekwang.duapp.com/

##Athena是什么？
各位前端开发者都了解，js虽然强大，但是在网站开发过程中确实有很多地方用起来不是很爽。比如开发过程中单个js文件写的很大，不容易维护，oop开发方面也比较弱。。。。。。这里不一一累述。  
特别是从其他领域（比如aser）转过来的jser们，这些问题更加明显，写起来更加不习惯。  
当然js中也有很多优秀的框架和第三方库来解决这些问题，比如下面这些  

backbone，优秀的mvc框架，方便oop开发，让大家继续使用熟悉的创建类，继承类，覆盖扩展方法等等，  
requirejs，让我们可以把臃肿复杂的js按照模块分拆，然后按需加载使用，结合backbone，可以让我们的开发习惯延续其他语言的习惯，工程文件结构清晰，代码结构也更加友善易懂，  
jquery，功能大家都懂得，虽然稍显庞大  
underscore，非常好用的方法集，也是backbone的强依赖库，其他项目中也推荐独立使用  
TweenMax，功能强大的第三方类库，原as下就很好用，出了js版后延续了易用强大的特点，继续成为html网站开发不可或缺的运动控制类  

Athena，整合以上各种强大通用的第三方库，使html网站开发变得更加美好。  
让开发者可以快速搭建网站，更方便的调整加载流程，层级控制，以及页面管理。对表现层不做任何干预。  
如果开发者有使用过as3下的开发框架gaia framework的经验就可以更快更好的理解这一点  
支持ie7+，firefox，chrome等所有主流浏览器

##Athena适合做什么？
athena适合开发跨平台的单页应用网站，如活动的minisite，产品演示网站等等

##Athena如何使用？
在使用athena框架之前需要先安装nodejs客户端：http://nodejs.org/  
在你的开发环境中需要安装ant插件，eclipse或者aptana的ant插件安装可以参考链接：http://www.netvisions.eu/component/k2/item/33-ant/33-ant.html  
装好ant后，就可以使用build/build.xml进行网站部署和开发，具体部署命令详见下方built命令介绍

##ant命令介绍：
将build包下载放到网站目录下，  
修改site.properties文件中的siteroot值，设置为网站相对当前build目录的相对路径(一般无需修改，直接把build放在网站根目录即可)。  
修改site.properties文件中的sitename值，设置网站title(也可以在网站部署好后直接修改index.html的title)。  
将build.xml装载进ant，使用相关命令  
**$create**   将网站创建到之前site地址指定的位置  
**$clean**    清除site下相关网站文件及目录（慎用！！！）  
**$clean-built**    清除site下所有压缩过的built文件夹  
**$compile**  发布并优化css文件夹和js文件夹下文件，tpl中的html文件会自动打包成js文件以方便cdn跨域调用。生成新的优化文件包，以-build结尾。最后会将index.html中相关地址指向新的优化文件包  
**$link-to-built** 将index.html中的css和js指向压缩过的built文件夹  
**$link-to-origin** 将index.html中的css和js指向原始文件夹  
**$grunt-install** 在使用$compile命令前请先使用此命令安装grunt相关组件，以便使用grunt-imagemin功能  

##Athena API:
Athena所有命令都置于Athena.api下，

**init(stage);**  
设置关联根节点，初始化框架

**flow("normal"|"preload"|"reverse"|"cross");**  
设置页面切换流程,具体含义请参考下方常量说明

**pageTo(data);**  
*data*为节点对象 pagedata,一般情况下节点数据在sitemap.js中设置,一般转场都用这条命令即可  
*data*也可以为节点信息的数组 [pagedata,pagedata,pagedata]，会统一加载后一起执行进场程序  

**pagedata**:{title:"home",routing:"首页",view:"app/view/HomePage",tpl:"app/tpl/home.html",css:"app/tpl/home",depth:"top",flow:"normal",fast:"false",assets:[]}  
*title*:用于识别区分，暂时无用  
*routing*:用于设置页面标头文本  
*view*:每个页面的js文件地址，  
*tpl*:为页面模板html文件地址，  
*css*:为页面的css文件地址，  
*depth*:显示深度，可以使用关键词"preload","top","middle","bottom",也可以使用通配符"+","-"数字.例如"top-1",意为top层的下一层  
*flow*:当前页面进场时流程设置，无效则使用全局流程  
*assets*:当前页面需要额外加载的图片数组  
*fast*:是否快速加载（跳过所有图片加载）  

**pageOn(data);**  
*data*为SiteMap节点对象,效果同pageTo(data);

**pageOff(data);**  
*data*为SiteMap节点对象,此处也可以传string字符串，或者数字，用户指定页面中某层级的内容退场，也可以指定一个数组的页面一起退场

**preloader(data,{complete:function});**  
*data*为节点对象，function为加载设置完成的回调函数，data为空则取消preload显示组件  
如果参数为空则获取当前preloader对象  

**preloadFast(bool);**  
*bool*为布尔值，是否跳过预载。true时在加载完html和css文件后立即置入场景触发进场。false时会在html页面中所有img标签的图片全部加载完成后置入场景触发进场动画。  
**preloadFast();**  
返回bool布尔值

**fullScreen(bool);**  
*bool*为布尔值，是否设置全屏，true为全屏显示无滚动条，false为普通显示，滚动条显示状态为auto。rect设置全屏状态下的最小分辨率，低于此分辨率强制出现滚动条(默认值为1x1)。  
**fullScreen();**  
返回bool布尔值

**windowRect();**  
获取当前窗口分辨率

**windowRectMin(rect);**  
*rect*设置窗口最小分辨率  
**windowRectMin();**  
获取窗口最小分辨率

**stageRect();**  
获取当前场景分辨率

**getPage(data);**  
获取指定data的页面实例

**getPageAt(depth);**  
获取指定depth层级的页面实例,默认depth为0，即"middle"层。

**resize();**  
当页面尺寸变化时自动调用，发布resize事件。需要时也可以主动调用，所有page扩展页会响应全局resize事件一起刷新。

##Athena EVENTS:
**Athena.trigger(Athena.WINDOW_RESIZE);**  
**Athena.trigger(Athena.PRELOAD_PREPARE);**  
**Athena.trigger(Athena.FLOW_COMPLETE, {data:当前流程的页面信息});**  
**Athena.trigger(Athena.FLOW_START, {data:当前流程的页面信息});**  
使用Backbone的on或listenTo就可以监听这些全局事件。

##Athena CONST:
页面深度常量  
**PRELOAD:"preload"**  等价于z-index = 1000  
**TOP:"top"**          等价于z-index = 500  
**MIDDLE:"middle"**    等价于z-index = 0  
**BOTTOM:"bottom"**    等价于z-index = -500  
Athena.api.getPageAt(depth);此命令有时会需要用到这些变量以获取相应层级的页面。

页面切换方式常量  
**NORMAL:"normal"**    普通切换方式：1。当前页面退场。2。加载新页面。3。新页面进场。  
**PRELOAD:"preload"**  预载切换方式：1。加载新页面。2。当前页面退场。3。新页面进场。  
**REVERSE:"reverse"**  反转切换方式：1。加载新页面。2。新页面进场。3。当前页面退场。  
**CROSS:"cross"**      交叉切换方式：1。加载新页面。2。新页面进场。当前页面退场。同时进行。  
Athena.api.flow(flow);此命令会用到这些变量以用来设置页面切换方式。

页面间切换状态常量  
**FLOW_START:"flowStart"**           页面切换流程开始时发布此事件  
**FLOW_COMPLETE:"flowComplete"**     页面切换流程结束时发布此事件  
**WINDOW_RESIZE:"windowResize"**     窗体尺寸变化时发布此事件  
**PRELOAD_PREPARE:"preloadPrepare"** 预载页准备完成时发布此事件（常用于网站开始前侦听此事件）  
这些是全局事件变量，任何地方有需要都可以通过使用Backbone的on或listenTo就可以监听这些全局事件。

##Athena 相关基类:
Athena所有基类都置于Athena.view下  
**BaseView**   为视图类基类，当页面中有需要添加新元素是可以直接继承此类做各种扩展  
	init:function(){  
		Athena.view.BasePage.prototype.init.apply(this);  
	},  
	destroy:function(){  
		Athena.view.BasePage.prototype.destroy.apply(this);  
	},  
	resize:function(){  
		Athena.view.BasePage.prototype.resize.apply(this);  
	}  
另：本基类含有两个方法：  
addChild(view,$dom); 将视图类加入view视图类中，添加入page页面类的view视图会跟随page类执行resize()和destroy().  
removeChild(view);   将视图类移出view视图类。移出后自动执行destroy();  

**BaseBtn**    为按钮类基类，继承自BaseView，有css搞不定的特殊需求按钮时可以使用此类扩展自己所需按钮类（当然如果能使用css做按钮会方便很多，省得创建很多js来管理按钮了）  

**BasePage**   为页面类的基类，所有page和pop都继承自此类，继承并可以覆写的方法如下（可参考js/app/view/下页面和弹窗文件）：  
	init:function(){  
		Athena.view.BasePage.prototype.init.apply(this);  
	},  
	destroy:function(){  
		Athena.view.BasePage.prototype.destroy.apply(this);  
	},  
	resize:function(){  
		Athena.view.BasePage.prototype.resize.apply(this);  
	},  
	transitionIn:function(){  
		Athena.view.BasePage.prototype.transitionIn.apply(this);  
	},  
	transitionInComplete:function(){  
		Athena.view.BasePage.prototype.transitionInComplete.apply(this);  
	},  
	transitionOut:function(){  
		Athena.view.BasePage.prototype.transitionOut.apply(this);  
	},  
	transitionOutComplete:function(){  
		Athena.view.BasePage.prototype.transitionOutComplete.apply(this);  
	}  

##Athena 扩展组件:
组件在app/js/libs/athena/ui/下，目前可以使用的组件只有两个，  
scroller 范例参考workspage  
easybtn  目前没在范例中使用，一般情况下的按钮交互效果建议尽量使用css实现  

##网站文件结构：
Athena.js 为框架主文件，组织图解如下：  
![组织图解](readme_img1.gif)  

如上图，  
athena框架核心文件位于*libs/athena/*文件夹中  
app/ 为网站文件所在，SiteMap.js记录网站所有的页面节点，
main.js 里需要为所有使用的js文件注册一个对应的变量名，以方便以后的js文件来书写依赖关系。(开发中别忘记每个新建的模块js需要在main中注册一个变量，使用起来才更方便，这里需要熟悉requirejs的使用方法)

在首页html中只需加入一行  
![首页代码](readme_img2.gif)
即可载入并启动整站  

##应用案例：
http://kyrios.hvsop.cn/  
http://pc4.hvsop.cn/  
http://outdoor.adidasevent.com/  
http://minutemaid.qq.com/  

##其他：
本框架仅为本人开发方便之用，如有问题，不吝赐教。QQ:274924021  



