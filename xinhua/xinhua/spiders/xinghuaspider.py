import re

import scrapy
import requests
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from scrapy_splash import SplashRequest

from xinhua.items import XinhuaItem

class XinghuaspiderSpider(scrapy.Spider):
    name = 'xinghuaspider'
    allowed_domains = ['xinhuanet.com','news.cn']
    def start_requests(self):
        yield scrapy.Request('http://www.xinhuanet.com/politicspro/', callback=self.parse_url_list)  # 进行页面链接访问请求
    def parse_url_list(self, response):
        url_list=response.xpath("//div[@class='tit']//a/@href").extract()
        for url in url_list:
            if url[:4]=='http':
                yield scrapy.Request(url,callback=self.parse,dont_filter=True, meta={'url':url,'ldl':True})
    def parse(self, response):
        try:
            item=XinhuaItem()
        # title=response.xpath("//span[@class='title']/text()").extract()[0]
        # item['time']=response.xpath("//span[@class='year']/em/text()").extract()[0]+'-'+response.xpath("//span[@class='day']/text()").extract()[0].replace('/','-')+' '+response.xpath("//span[@class='time']/text()").extract()[0]
            title = response.xpath("//title/text()").extract()[0]
            time=response.xpath("//div[@class='info']/text()").extract()[0]
            t = re.sub('[\\r\\n]', '', time)
            item['time']=t
            maintxt=''.join(response.xpath("//div[@id='detail']/p/text()").extract())
            item['title']=''.join(title.split())
            item['maintxt']=''.join(maintxt.split())[:-4]
            item['url'] = response.meta['url']
            item['ab']=''
            item['kw']=''
            item['city'] = ''
            item['web'] = "新华"
            print("新华")
            yield item
        except Exception:
            pass

if __name__ == "__main__":
    process = CrawlerProcess(get_project_settings())
    process.crawl(XinghuaspiderSpider)
    process.start()
