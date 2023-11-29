import requests
from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

driver_path = "./msedgedriver.exe"
op = Options()
op.add_argument('log-level=3')  # 隐藏日志
op.add_argument('--headless')  # 无头模式
s = Service(executable_path=driver_path)
driver = webdriver.Edge(service=s, options=op)
WAIT = WebDriverWait(driver, 10)  # 等待器

def get_link(tiku):
    """
    通过selenium打开在线练习，提交并获得答案链接
    """
    driver.get("https://labsafetest.uestc.edu.cn/redir.php?catalog_id=6&cmd=testing")
    # 找到tiku对应的a标签
    element = WAIT.until(EC.presence_of_element_located((By.XPATH, "//a[contains(text(), '{}')]".format(tiku))))
    element.click()
    # 找到提交按钮
    element = WAIT.until(EC.presence_of_element_located((By.XPATH, "//input[@type='button' and @value='提交答卷']")))
    element.click()
    # 会出现一个confirm弹窗，点击确定
    driver.switch_to.alert.accept()
    # 找到答案链接
    element = WAIT.until(EC.presence_of_element_located((By.XPATH, "//a[contains(text(), '查看答卷正误详情')]")))
    link = element.get_attribute("href")
    # 关闭当前窗口
    # driver.close()
    return link


tikus = ['通识类安全题', '化学类安全题', '医学生物类安全题', '机械建筑类安全题', '电气类安全题', '辐射类安全题', '特种设备安全题', '消防安全题']
ans_map = {"A": 4, "B": 5, "C": 6, "D": 7}
BANK = list()

def get_answer(link):
    flag = False
    res = requests.get(link)
    # 返回的charset为gbk，需要解码
    html = res.content.decode('gbk')
    soup = BeautifulSoup(html, "html.parser")
    shiti_divs = soup.find_all("div", class_="shiti")
    for div in shiti_divs:
        strs = div.stripped_strings
        strs = list(strs)
        if strs[1] == "[判断题]":
            question = strs[2]
            answer = strs[4][-2:]
        elif strs[1] == "[单选题]":
            index = strs[-1].find("标准答案：")
            answer = strs[-1][index + 5:].strip()
            question = strs[2]
        item = "题目：" + question + "^*^答案：" + answer
        # 判断题库中是否已经有该题目
        if item in BANK:
            continue
        else:
            BANK.append(item)
            flag = True
    return flag
    

for tiku in tikus:
    while True:
        link = get_link(tiku)
        flag = get_answer(link)
        print("已共爬到：" + str(len(BANK)) + "；当前题库为：" + tiku)
        if not flag:
            break

with open("bank.txt", "w", encoding="utf-8") as file:
    for item in BANK:
        file.write(item + "\n")


driver.quit()
            
            

    