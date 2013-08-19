#athenaframework  
a js web framework base on backbone.js & require.js  
Athena是一个基于Backbone的js前端框架，主要功能是通过SiteMap设置的网站结构

*version:0.0.2*  
*date:2013.08.11*

*version:0.0.1*  
*date:2013.06.13*

authur:shrek.wang  
http://shrekwang.duapp.com/

##athena是什么？:
js虽然强大，但是在网站开发过程中确实有很多地方用起来很不爽。比如js文件过大，不容易维护，oop开发比较弱。。。。。。这里不一一累述。  
athena只是一个整合各种强大通用的第三方库的框架，  
backbone，让我们可以用js进行oop开发，创建类，继承类，覆盖扩展方法等等，  
requirejs，让我们可以把臃肿复杂的js按照模块分拆成各个模块js，按需加载使用，结合backbone，可以让我们的开发习惯延续其他语言的习惯，工程文件结构清晰，代码结构也更加友善易懂，  
jquery，功能大家都懂得，虽然稍显庞大  
underscore，非常好用的方法集，也是backbone的强依赖类  
结合以上功能，开发出athena框架，文件位于athenaframework/文件夹下，athena.js为主文件。athenaframework/base/下为各种基类文件，用于继承使用  

Athena，让开发者可以快速搭建出网站框架，更方便的调整加载流程，层级控制，以及页面管理。  
如果开发者有使用过as3下的开发框架gaia framework的经验就可以更快更好的理解这一点

##Athena API:
**init(stage);**  
设置关联根节点，初始化框架

**pageTo(data);**  
*data*为节点对象 pagedata,一般情况下节点数据在sitemap.js中设置,一般转场都用这条命令即可  
*data*也可以为节点信息的数组 [pagedata,pagedata,pagedata]，会统一加载后一起执行进场程序  
*pagedata*:{title:"home",routing:"首页",view:"app/view/HomePage",template:"app/template/home.html",depth:"top",flow:"normal"}  
*title*:用于识别区分，暂时无用  
*routing*:用于设置页面标头文本  
*view*:每个页面的js文件地址，  
*template*:为页面模板html文件地址，  
*depth*:显示深度，可以使用关键词"preload","top","middle","bottom",也可以使用通配符"+","-",例如"top-"  
*flow*:当前页面进场时流程设置，无效则使用全局流程  
	
**pageOn(data);**  
*data*为SiteMap节点对象,效果同pageTo(data);

**pageOff(data);**  
*data*为SiteMap节点对象,此处也可以传string字符串，或者数字，用户指定页面中某层级的内容退场

**preloader(data,{complete:function});**  
*data*为节点对象，function为加载设置完成的回调函数，data为空则取消preload显示组件

**fullScreen(bool);**  
*bool*为布尔值，是否设置全屏，true为全屏显示无滚动条，false为普通显示，滚动条显示状态为auto。rect设置全屏状态下的最小分辨率，低于此分辨率强制出现滚动条(默认值为1000x560)。  
**fullScreen();**  
返回bool布尔值

**windowRectMin(rect);**  
*rect*设置页面最小分辨率  
**windowRectMin();**  
获取页面最小分辨率

**getPage(data);**  
获取指定data的页面实例

**getPageAt(depth);**  
获取指定depth层级的页面实例


##网站文件结构：
Athena.js 为框架主文件，组织图解如下：  
![组织图解](readme_img1.gif)  


在首页html中只需加入一行  
![首页代码](readme_img2.gif)
即可载入并启动整站

