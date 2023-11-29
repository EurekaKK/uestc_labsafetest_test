from flask import Flask, request
from flask_cors import CORS
import os
import sys
import urllib.parse
import logging

app = Flask(__name__)
# 解决CORS跨域问题
CORS(app)

bank = dict()

def read_file(file_name):
    base_path = os.path.dirname(sys.executable)
    filename = os.path.join(base_path, 'bank.txt')
    # 读取txt文件，将题目和答案存入bank中
    with open(filename, 'r', encoding='utf-8') as f:
        for line in f.readlines():
            # 题目是"题目："后面的字符串直到'^*^'之前的内容
            question = line[line.find('题目：') + 3:line.find('^*^')]
            # 去除题目末尾的空格
            question = question.rstrip()
            # 答案是"^*^"后面的字符串直到行末的内容
            answer = line[line.find('^*^') + 3:]
            # 存入bank中
            bank[question] = answer

@app.route('/', methods=['GET'])
def send_answer():
    # 从get请求中获取题目
    question = str(request.args.get('question'))
    # get请求中的题目需要转换成utf-8
    question = urllib.parse.unquote(question)
    # 从bank中获取答案
    answer = bank.get(question)
    # 如果答案不存在，返回"找不到答案"
    if answer is None:
        return '找不到答案'
    # 返回答案
    return answer


if __name__ == '__main__':
    # 读取题库
    log = logging.getLogger('werkzeug')
    log.disabled = True
    read_file('bank.txt')
    app.run(port=12345)
