import scrapy
from xinhua.items import XinhuaItem
import time
#1190 399 0625 陈奕帆
class XinjingSpider(scrapy.Spider):
    name = 'xinjing'#爬虫姓名
    allowed_domains = ['bjnews.com.cn']#爬虫域名
    start_urls = ['https://www.bjnews.com.cn/news']#爬虫起始url
    def start_requests(self):
        #1190 399 0625 陈奕帆
        yield scrapy.Request('https://www.bjnews.com.cn/news',meta={"ldl":True})  #重写start_requests方法，进行页面链接访问请求
    def parse_news(self, response):
        #1190 399 0625 陈奕帆
        title = response.xpath('//*[@class="bodyTitle"]/div/h1/text()').extract()[0]#爬取新闻的标题
        timer = response.xpath('//span[@class="timer"]/text()').extract()[0]#爬取新闻发表的时间
        s = "".join(response.xpath('//div[@class="content-name"]//text()').extract())#拼接新闻正文
        info="".join(s.split())
        item = XinhuaItem()#爬取的相关信息在item进行注册
        item['title']=title#注册新闻的标题

#1190 399 0625 陈奕帆
        
        item['time']=timer#注册新闻的发布时间
        item['maintxt']=info#注册新闻的正文 
        url = response.request.url#当前爬取页面的url
        item['url'] = url
        item['ab'] = ''
        #1190 399 0625 陈奕帆
        item['kw']=''#关键字，后续数据处理
        item['city'] = ''#新闻发生的城市地点，后续数据处理
        item['web']="新京"#所爬取的=官方网站
        print("新京")
        yield item#返回给pipeline以后续保存至数据库

#1190 399 0625 陈奕帆
    def parse(self, response):
        divs = response.xpath('//div[@id="waterfall-container"]/div')#通过xpath获取含有新闻链接的标签
        for div in divs:#遍历
            href = div.xpath('.//div[@class="pin_demo"]/a/@href').extract()[0]#获取链接
            #1190 399 0625 陈奕帆
            yield scrapy.Request(href,callback=self.parse_news,meta={"ldl":True})#再次发送request请求，进行爬取
        base_next = response.xpath('//div[@class="turnPage"]//a[@class="last"]/@href').extract()#获取下一页新闻的url
        time.sleep(1)#减缓爬取速度，防止被认为爬虫
        if base_next:#如果有下一页

        #1190 399 0625 陈奕帆
        
            next = 'https://www.bjnews.com.cn' +base_next[0]#所要爬取的url拼接
            yield scrapy.Request(next,callback=self.parse,meta={"ldl":True})#回溯，对下一页发送request请求




