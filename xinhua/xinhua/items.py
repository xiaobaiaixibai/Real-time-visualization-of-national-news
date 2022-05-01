# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class XinhuaItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()#标题
    time=scrapy.Field()#时间
    maintxt=scrapy.Field()#正文
    url=scrapy.Field()#链接
    ab=scrapy.Field()#摘要
    kw=scrapy.Field()#关键字
    city=scrapy.Field()#城市
    web=scrapy.Field()#来源网站
