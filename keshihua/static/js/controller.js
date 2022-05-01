// Date: 2021-11-26 08:32:31
// Editors: 11912990916 刘东凌
// description:控制页面动态刷新
function gettime() {
    $.ajax({
        url: "/time",
        timeout: 10000, //超时时间设置为10秒；
        success: function (data) {
            $("#time").html(data)
        },
        error: function (xhr, type, errorThrown) {

        }
    });
}

//
function get_r1_data() {
    $.ajax({
        url: "/r1",
        success: function (data) {
            for (var i = 0; i < 10; i++) {
                option_right1.series[0].data[i].name = data.name[i]
            }
            ec_right1.setOption(option_right1)
        },
        error: function (xhr, type, errorThrown) {
        }
    })
}

function get_c1_data() {
    $.ajax({
        url: "/c1",
        success: function (data) {
            num = data.data;
        },
        error: function (xhr, type, errorThrown) {
        }
    })

};

function get_l1_data() {
    $.ajax({
        url: "/l1",
        success: function (data) {
            a = data.data
        },
        error: function (xhr, type, errorThrown) {

        }
    })
}

function get_l2_data() {
    $.ajax({
        url: "/l2",
        success: function (data) {
            json_data = JSON.parse(data);
            var option_left2 = start(json_data)
            ec_left2.setOption(option_left2)
        },
        error: function (xhr, type, errorThrown) {

        }
    })
}

gettime()
deal_data();
get_c1_data()

get_l1_data()
get_l2_data()
get_r1_data()

setInterval(gettime, 1000)
setInterval(get_c1_data, 1000)
setInterval(get_l2_data, 1000 * 50)
setInterval(ppoot, 1000 * 15)
setInterval(get_l1_data, 1000 * 5)
setInterval(get_r1_data, 1000 * 10)
setInterval(deal_data, 1000 * 30);
