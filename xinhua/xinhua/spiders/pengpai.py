#@author: 高良科
#编辑日期：2021//11-30

import scrapy
from scrapy_splash import SplashRequest
from selenium import webdriver
from lxml import etree
from selenium.webdriver.chrome.options import Options # => 引入Chrome的配置
import time
import re
import os
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import TimeoutException
from xinhua.items import XinhuaItem

# 获取所有子链接
def get_url():
    ch_options = Options()
    ch_options.add_argument("--headless")  # => 为Chrome配置无头模式
    ch_options.add_argument('--disable-gpu')  # 禁用GPU加速
    ch_options.add_argument('--no-sandbox')  # 以最高权限运行
    driver = webdriver.Chrome(chrome_options=ch_options)
    driver.set_page_load_timeout(10)
    url = 'https://www.thepaper.cn/'
    # 防止出问题
    try:
        driver.get(url)
    except TimeoutException:
        print('timeout')
    # wait=WebDriverWait(driver, 20, 0.5)
    # wait.until(lambda driver : driver.find_element_by_xpath('/html/body/div[5]/div[1]/div[2]/div/div[2]/div[4]/div/div/div'))
    for i in range(29):
        # 模拟电脑拖动鼠标到最下方
        driver.execute_script("window.scrollTo(0,document.body.scrollHeight);")
        time.sleep(0.5)
    tree = etree.HTML(driver.page_source)
    driver.quit()
    root = tree.xpath('/html/body/div[5]/div[1]/div[2]/div/div[2]/div[4]/div/div/div')
    urls=[]
    for r in root:
        s = r.xpath('div[1]/a/@href')
        if len(s) >= 1:
            urls.append(url + s[0])
    return urls
class PengpaiSpider(scrapy.Spider):
    name = 'pengpai'
    allowed_domains = ['https://www.thepaper.cn/']
    start_urls = ['https://www.thepaper.cn/']
    def start_requests(self):
        urls=get_url()
        urls = list(set(urls))
        for u in urls:
            yield SplashRequest(u,callback=self.parse,dont_filter=True, args={'wait': 1.0},meta={'url':u,"ldl":True})
    def parse(self, response):
        try:
            # 提取数据 title:标题   maintxt:正文  time:发布时间  u:网页链接 主要使用xpath定位获取标签内容
            title=response.xpath("//h1[@class='news_title']/text()").extract()[0]
            maintxt=''.join(response.xpath("//div[@class='news_txt']//text()").extract()[:-2])
            title = ''.join(title.split())
            maintxt=''.join(maintxt.split())
            time=response.xpath("//div[@class='news_about']/p[2]/text()").extract()[0]
            time=time.split()
            time=time[0]+' '+time[1]
            u=response.meta['url']

            # 将数据传递给item，
            item = XinhuaItem()
            item['time']=time
            item['title'] = title
            item['maintxt'] = maintxt
            item['url']=u
            item['ab'] = ''
            item['kw'] = ''
            item['city'] = ''
            item['web'] = "澎湃"
            print('澎湃')
            yield item
        except Exception:
            pass
