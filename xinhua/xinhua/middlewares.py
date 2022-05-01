from scrapy import signals
import scrapy
from selenium import webdriver
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.by import By
from scrapy.http import HtmlResponse, Response
import time
# useful for handling different item types with a single interface
from itemadapter import is_item, ItemAdapter

class xinhuaSpiderMiddleware:
    def process_request(self, request, spider):
        if request.meta.get('ldl'):
            return None
        chrome_options = ChromeOptions()  # 创建selenium对象
        chrome_options.add_argument('--headless')  # 使用无头谷歌浏览器模式
        chrome_options.add_argument('--disable-gpu')  # 禁用GPU加速
        chrome_options.add_argument('--no-sandbox')  # 以最高权限运行
        self.driver = webdriver.Chrome(chrome_options=chrome_options)
        if request.meta.get('ware') == 'SeleniumMiddleware':
            self.driver.get(request.url)
            self.driver.implicitly_wait(30)
            while True:
                if self.driver.find_elements(by=By.XPATH, value='//*[@id="root"]/div[5]/div[1]/div[4]/div/a') == []:
                    break
                self.driver.find_elements(by=By.XPATH, value='//*[@id="root"]/div[5]/div[1]/div[4]/div/a')[0].click()
            html = self.driver.page_source
            self.driver.quit()
            response = HtmlResponse(request.url, body= html, encoding='utf-8')
            return response
        self.driver.get(request.url)  # 获得url
        if self.driver.find_elements(by=By.XPATH, value="//div[@class='xpage-more-btn']")!=[]:
            print("开始点击加载更多")
            botton=self.driver.find_elements(by=By.XPATH, value="//div[@class='xpage-more-btn']")[0]
            while(1):
                self.driver.execute_script("arguments[0].click();",
                                           botton)  # arguments是要将从Python 传递到要执行的 JavaScript 的内容
                if self.driver.find_elements(by=By.XPATH, value="//div[@class='xpage-more-btn']")[0].get_attribute('textContent')=='暂无更多':
                    break
            print("加载更多结束")
        time.sleep(1)  # 睡眠1s等待页面渲染完成
        html = self.driver.page_source
        self.driver.quit()
        return scrapy.http.HtmlResponse(url=request.url, body=html.encode('utf-8'), encoding='utf-8',
                                        request=request)  # 返回对象