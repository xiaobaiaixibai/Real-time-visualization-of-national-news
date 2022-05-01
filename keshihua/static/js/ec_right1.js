// Date: 2021-11-26 08:32:31
// Editors: 11912990916 刘东凌
// description:图表的制作
var ec_right1 = echarts.init(document.getElementById("r1"), "dark");

var colorList =
    [
        '#929fff', '#9de0ff', '#ffa897', '#af87fe', '#7dc3fe',
        '#bb60b2', '#433e7c', '#f47a75', '#009db2', '#024b51',
        '#0780cf', '#765005', '#e75840', '#26ccd8', '#3685fe',
        '#9977ef', '#f5616f', '#f7b13f', '#f9e264', '#50c48f'
    ];

option_right1 = {
    // 图表标题
    title: {
        show: true,//显示策略，默认值true,可选为：true（显示） | false（隐藏）
        // text: '最新新闻图谱',//主标题文本，'\n'指定换行
        x: 'left',
        y:'top',
        // x: 'center',        // 水平安放位置，默认为左对齐，可选为：
        // 'center' ¦ 'left' ¦ 'right'
        // ¦ {number}（x坐标，单位px）
        // y: 'bottom',             // 垂直安放位置，默认为全图顶端，可选为：
        // 'top' ¦ 'bottom' ¦ 'center'
        // ¦ {number}（y坐标，单位px）
        //textAlign: null          // 水平对齐方式，默认根据x设置自动调整
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: '#ccc',    // 标题边框颜色
        borderWidth: 0,         // 标题边框线宽，单位px，默认为0（无边框）
        padding: 5,             // 标题内边距，单位px，默认各方向内边距为5，
                                // 接受数组分别设定上右下左边距，同css
        itemGap: 10,            // 主副标题纵向间隔，单位px，默认为10，
        textStyle: {
            fontSize: 18,
            fontWeight: 'bolder',
            color: 'white'        // 主标题文字颜色
        },
        subtextStyle: {
            color: '#aaa'        // 副标题文字颜色
        }
    },
    backgroundColor:'rgba(255, 255, 255, 0)',
    tooltip: {},
    animationDurationUpdate: function (idx) {
        // 延迟出现时间,越往后的数据延迟越大
        return idx * 100;
    },
    animationEasingUpdate: 'bounceIn',
    color: ['#fff', '#fff', '#fff'],
    series: [{
        type: 'graph',
        layout: 'force',
        force: {
            repulsion: 500,
            edgeLength: 10
        },
        roam: true,
        label: {
            normal: {
                show: true
            }
        },
        data: [{
            "name": "新冠肺炎愈后一般6个月内不会再得",
            "value": 5000,
            "symbolSize": 48,
            "draggable": true,
            "itemStyle": {
                "normal": {
                    "shadowBlur": 100,
                    "color": colorList[0]
                }
            }
        }, {
            "name": "女篮两连胜后大喊武汉加油",
            "value": 4700,
            "symbolSize": 73,
            "draggable": true,
            "itemStyle": {
                "normal": {
                    "shadowBlur": 100,

                    "color": colorList[1]
                }
            }
        }, {
            "name": "火神山医院开微博",
            "value": 4400,
            "symbolSize": 67,
            "draggable": true,
            "itemStyle": {
                "normal": {
                    "shadowBlur": 100,

                    "color": colorList[2]
                }
            }
        }, {
            "name": "医疗队女队员集体理平头和光头",
            "value": 4100,
            "symbolSize": 50,
            "draggable": true,
            "itemStyle": {
                "normal": {
                    "shadowBlur": 100,

                    "color": colorList[3]
                }
            }
        }, {
            "name": "缅怀疫情中逝去的人们",
            "value": 3800,
            "symbolSize": 88,
            "draggable": true,
            "itemStyle": {
                "normal": {
                    "shadowBlur": 100,

                    "color": colorList[4]
                }
            }
        }, {
            "name": "妨害疫情防控的违法行为",
            "value": 3500,
            "symbolSize": 55,
            "draggable": true,
            "itemStyle": {
                "normal": {
                    "shadowBlur": 100,

                    "color": colorList[5]
                }
            }
        }, {
            "name": "66岁重症患者8天快速康复",
            "value": 3200,
            "symbolSize": 70,
            "draggable": true,
            "itemStyle": {
                "normal": {
                    "shadowBlur": 100,
                    "color": colorList[6]
                }
            }
        }, {
            "name": "别让快递小哥一直等在寒风中",
            "value": 2900,
            "symbolSize": 67,
            "draggable": true,
            "itemStyle": {
                "normal": {
                    "shadowBlur": 100,
                    "color": colorList[7]
                }
            }
        }, {
            "name": "湖北以外地区新增病例数连降5天",
            "value": 2600,
            "symbolSize": 47,
            "draggable": true,
            "itemStyle": {
                "normal": {
                    "shadowBlur": 100,
                    "color": colorList[8]
                }
            }
        }, {
            "name": "女儿写给战疫一线爸爸的信",
            "value": 2300,
            "symbolSize": 82,
            "draggable": true,
            "itemStyle": {
                "normal": {
                    "shadowBlur": 100,
                    "color": colorList[9]
                }
            }
        }]
    }]
}
ec_right1.setOption(option_right1);//放置以进行显示