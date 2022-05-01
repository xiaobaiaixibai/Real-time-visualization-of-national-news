var num = 1571;
var start_time = new Date();

function number() {
    $("div[class='number'] h1").each(function () {
        $(this).text(num);
    })
};

function ntime() {
    $("div[class='num'] h1").each(function () {
        now_time=new Date();
        console.log(now_time.getTime());
        let runTime = parseInt(( now_time.getTime()-start_time.getTime()) / 1000);
        $(this).text(runTime+"s");
    })
};
number()
ntime()
setInterval(number, 1000);

setInterval(ntime, 1000);