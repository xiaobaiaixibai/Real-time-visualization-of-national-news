import scrapy
import re
from xinhua.items import XinhuaItem

#1190 399 0625 陈奕帆
class FenghuangSpider(scrapy.Spider):
    name = 'fenghuang'#爬虫文件姓名
    allowed_domains = ['news.ifeng.com/']#域名
    #1190 399 0625 陈奕帆
    start_urls = ['http://news.ifeng.com/']#起始网址

    def start_requests(self):
        yield scrapy.Request(url='http://news.ifeng.com/',meta={'ware':'SeleniumMiddleware'},callback=self.parse)#重写方法start_requests方法，判断是否触发特定的中间件
#1190 399 0625 陈奕帆
    def parse(self, response):
        hrefs = response.xpath('//li[contains(@class,"news-stream-newsStream-news-item")]//h2/a/@href').extract()#提取爬取的网页链接
        urls = []
        for href in hrefs:
            #1190 399 0625 陈奕帆
            if 'news.ifeng.com/c/' in href and 'view' not in href:#进行人为的初步网页去重
                urls.append('https:'+href)
        for url in urls:#遍历，依次执行回调函数，再次进行爬虫
            yield scrapy.Request(url,callback=self.parse_se,dont_filter=True,meta={'ldl':True})#其中，meta即选择性使用特定中间件
#1190 399 0625 陈奕帆
    def parse_se(self,response):
        title = response.xpath('//div[@class="artical-25JfwmD5"]/div/h1/text()').extract()[0]#通过xpath获取新闻的标题

        #1190 399 0625 陈奕帆
        timer = response.xpath('//p[@class="time-1Mgp9W-1"]/span[1]/text()').extract()[0]#通过xpath获取新闻发布的时间
        ps = response.xpath('//div[@class="text-3w2e3DBc"]/p')#通过xpath获取整个新闻的整个内容（含标签）
        info = ''
        #1190 399 0625 陈奕帆
        for p in ps:#遍历
            s = p.xpath('./text()').extract()#通过xpath获取每个标签中正确的新闻正文
            if s != []:#若节点不为空再添加
                info+=s[0]
        item = XinhuaItem()#将爬取到的相关信息以键值对的形式进行注册
        item['title'] = title
        t=re.sub('[年月]', '-', timer)#采用正则格式化时间
        item['time'] =re.sub('日', '', t)#采用正则规范化时间
        item['maintxt'] = info
        item['url'] = response.request.url#获取当前网页的url
        item['ab'] = ''
        #1190 399 0625 陈奕帆
        item['kw']=''#关键字，后续处理后
        item['city'] = ''#新闻发生的城市地点，后续处理
        item['web'] = "凤凰"#所爬取的新闻官网
        print("凤凰")
        yield item#返回给pipeline以后续保存至数据库
#1190 399 0625 陈奕帆

