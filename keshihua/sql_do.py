'''
Date: 2021-11-27 14:23:25
Editors: 11912990916 刘东凌
description:进行数据库访问要求
'''
import pymysql
import time
import pandas as pd
import lightgbm as lgb
import joblib
import time
import jieba
import numpy as np
from gensim.models import Word2Vec
import warnings
warnings.filterwarnings("ignore")

def get_time():
    time_str = time.strftime("%Y{}%m{}%d{} %X")
    return time_str.format("年", "月", "日")


def map():
    res = {}
    sql = "SELECT time,city FROM new where city!=''"
    data = query(sql)
    for i in data:
        if str(i[0].day // 7) in res.keys():
            if i[1] in res[str(i[0].day // 7)].keys():
                res[str(i[0].day // 7)][i[1]] = res[str(i[0].day // 7)][i[1]] + 10
            else:
                res[str(i[0].day // 7)][i[1]] = 10
        else:
            tempdict = {}
            tempdict[i[1]] = 10
            res[str(i[0].day // 7)] = tempdict
    return res


def getnumber():
    sql = "SELECT COUNT(*) FROM new"
    data = query(sql)
    return data[0]

def title():
    res = []
    sql = "SELECT title FROM new ORDER BY time desc limit 100"
    data = query(sql)
    for i in data:
        res.append(i[0])
    res.sort()
    return res


def get_city_and_keyword():
    res = {}
    sql = "SELECT city,keyword FROM `new` where city !=''"
    data = query(sql)
    for i in data:
        if i[0] in res.keys():
            res[i[0]] = res[i[0]] + i[1].split()
        else:
            res[i[0]] = i[1].split()
    return res


def query(sql, *args):
    conn, cursor = get_conn()
    cursor.execute(sql, args)
    res = cursor.fetchall()
    close_conn(conn, cursor)
    return res


def get_conn():
    # 建立连接
    conn = pymysql.connect(host='localhost', port=3306, user='root', password='1024733653', database='xw',
                           charset='utf8')
    # c创建游标A
    cursor = conn.cursor()
    return conn, cursor


def close_conn(conn, cursor):
    if cursor:
        cursor.close()
    if conn:
        conn.close()


def get_r1_data():
    sql = "SELECT title FROM new limit 10"
    res = query(sql)
    return res

def get_sample():
    lt=[]
    sql = "SELECT title,maintxt FROM new limit 500"
    res = query(sql)
    for i in res:
        lt.append(i[0]+i[1])
    return lt

def run1(sample):
    test=pd.DataFrame(sample)

    test.columns=['文章']

    stopword_list = [k.strip() for k in open(r'D:\IT\Python\keshihua\mod\stopwords.txt', encoding='utf-8') if k.strip() != '']
    cutWords_list = []

    i = 0
    startTime = time.time()
    for article in test['文章']:
        cutWords = [k for k in jieba.cut(article) if k not in stopword_list]
        i += 1
        if i % 1000 == 0:
            print('前%d篇文章分词共花费%.2f秒' % (i, time.time() - startTime))
        cutWords_list.append(cutWords)

    def wordDecode(data):
        sentences =data
        emb_size = 128
        model = Word2Vec.load(r"D:\IT\Python\keshihua\mod\word2vec_model.w2v")
        emb_matrix = []
        for seq in sentences:
            vec = []
            for w in seq:
                if w in model.wv.key_to_index:
                    vec.append(model.wv[w])
            if len(vec) > 0:
                emb_matrix.append(np.mean(vec, axis=0))
            else:
                emb_matrix.append([0] * emb_size)
        emb_matrix = np.array(emb_matrix)

        return emb_matrix

    test=wordDecode( cutWords_list)

    result=[]

    for fold_ in range(5):
        print("fold n°{}".format(fold_+1))
    #     加载mlp模型
        mlp_dir=f'D:\\IT\\Python\\keshihua\\mod\\mlp{fold_}.model'
        clf_mlp=joblib.load(mlp_dir)
        of_mlp=clf_mlp.predict(test)
        oof_mlp=np.array(of_mlp).reshape(-1,1)
        result.append(oof_mlp)
    #     加载lgb模型
        lgb_dir = f'D:\\IT\\Python\\keshihua\\mod\\lgb_model{fold_}.txt'
        clf_lgb=lgb.Booster(model_file=lgb_dir)

        of=clf_lgb.predict(test)
        oof_lgb = np.argmax(of,1).reshape(-1,1)
        result.append(oof_lgb)

    result=pd.DataFrame(np.concatenate(result,axis=1))

    final_result=list(result.apply(lambda x :x.mode()[0],axis=1))

    di={'0':'体育','1':'健康','2':'女性','3':'娱乐','4':'房地产','5':'教育','6':'文化','7':'时政','8':'旅游','9':'汽车','10':'科技','11':'财经'}

    final_result=[ di[str(a)] for a in final_result]


    f_dic={}
    for d in di.values():
        f_dic[d]=final_result.count(d)

    # f_dic就是最终结果
    return f_dic