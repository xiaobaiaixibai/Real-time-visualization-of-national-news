

//  作者:高良科  
// 学号：11909010535
//时间：2021-12-3

var myChart = echarts.init(document.getElementById("c2"));
var geoJson = {};
var parentInfo = [{
    cityName: '全国',
    code: 100000,
},];
var currentIndex = 0;
// 编辑展示的月份
var timeTitle = ['8月', '9月', '10月', '11月', '12月'];
var json_data = {}

function deal_data() {
    // 基于准备好的dom，初始化echarts实例
    $.ajax({
        url: "/c2",
        success: function (data) {
            // 获取来自主程序的数据
            json_data = JSON.parse(data);

            init(100000);
        },
    })

};


$('<div class="back">返 回</div>').appendTo($('#chart-panel'));

$('.back').css({
    position: 'absolute',
    left: '25px',
    top: '25px',
    color: 'rgb(179, 239, 255)',
    'font-size': '16px',
    cursor: 'pointer',
    'z-index': '100',
});

$('.back').click(function () {
    if (parentInfo.length === 1) {
        return;
    }
    parentInfo.pop();
    init(parentInfo[parentInfo.length - 1].code);
});

// 地图界面初始化
function init(adcode) {
    getGeoJson(adcode).then((data) => {
        geoJson = data;
        getMapData();
    });
}

//这里我封装了下，直接可以拿过来用
// 获取高德地图的行政编码和名称
function getGeoJson(adcode, childAdcode = '') {
    return new Promise((resolve, reject) => {
        function insideFun(adcode, childAdcode) {
            AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
                var districtExplorer = new DistrictExplorer();
                districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
                    if (error) {
                        console.error(error);
                        reject(error);
                        return;
                    }
                    let Json = areaNode.getSubFeatures();
                    if (Json.length === 0) {
                        let parent = areaNode._data.geoData.parent.properties.acroutes;
                        insideFun(parent[parent.length - 1], adcode);
                        return;
                    }

                    if (childAdcode) {
                        Json = Json.filter((item) => {
                            return item.properties.adcode == childAdcode;
                        });
                    }
                    let mapJson = {
                        features: Json,
                    };
                    resolve(mapJson);
                });
            });
        }

        insideFun(adcode, childAdcode);
    });
}

//将来自主数据的数据赋到value里面，通过json_data 的place指定数值
function getMapData() {
    let mapData = [],
        pointData = [],
        sum = 0;
        // 初始让value为0
    geoJson.features.forEach((item) => {
        let value = 0;

        if (json_data['place'][currentIndex.toString()].hasOwnProperty(item.properties.name)) {

            value = json_data['place'][currentIndex.toString()][item.properties.name.toString()]

        }



// 加入到数据列表里
        mapData.push({
            name: item.properties.name,
            value: value,
            cityCode: item.properties.adcode,
        });
        pointData.push({
            name: item.properties.name,
            value: [item.properties.center[0], item.properties.center[1], value],
            cityCode: item.properties.adcode,
        });

        sum += value;
    });
    mapData = mapData.sort(function (a, b) {
        return b.value - a.value;
    });

    initEchartMap(mapData, sum, pointData);
}

