// 提交事件
// topicType: 存储当前题目类型(单选题/多选题/判断题)
let topicType = "";

// newTopic: 存储当前题目对象
let newTopic = [];

// 页面加载完成后执行
window.onload = function () {
  init(); // 初始化画布

  // 画星星: 创建指定数量的星星对象并初始化
  for (var i = 0; i < starCount; i++) {
    var star = new Star(); // 创建星星对象
    star.init(); // 初始化星星属性
    star.draw(); // 绘制星星
    arr.push(star); // 将星星加入数组
  }

  // 画流星: 创建指定数量的流星对象并初始化
  for (var i = 0; i < rainCount; i++) {
    var rain = new MeteorRain(); // 创建流星对象
    rain.init(); // 初始化流星属性
    rain.draw(); // 绘制流星
    rains.push(rain); // 将流星加入数组
  }

  playStars(); // 启动星星动画
  playRains(); // 启动流星动画
  nextTopic(); // 加载第一道题目
};

// bool数组: [答对题数, 总答题数, 是否允许切换题目]
let bool = [0, 0, true];

// 提交答案函数
function send() {
  bool[2] = true; // 允许切换下一题
  bool[1]++; // 总答题数加1

  // 移除选项的点击事件和for属性
  document.querySelectorAll("div.options label").forEach((item) => {
    item.removeAttribute("onclick");
    item.removeAttribute("for");
  });

  // 禁用提交按钮
  document.querySelectorAll("button")[0].setAttribute("onclick", "");

  // 处理单选题和多选题
  if (topicType == "单选题" || topicType == "多选题") {
    const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 选项字母列表
    let num = 0; // 选项索引
    let aws = ""; // 用户选择的答案

    // 遍历所有选项
    document.querySelectorAll("div.options input").forEach((item) => {
      if (item.checked) {
        if (aws == "") {
          aws = list[num]; // 第一个选中的选项
        } else {
          aws += "," + list[num]; // 多选时用逗号分隔
        }
      }
      num++;
    });

    // 显示用户答案
    document.querySelectorAll("div.right > span")[0].textContent = `${aws}`;

    // 判断答案是否正确
    if (aws == newTopic.answer) {
      document.querySelectorAll("div.answer")[0].setAttribute("bool", "true");
      bool[0]++; // 答对题数加1
    } else {
      document.querySelectorAll("div.answer")[0].setAttribute("bool", "false");
    }
  } else {
    // 处理判断题
    if (document.querySelectorAll("div.options input")[0].checked) {
      document.querySelectorAll("div.right > span")[0].textContent = "yes";
      if ("yes" == newTopic.answer) {
        document.querySelectorAll("div.answer")[0].setAttribute("bool", "true");
        bool[0]++;
      } else {
        document
          .querySelectorAll("div.answer")[0]
          .setAttribute("bool", "false");
      }
    } else if (document.querySelectorAll("div.options input")[1].checked) {
      document.querySelectorAll("div.right > span")[0].textContent = "no";
      if ("no" == newTopic.answer) {
        document.querySelectorAll("div.answer")[0].setAttribute("bool", "true");
        bool[0]++;
      } else {
        document
          .querySelectorAll("div.answer")[0]
          .setAttribute("bool", "false");
      }
    } else {
      // 未选择任何选项
      document.querySelectorAll("div.right > span")[0].textContent = "";
      document.querySelectorAll("div.answer")[0].setAttribute("bool", "false");
    }
  }

  // 更新正确率显示
  document.querySelectorAll(
    "div.head > div > span.correctness"
  )[0].textContent = `${((bool[0] / bool[1]) * 100).toFixed(2)}%`;

  // 更新题目统计
  document.querySelectorAll(
    "div.head > div > span.topicStatistics"
  )[0].textContent = `${++topicStatistics}`;
}

// topicStatistics: 记录已答题数量
let topicStatistics = 0;

// 加载下一题函数
function nextTopic() {
  if (bool[2]) {
    // 检查是否允许切换题目
    // 启用提交按钮
    document.querySelectorAll("button")[0].setAttribute("onclick", "send()");

    // 随机选择一道题目
    let rand = Math.floor(Math.random() * topic.length);

    // 选项字母列表
    const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // 设置当前题目
    newTopic = topic[rand];

    // 显示题目内容
    document.querySelectorAll("div.topic")[0].textContent = topic[rand].topic;

    // 处理单选题
    if (list.includes(topic[rand].answer)) {
      topicType = "单选题";
      let opt = ``;
      // 生成选项HTML
      for (let key in topic[rand].item) {
        opt += `<input name="radio" id="radio${list[key]}" type="radio" /><div class="item"><label for="radio${list[key]}" onclick="setTimeout(() => {send();}, 1);"><span>${topic[rand].item[key]}</span></label></div>`;
      }
      document.querySelectorAll("div.options")[0].innerHTML = opt;
    }
    // 处理判断题
    else if (["yes", "no"].includes(topic[rand].answer)) {
      topicType = "判断题";
      let opt = ``;
      // 生成选项HTML
      for (let key in topic[rand].item) {
        opt += `<input name="radio" id="radio${list[key]}" type="radio" /><div class="item"><label for="radio${list[key]}" onclick="setTimeout(() => {send();}, 1);"><span>${topic[rand].item[key]}</span></label></div>`;
      }
      document.querySelectorAll("div.options")[0].innerHTML = opt;
    }
    // 处理多选题
    else if (topic[rand].answer.includes(",")) {
      topicType = "多选题";
      let opt = ``;
      // 生成选项HTML
      for (let key in topic[rand].item) {
        opt += `<input name="radio" id="radio${list[key]}" type="checkbox" /><div class="item"><label for="radio${list[key]}"><span>${topic[rand].item[key]}</span></label></div>`;
      }
      document.querySelectorAll("div.options")[0].innerHTML = opt;
    }

    // 重置答案显示状态
    document.querySelectorAll("div.answer")[0].setAttribute("bool", ``);
    // 显示题目类型
    document.querySelectorAll("div.type")[0].textContent = `${topicType}`;
    // 显示正确答案
    document.querySelectorAll(
      "div.left > span"
    )[0].textContent = `${newTopic.answer}`;
    // 禁止重复提交
    bool[2] = false;
  } else {
    // 如果当前不允许切换题目，则提交当前题目
    send();
  }
}

// time数组: [分钟, 秒]
let time = [0, 0];

// 计时器: 每秒更新一次时间显示
let timer = setInterval(() => {
  time[1]++; // 秒数加1
  if (time[1] > 59) {
    // 超过59秒
    time[0]++; // 分钟加1
    time[1] = 0; // 秒数归零
  }
  // 更新时间显示(格式: 00:00)
  document.querySelectorAll(
    "div.head > div > span.time"
  )[0].textContent = `${time[0].toString().padStart(2, "0")}:${time[1]
    .toString()
    .padStart(2, "0")}`;
}, 1000);
