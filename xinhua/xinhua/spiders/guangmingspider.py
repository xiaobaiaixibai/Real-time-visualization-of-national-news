import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from scrapy_splash import SplashRequest
from xinhua.items import XinhuaItem

class GuangmingspiderSpider(scrapy.Spider):
    name = 'guangmingspider'
    allowed_domains = ['politics.gmw.cn']
    start_urls = ['http://politics.gmw.cn/']
    page=0
    def start_requests(self):
                yield SplashRequest(self.start_urls[0] +'node_9840.htm', callback=self.parse_page,
                            args={'wait': 1.0},meta={"ldl":True})  # 使用Splash进行页面链接访问请求，wait设置为1s等待页面渲染返回页面内容

    def parse_page(self, response):
        page_url_list = response.xpath(
            '//ul[@class="channel-newsGroup"]/li/a/@href').extract()  # 使用xpath获得网页上的相关信息
        for i in page_url_list:
            if i[:5]=='https':
                yield SplashRequest(i, callback=self.parse,
                                    args={'wait': 1.0},meta={'url':i,"ldl":True})  # 使用Splash进行页面链接访问请求，wait设置为1s等待页面渲染返回页面内容
            else:
                yield SplashRequest(self.start_urls[0] +i, callback=self.parse,
                                args={'wait': 1.0},meta={'url':self.start_urls[0] +i,"ldl":True})  # 使用Splash进行页面链接访问请求，wait设置为1s等待页面渲染返回页面内容
        self.page = self.page + 1
        if self.page < 10:  # 判断是否达到10页到达便停止
            yield SplashRequest(self.start_urls[0] + 'node_9840_' + str(self.page+1) + '.htm', callback=self.parse_page,
                                args={'wait': 1.0},meta={"ldl":True})  # 使用Splash进行页面链接访问请求，wait设置为1s等待页面渲染返回页面内容
    # def start_requests(self):
    #             yield SplashRequest('https://politics.gmw.cn/2021-11/30/content_35349192.htm', callback=self.parse,
    #                         args={'wait': 1.0})  # 使用Splash进行页面链接访问请求，wait设置为1s等待页面渲染返回页面内容
    def parse(self, response):
        item = XinhuaItem()
        title= response.xpath(
            '//h1[@class="u-title"]/text()').extract()[0]  # 使用xpath获得网页上的相关信息
        title = "".join(title.split())  # 去除正文中JavaScript干扰字符
        item['time'] =response.xpath(
            '//span[@class="m-con-time"]/text()').extract()[0]  # 使用xpath获得网页上的相关信息
        maintxt="".join(response.xpath(
            '//div[@class="u-mainText"]/p/text()|//div[@class="u-mainText"]/p/strong/text()|//div[@class="u-mainText"]/p/span/font/text()|//div[@class="u-mainText"]/p/font/span/text()').extract())  # 使用xpath获得网页上的相关信息
        maintxt = "".join(maintxt.split())  # 去除正文中JavaScript干扰字符
        item['url'] = response.meta['url']
        item['title']=title
        item['maintxt']=maintxt
        item['ab']=''
        item['kw']=''
        item['city'] = ''
        item['web'] = "光明"
        print("光明")
        yield item
if __name__ == "__main__":
    process = CrawlerProcess(get_project_settings())
    process.crawl(GuangmingspiderSpider)
    process.start()
