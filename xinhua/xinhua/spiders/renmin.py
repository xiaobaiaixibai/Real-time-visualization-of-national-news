#@author: 高良科
#编辑日期：2021//11-30
import scrapy
import  requests
import re
from bs4 import BeautifulSoup
from datetime import datetime, date, timedelta
from xinhua.items import XinhuaItem


class RenminSpider(scrapy.Spider):
    name = 'renmin'
    allowed_domains = ['http://www.people.com.cn/GB/59476/index.html']
    start_urls = ['http://www.people.com.cn/GB/59476/index.html']
    def start_requests(self):
        urls=[]
        for day in range(0,5):
            # 在这构造包含各个日期的子链接
            yesterday = (date.today() + timedelta(days=-1*day)).strftime("%Y%m%d")
            url = f'http://www.people.com.cn/GB/59476/review/{yesterday}.html'
            # 获取数据，改变编码
            response = requests.get(url)
            response.encoding = response.apparent_encoding
            soup = BeautifulSoup(response.text, 'lxml')
            # 获取所有子链接
            k = soup.findAll('li')
            for m in k:
                m = str(m)
                s2 = re.findall('href="(.*?)"', m)
                if len(s2)>=1:
                    urls.append(s2[0])
        urls=list(set(urls))
        # 进入子链接获取新闻内容
        for u in urls:
            yield scrapy.Request(url=u,callback=self.parse,dont_filter=True,meta={"url":u,"ldl":True})

    def parse(self, response):
        try:
            item=XinhuaItem()
            # 使用xpath定位获取新闻内容
            title=response.xpath('/html/body/div[1]/div[7]/div[1]/h1//text()')
            title=str(title)
            title=''.join(re.findall("data='(.*?)'",title))
            title=title.replace(r'\xa0','')
            ti=str(response.xpath('/html/body/div[1]/div[7]/div[1]/div[2]/div[1]/text()'))
            tim = ''.join(re.findall(r"data=(.*?)来源", ti))[13:-2]
            passage= ''.join(response.xpath('/html/body/div[1]/div[7]/div[1]/div[3]/p//text()').extract())
            passage = "".join(passage.split())
            t=re.sub('[年月]','-',tim[:-1])
            item['time'] =re.sub('日','  ',t)
            item['title']=title
            item['maintxt']=passage
            item['url']=response.meta['url']
            item['ab']=''
            item['kw'] = ''
            item['city'] = ''
            item['web'] = "人民"
            print("人民")
            yield item
        except Exception:
            pass

