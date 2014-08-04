define({
    PAGE: "page",
    EVENT: "event",
    tracking: function(type, str1, str2) {
        //baidu
        /*switch(type)
         {
         case this.PAGE:
         _hmt.push(["_trackPageview",str2]);
         break;
         case this.EVENT:
         _hmt.push(["_trackEvent",str2,"click"]);//category, action, opt_label, opt_value
         break;
         }*/

        //google
        /*switch(type)
         {
         case this.PAGE:
         _gaq.push(["_trackPageview",str2]);
         break;
         case this.EVENT:
         _gaq.push(["_trackEvent",str2,"click"]);//category, action, opt_label, opt_value, opt_noninteraction
         break;
         }*/

        //adm
        /*switch(type)
         {
         case this.PAGE:
         if(str1 == "") _smq.push(["pageview",str2,str2]);
         else _smq.push(["pageview",str1,str2]);
         break;
         case this.EVENT:
         if(str1 == "") _smq.push(["custom",str2,str2]);
         else _smq.push(["custom",str1,str2]);//category, action, opt_label, opt_value, opt_noninteraction
         break;
         }*/
    }
});