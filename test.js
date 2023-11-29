// ==UserScript==
// @name         题库自动填充答案
// @namespace    your-namespace
// @version      1.1
// @description  从题库中自动填充答案到页面中的题目上
// @match        https://labsafetest.uestc.edu.cn/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function getAnswer(question) {
    // 将question作为get请求的参数发送给服务器,中文字符串需要编码
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:12345?question=' + encodeURI(question), false);
    xhr.send();
    // 返回答案
    return xhr.responseText;
  }

  function setAnswer() {
    // 查找id为dati的form
    var form = document.getElementById('dati');
    // 查找form中的所有class为shiti的div
    var shitis = form.getElementsByClassName('shiti');
    // 遍历每一个div
    for (var i = 0; i < shitis.length; i++) {
      // 获取题目,在h3标签中
      var question = shitis[i].getElementsByTagName('h3')[0].innerHTML;
      // 去除题目中的序号
      question = question.substring(question.indexOf('、') + 1);
      // 去除题目末尾的空格
      question = question.trim();
      // 查找答案
      var answer = getAnswer(question);
      // 将答案添加到div中
      shitis[i].innerHTML += '<p>' + answer + '</p>';
    }
  }


  function get_index(answer, inputs_num) {
    if (answer.includes("A")) {
      return 0
    }
    if (answer.includes("B")) {
      return 1
    }
    if (answer.includes("C")) {
      return 2
    }
    if (answer.includes("D")) {
      return 3
    }
    if (answer.includes("正确")) {
      return 0
    }
    if (answer.includes("错误")) {
      return 1
    }
    return Math.round(Math.random() * (inputs_num - 1))
  }

  function autoChoice() {
    // 查找id为dati的form
    var form = document.getElementById('dati');
    // 查找form中的所有class为shiti的div
    var shitis = form.getElementsByClassName('shiti');
    // 遍历每一个div
    for (var i = 0; i < shitis.length; i++) {
      // 获得答案，答案在p标签中
      var answer = shitis[i].getElementsByTagName('p')[0].innerHTML;
      // 查找所有的input
      var inputs = shitis[i].getElementsByTagName('input');
      // 根据答案选择input
      var index = get_index(answer, inputs.length)
      // 勾选对应的input
      inputs[index].checked = true
    }
  }

  function nextPage() {
    // 获取div元素
    var divElement = document.querySelector('.nav');
    // 获取文本节点
    var textNode = divElement.childNodes[4];
    // 获取文本内容
    var textContent = textNode.textContent.trim();
    // 使用正则表达式匹配页码信息
    var regex = /第(\d+) \/ (\d+) 页/;
    var match = textContent.match(regex);
    // 提取当前页码和总页数
    var currentPage = parseInt(match[1]);
    var totalPages = parseInt(match[2]);
    // 如果当前页码小于总页数,则点击下一页按钮
    if (currentPage < totalPages) {
      // 查找下一页按钮,input标签的value属性为下一页
      var nextButton = document.querySelector('input[value="下一页"]');
      nextButton.click();
    }
    else {
      alert('答题完毕，请注意不保证答案正确，请确认后自行提交答卷！')
    }
  }

  setAnswer();
  autoChoice();
  nextPage();


})();