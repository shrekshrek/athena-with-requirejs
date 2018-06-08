define(['bone'], function(Bone) {
    var model = Bone.extend({}, Bone.Events, {
        ua: function () {
            var u = navigator.userAgent;
            var u2 = navigator.userAgent.toLowerCase();
            return {
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                wechat: u2.match(/MicroMessenger/i) == "micromessenger",
                weibo: u2.match(/WeiBo/i) == "weibo",
                ali: u.indexOf('AliApp') > -1,
                meitu: /(com.meitu)/gi.test(u2),
                ding: u.indexOf('DingTalk') > -1,
            };
        }(),

        query: function () {
            var queryObj = {};
            var reg = /[?&]([^=&#]+)=([^&#]*)/g;
            var querys = window.location.search.match(reg);
            if (querys) {
                for (var i in querys) {
                    var query = querys[i].split('=');
                    var key = query[0].substr(1),
                        value = query[1];
                    queryObj[key] ? queryObj[key] = [].concat(queryObj[key], value) : queryObj[key] = value;
                }
            }
            return queryObj;
        }(),


    });
    return model;
});
