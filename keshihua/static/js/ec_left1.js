// 作者 高良科
// 学号 11909010535
// 日期 2021-11-2


// 获取随机颜色
var getRandomColor = function () {
    return '#' + (Math.random() * 0xffffff << 0).toString(16);
}
var a = new Array(106);
var zhendeshi_i = 0
// 初始加载数据
a = ['load', 'load', 'load', 'load', 'load'];

function set() {
    $("div[class='text1']").each(function () {
        // 随机改变标题弹幕的文字大小和颜色
        $(this).css("color", "#" + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6));
        $(this).css("font-size", 15 + Math.random() * 7 + "px");
        $(this).text(a[zhendeshi_i]);
        zhendeshi_i++;
        if (zhendeshi_i == 100) {
            zhendeshi_i = 0;
        }
        ;
    });


}
// 定时刷新调用set函数
set()
setInterval(set, 7000);