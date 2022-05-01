var json_data = {}
var ec_left2 = echarts.init(document.getElementById('l2'));//定位所要宣传的前端标签

// 1190 399 0625 陈奕帆
function start(json_data) {
    var colors = ['#0278e6', '#34d160', '#fcdf39', '#f19611', '#00c6ff', '#f76363', '#7FFFD4', '#808000', '#DEB887', '#DEB887', '#FFFAF0', '#008B45'].reverse();//渲染的颜色数组
    var data = json_data['pie']//定义键值对
    console.log(data)
    // 1190 399 0625 陈奕帆
    var total = json_data['total']//定义键值对
    console.log('this is total', total)
    option = {
        backgroundColor: 'rgba(255, 255, 255, 0)',//设置option的背景颜色
        color: colors,//给予颜色数组

        tooltip: {
            trigger: 'item',//触发类型
            formatter: '{a} <br/>{b} : {c} ({d}%)'//呈现的内容格式
        },
        // 1190 399 0625 陈奕帆
        series: [{
            name: '',
            type: 'pie',
            radius: ['18%', '40%'],//设置半径
            center: ['40%', '50%'],//设置饼状图中心
            roseType: 'radius',//设置效果类型
            minShowLabelAngle: 0,//设置最小标签的角度
            label: {
                // 1190 399 0625 陈奕帆
                show: true,//需要展示
                normal: {
                    position: 'outside',//放置的位置
                    fontSize: 16,//标签内容中的字体大小
                    formatter: (params) => {
                        return params.name + '(' + (params.value / total * 100).toFixed(2) + '%)' + '\n';//根据值计算百分比
                           // 1190 399 0625 陈奕帆     
                    }
                }
            },
            labelLine: {
                length: 2,//标签线的内长度
                length2: 25,//表前线的外长度
                smooth: true//是否平滑
            },
            data: data//标签里所放的数据
        }]
    };
        // 1190 399 0625 陈奕帆
    return option//返回给值
}

setInterval(deal_data, 3000)//ajax发送动态刷新请求，更换数据
// ec_left2.setOption(option_left2)
// 1190 399 0625 陈奕帆