//渲染echarts，下面都是echars的标准代码
function initEchartMap(mapData, sum, pointData) {
    var xData = [],
        yData = [];
    var min = mapData[mapData.length - 1].value;
    var max = mapData[0].value;
    if (mapData.length === 1) {
        min = 0;
    }
    mapData.forEach((c) => {
        xData.unshift(c.name);
        yData.unshift(c.value);
    });
    //这里做个切换，全国的时候才显示南海诸岛  只有当注册的名字为china的时候才会显示南海诸岛
    echarts.registerMap(parentInfo.length === 1 ? 'china' : 'map', geoJson);
    var option = {

        timeline: {
            data: timeTitle,
            axisType: 'category',
            autoPlay: true,
            playInterval: 5000,
            left: '10%',
            right: '10%',
            bottom: '2%',
            width: '80%',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgb(179, 239, 255)',
                    },
                },
                emphasis: {
                    textStyle: {
                        color: '#fff',
                    },
                },
            },
            currentIndex: currentIndex,
            symbolSize: 10,
            lineStyle: {
                color: '#8df4f4',
            },
            checkpointStyle: {
                borderColor: '#8df4f4',
                color: '#53D9FF',
                borderWidth: 2,
            },
            controlStyle: {
                showNextBtn: true,
                showPrevBtn: true,
                normal: {
                    color: '#53D9FF',
                    borderColor: '#53D9FF',
                },
                emphasis: {
                    color: 'rgb(58,115,192)',
                    borderColor: 'rgb(58,115,192)',
                },
            },
        },
        baseOption: {

            backgroundColor: 'rgba(255, 255, 255, 0)',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            grid: {
                right: '2%',
                top: '12%',
                bottom: '8%',
                width: '0',
            },
            toolbox: {
                feature: {
                    restore: {
                        show: false,
                    },
                    dataView: {
                        show: false,
                    },
                    saveAsImage: {
                        name: parentInfo[parentInfo.length - 1].cityName + '销售额统计图',
                    },
                    dataZoom: {
                        show: false,
                    },
                    magicType: {
                        show: false,
                    },
                },
                iconStyle: {
                    normal: {
                        borderColor: '#1990DA',
                    },
                },
                top: 15,
                right: 35,
            },
            geo: {
                map: parentInfo.length === 1 ? 'china' : 'map',
                zoom: 1.1,
                roam: true,
                left: '25%',
                top: '15%',
                tooltip: {
                    trigger: 'item',
                    formatter: (p) => {
                        let val = p.value[2];
                        if (window.isNaN(val)) {
                            val = 0;
                        }
                        let txtCon =
                            "<div style='text-align:left'>" + p.name + ':<br />热点值：' + val.toFixed(2) + '</div>';
                        return txtCon;
                    },
                },
                label: {
                    normal: {
                        show: true,
                        color: 'rgb(249, 249, 249)', //省份标签字体颜色
                        formatter: (p) => {
                            switch (p.name) {
                                case '内蒙古自治区':
                                    p.name = '内蒙古';
                                    break;
                                case '西藏自治区':
                                    p.name = '西藏';
                                    break;
                                case '新疆维吾尔自治区':
                                    p.name = '新疆';
                                    break;
                                case '宁夏回族自治区':
                                    p.name = '宁夏';
                                    break;
                                case '广西壮族自治区':
                                    p.name = '广西';
                                    break;
                                case '香港特别行政区':
                                    p.name = '香港';
                                    break;
                                case '澳门特别行政区':
                                    p.name = '澳门';
                                    break;
                            }
                            return p.name;
                        },
                    },
                    emphasis: {
                        show: true,
                        color: '#f75a00',
                    },
                },
                itemStyle: {
                    normal: {
                        areaColor: '#24CFF4',
                        borderColor: '#53D9FF',
                        borderWidth: 1.3,
                        shadowBlur: 15,
                        shadowColor: 'rgb(58,115,192)',
                        shadowOffsetX: 7,
                        shadowOffsetY: 6,
                    },
                    emphasis: {
                        areaColor: '#8dd7fc',
                        borderWidth: 1.6,
                        shadowBlur: 25,
                    },
                },
            },
            visualMap: {
                min: min,
                max: max,
                left: '3%',
                bottom: '5%',
                calculable: true,
                seriesIndex: [0],
                inRange: {
                    color: ['#24CFF4', '#2E98CA', '#1E62AC'],
                },
                textStyle: {
                    color: '#24CFF4',
                },
            },
            series: [{

                name: timeTitle[currentIndex] + '年销售额度',
                type: 'map',
                geoIndex: 0,
                map: parentInfo.length === 1 ? 'china' : 'map',
                roam: true,
                zoom: 1.3,
                tooltip: {
                    trigger: 'item',
                    formatter: (p) => {
                        let val = p.value;
                        if (p.name == '南海诸岛') return;
                        if (window.isNaN(val)) {
                            val = 0;
                        }
                        let txtCon =
                            "<div style='text-align:left'>" +
                            p.name +
                            ':<br />热点值：' +
                            val.toFixed(2) +
                            '</div>';
                        return txtCon;
                    },
                },
                label: {
                    normal: {
                        show: false,
                    },
                    emphasis: {
                        show: false,
                    },
                },
                data: mapData,
            },
                {
                    name: '散点',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    rippleEffect: {
                        brushType: 'fill',
                    },
                    itemStyle: {
                        normal: {
                            color: '#2be29c',
                            shadowBlur: 10,
                            shadowColor: '#333',
                        },
                    },
                    data: pointData,

                    symbolSize: function (val) {
                        let value = val[2];
                        if (value == max) {
                            return 27;
                        }
                        return 10;
                    },
                    showEffectOn: 'render', //加载完毕显示特效
                }

            ],
        },
    };

    myChart.setOption(option, true);

    //点击前解绑，防止点击事件触发多次
    myChart.off('click');
    myChart.on('click', echartsMapClick);

    //监听时间切换事件
    myChart.off('timelinechanged');
    myChart.on('timelinechanged', (params) => {
        currentIndex = params.currentIndex;
        getMapData();
    });
}

//echarts点击事件
function echartsMapClick(params) {
    if (!params.data) {
        return;
    } else {
        //如果当前是最后一级，那就直接return
        if (parentInfo[parentInfo.length - 1].code == params.data.cityCode) {
            return;
        }
        let data = params.data;
        parentInfo.push({
            cityName: data.name,
            code: data.cityCode,
        });
        init(data.cityCode);
    }
};


