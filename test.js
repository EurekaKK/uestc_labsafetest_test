// ==UserScript==
// @name         题库自动填充答案
// @namespace    your-namespace
// @version      1.0
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

  setAnswer();


})();