var ec_right2 = echarts.init(document.getElementById('r2'));//获取需要宣传的前端标签
var flag = 0;//后续截取响应信息
// 1190 399 0625 陈奕帆
function ppoot() {
    $.ajax({//ajax请求，获取数据
        url: "/r2", type: "post", success: function (data) {
            title = data.key//每一个节点所展示的内容信息
            key = data.value//每一节点的值，后续根据该值定义大小

        }
    })
// 1190 399 0625 陈奕帆

    var colors = [//颜色的数组
        "#00ADD0",
        "#FFA12F",
        "#B62AFF",
        "#604BFF",
        "#6E35FF",
        "#002AFF",
        "#20C0F4",
        "#95F300",
        "#04FDB8",
        "#AF5AFF"
    ]
    // 1190 399 0625 陈奕帆
    var getdata = function getData() {
        let data = {
            name: "",//最中心的枢纽值
            value: 0,
            children: []//数组存放子节点（即省份是枢纽的子节点，关键字是省份的子节点）
        };
// 1190 399 0625 陈奕帆
        let tt = title//后端处理过的新闻标题（列表格式的字符串）
        let kk = key//后端处理过的关键字（列表格式的字符串）
// 1190 399 0625 陈奕帆
        t = tt.split(',')//对字符串切分成数组
        k = kk.split('], [')//对字符串切分成数组
        let num = t.length / 5//将数组分为5份
        //根据flag值，决定展示数组中的哪组数据
        if (flag == 0) {
            tit = t.slice(0, Math.floor(num));//向下取整
            ke = k.slice(0, Math.floor(num));
            flag = 1;
        } else if (flag == 1) {
            tit = t.slice(Math.ceil(num), Math.ceil(num * 2));
            // 1190 399 0625 陈奕帆
            ke = k.slice(Math.ceil(num), Math.ceil(num * 2));
            flag = 2;
        } else if (flag == 2) {
            tit = t.slice(Math.ceil(num * 2), Math.ceil(num * 3));
            ke = k.slice(Math.ceil(num * 2), Math.ceil(num * 3));
            flag = 3
        } else if (flag == 3) {
            tit = t.slice(Math.ceil(num * 3), Math.ceil(num * 4));
            // 1190 399 0625 陈奕帆
            ke = k.slice(Math.ceil(num * 3), Math.ceil(num * 4));
            flag = 4
        } else if (flag == 4) {
            tit = t.slice(Math.ceil(num * 4));
            ke = k.slice(Math.ceil(num * 4));
            flag = 0
        }
// 1190 399 0625 陈奕帆

        for (i in tit) {
            let obj = {
                name: tit[i],//获取新闻标题
                value: i + 1,//递增层次值，后续渲染
                children: []//子节点，存放关键字
            }

            // 1190 399 0625 陈奕帆
            
            m = ke[i].split('\', \'')//切分关键字
            for (j in m) {//遍历关键字
                let obj2 = {
                    name: m[j],//获取关键字
                    value: 2//定义层次值，后续渲染
                };
                obj.children.push(obj2)//将所有关键字的信息放在对应的省份
            }
            data.children.push(obj)//将该新闻省份即下面的关键字放到枢纽值
        }
// 1190 399 0625 陈奕帆
        let arr = []
        arr.push(data)//将所有格式好的数据放入数组

        arr = handle(arr, 0)//渲染
        //  console.log(arr);
        return arr;
// 1190 399 0625 陈奕帆
    }

    var handle = function handleData(data, index, color = '#00f6ff') {
        //index标识第几层
        return data.map((item, index2) => {
            //计算出颜色
            if (index == 1) {
                color = colors.find((item, eq) => eq == index2 % 10);
            }
            // 设置节点大小
            if (index === 0 || index === 1) {
                item.label = {
                    position: "inside",//标签所放置的位置
                    //   rotate: 0,
                    //   borderRadius: "50%",
                }
                // 1190 399 0625 陈奕帆
            }
            // 设置label大小
            switch (index) {
                case 0:
                    item.symbolSize = 7
                    break;
                case 1:
                    item.symbolSize = 40
                    break;
                default:
                    item.symbolSize = 10
                    break;
            }
            // 设置线条颜色
            item.lineStyle = {color: color}
// 1190 399 0625 陈奕帆
            if (item.children) {//存在子节点
                item.itemStyle = {
                    borderColor: color,//背景颜色
                    color: color//标签颜色
                };
                item.children = handle(item.children, index + 1, color)//遍历，对下面的子节点依次渲染
            } else {//不存在
                item.itemStyle = {
                    color: 'transparent',//没有子节点就设一个颜色
                    borderColor: color//根据响应的值放背景颜色
                };
            }
            // 1190 399 0625 陈奕帆
            return item
        })
    }


    var option = {
        title: {
        show: true,//显示策略，默认值true,可选为：true（显示） | false（隐藏）
        // text: '城市放射树',//主标题文本，'\n'指定换行
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
        type: "tree",
        backgroundColor: 'rgba(255, 255, 255, 0)',
        toolbox: { //工具栏
            show: true,
            // 1190 399 0625 陈奕帆
            iconStyle: {
                borderColor: "#03ceda"
            },
            // feature: {
            //   myButton:{
            //       icon:'path://M1933.276831 981.457416H42.542584V42.542584h1890.734247v938.914832',
            //       onclick:function (){
            //           if (flag==0){
            //               flag=1
            //           }
            //           else {flag=0}
            //           alert(flag)
            //       }
            //   }
            // }
        },
        tooltip: {//提示框
            trigger: "item",//触发形式
            triggerOn: "mousemove",//鼠标移动的形式触发
            backgroundColor: "rgba(1,70,86,1)",//设置背景颜色
            borderColor: "rgba(0,246,255,1)",//设置边界颜色
            borderWidth: 0.5,//边界宽
            // 1190 399 0625 陈奕帆
            textStyle: {
                fontSize: 10//字体大小
            }
        },
        series: [
            {
                type: "tree",
                hoverAnimation: true, //hover样式
                data: getdata(),//触发函数，获取渲染的数据（已格式化完毕）
                top: 0,//上方距离
                bottom: 0,//中间距离
                left: 0,//左边距离
                right: 0,//右边距离
                layout: "radial",
                symbol: "circle",//展示的整体图形
                symbolSize: 10,
                nodePadding: 20,
                // 1190 399 0625 陈奕帆
                animationDurationUpdate: 750,
                expandAndCollapse: true, //子树折叠和展开的交互，默认打开
                initialTreeDepth: 2,
                roam: true, //是否开启鼠标缩放和平移漫游。scale/move/true
                focusNodeAdjacency: true,
                itemStyle: {
                    borderWidth: 1,
                },
                label: { //标签样式
                    color: "#fff",//标签颜色
                    fontSize: 10,//内容的字体大小
                    fontFamily: "SourceHanSansCN",//内容字体类型
                    position: "inside",//位置
                    rotate: 0,
                },
                // 1190 399 0625 陈奕帆
                lineStyle: {
                    width: 1,//线宽
                    curveness: 0.5,
                }
            }
        ]
    };
    ec_right2.clear();//清楚之前的渲染信息（因为要ajax更换）
    ec_right2.setOption(option)
    // 1190 399 0625 陈奕帆
}

ppoot()