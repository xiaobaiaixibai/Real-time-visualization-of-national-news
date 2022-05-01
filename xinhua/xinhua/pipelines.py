# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
import codecs
import json
import re
import cpca
import jieba
from jieba import analyse
import pymysql
from itemadapter import ItemAdapter


class XinhuaPipeline:
    def __init__(self):
        # 建立连接
        self.conn = pymysql.connect(host='localhost', port=3306, user='root', password='1024733653', database='xw',
                                    charset='utf8')  # 有中文要存入数据库加charset='utf8'
        # 创建游标
        self.cursor = self.conn.cursor()

    def is_Chinese(word):
        for ch in word:
            if '\u4e00' <= ch <= '\u9fff':
                return True
        return False

    def get_zy(text):
        dic = dict(jieba.analyse.extract_tags(text, topK=20, withWeight=True, ))
        k = []
        for d in list(dic.keys()):
            if XinhuaPipeline.is_Chinese(d):
                k.append(d)
        words = re.split('。|！|；', text)[:3]
        score = [0, 0, 0]
        for i, w in enumerate(words):
            w = list(jieba.cut(w))
            m = list(set(w) & set(k))
            for n in m:
                score[i] += dic[n]
        max_s = max(score)
        mean_s = sum(score) / 3
        ind = score.index(max(score))
        f = words[ind]
        if ind == 0:
            if score[1] >= mean_s:
                f += words[1]
        elif ind == 1:
            if score[0] >= mean_s:
                f = words[0] + f
            if score[2] >= mean_s:
                f = f + words[0]
        else:
            if score[2] >= mean_s:
                f = f + words[0]
        return f

    def process_item(self, item, spider):
        # sql语句
        try:
            text = item['maintxt'] + item['title']
            keyword = " ".join(list(analyse.extract_tags(text, 5)))
            item['kw']=keyword
            item['ab']=XinhuaPipeline.get_zy(item['maintxt'])
            city=cpca.transform([item['maintxt']])
            city=city.at[0,'省']
            item['city']=city
            insert_sql = """
                insert into new(url,title,maintxt,ab,time,keyword,city,web) VALUES(%s,%s,%s,%s,%s,%s,%s,%s)
                """
            # 执行插入数据到数据库操作
            self.cursor.execute(insert_sql, (item['url'], item['title'], item['maintxt'], item['ab'],
                                             item['time'], item['kw'],item['city'],item['web']))
            # 提交，不进行提交无法保存到数据库
            self.conn.commit()
        except Exception:
            pass

    def close_spider(self, spider):
        # 关闭游标和连接
        self.cursor.close()
        self.conn.close()
    # def __init__(self):
    #     print('start writing in files...')
    #     self.file = codecs.open('xh.json', 'w+', encoding='utf-8')  # 开始爬虫便打开json文件
    #
    # def process_item(self, item, spider):
    #     if dict(item)['maintxt'] != '':  # 判断item是否为空为空则跳过，否则写入
    #         line = json.dumps(dict(item), ensure_ascii=False) + "\n"  # 写入相关格式
    #         self.file.write(line)
    #     return item
    #
    # def spider_closed(self, spider):  # 爬虫完毕，关闭文件
    #     print('ok,file is closed...')
    #     self.file.close()
