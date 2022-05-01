import pymysql
from scrapy import crawler
from twisted.internet import reactor
from scrapy.crawler import CrawlerRunner, CrawlerProcess
from scrapy.utils.project import get_project_settings
from scrapy.utils.log import configure_logging
import logging
from xinhua.spiders.guangmingspider import GuangmingspiderSpider
from xinhua.spiders.renmin import RenminSpider
from xinhua.spiders.xinghuaspider import XinghuaspiderSpider
from xinhua.spiders.pengpai import PengpaiSpider
from xinhua.spiders.fenghuang import FenghuangSpider
from xinhua.spiders.xinjing import XinjingSpider

def start_spider():
    # 装载爬虫
    runner.crawl(RenminSpider)
    runner.crawl(XinjingSpider)
    runner.crawl(XinghuaspiderSpider)
    runner.crawl(GuangmingspiderSpider)
    runner.crawl(PengpaiSpider)
    runner.crawl(FenghuangSpider)
    # 爬虫结束后停止事件循环
    d = runner.join()
    d.addBoth(lambda _: reactor.stop())
    # 启动事件循环
    reactor.run()

if __name__ == '__main__':
    logger = logging.getLogger(__name__)
    settings = get_project_settings()
    configure_logging(settings)
    runner = CrawlerRunner(settings)
    conn=pymysql.connect(host='localhost', port=3306, user='root', password='1024733653', database='xw',
                    charset='utf8')  # 有中文要存入数据库的话要加charset='utf8'
    cursor = conn.cursor()
    try:
        query = "truncate table new"
        cursor.execute(query)
        conn.commit()
        print('原表已清空')
    except Exception as aa:
        print(aa)
    cursor.close()
    conn.close()
    start_spider()
