// 提交事件
let topicType = "";

let newTopic = [];

window.onload = function () {
  init();
  // 画星星
  for (var i = 0; i < starCount; i++) {
    var star = new Star();
    star.init();
    star.draw();
    arr.push(star);
  }
  // 画流星
  for (var i = 0; i < rainCount; i++) {
    var rain = new MeteorRain();
    rain.init();
    rain.draw();
    rains.push(rain);
  }
  playStars();
  playRains();
  nextTopic();
};

let bool = [0, 0, true];

function send() {
  bool[2] = true;
  bool[1]++;
  document.querySelectorAll("div.options label").forEach((item) => {
    item.removeAttribute("onclick");
    item.removeAttribute("for");
  });
  document.querySelectorAll("button")[0].setAttribute("onclick", "");
  if (topicType == "单选题" || topicType == "多选题") {
    const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let num = 0;
    let aws = "";
    document.querySelectorAll("div.options input").forEach((item) => {
      if (item.checked) {
        if (aws == "") {
          aws = list[num];
        } else {
          aws += "," + list[num];
        }
      }
      num++;
    });
    document.querySelectorAll("div.right > span")[0].textContent = `${aws}`;
    if (aws == newTopic.answer) {
      document.querySelectorAll("div.answer")[0].setAttribute("bool", "true");
      bool[0]++;
    } else {
      document.querySelectorAll("div.answer")[0].setAttribute("bool", "false");
    }
  } else {
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
      document.querySelectorAll("div.right > span")[0].textContent = "";
      document.querySelectorAll("div.answer")[0].setAttribute("bool", "false");
    }
  }
  document.querySelectorAll(
    "div.head > div > span.correctness"
  )[0].textContent = `${((bool[0] / bool[1]) * 100).toFixed(2)}%`;

  document.querySelectorAll(
    "div.head > div > span.topicStatistics"
  )[0].textContent = `${++topicStatistics}`;
}

let topicStatistics = 0;
function nextTopic() {
  if (bool[2]) {
    document.querySelectorAll("button")[0].setAttribute("onclick", "send()");
    let rand = Math.floor(Math.random() * topic.length);

    const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    newTopic = topic[rand];

    document.querySelectorAll("div.topic")[0].textContent = topic[rand].topic;
    if (list.includes(topic[rand].answer)) {
      // 单选题处理
      topicType = "单选题";
      let opt = ``;
      for (let key in topic[rand].item) {
        //   console.log(key)
        opt += `<input name="radio" id="radio${list[key]}" type="radio" />
        <div class="item">
          <label for="radio${list[key]}" onclick="setTimeout(() => {
  send();
}, 1);"><span>${topic[rand].item[key]}</span></label>
        </div>`;
      }
      document.querySelectorAll("div.options")[0].innerHTML = opt;
    } else if (["yes", "no"].includes(topic[rand].answer)) {
      // 判断题处理
      topicType = "判断题";
      // console.log(topic[rand].answer);
      let opt = ``;
      for (let key in topic[rand].item) {
        //   console.log(key)
        opt += `<input name="radio" id="radio${list[key]}" type="radio" />
        <div class="item">
          <label for="radio${list[key]}" onclick="setTimeout(() => {
  send();
}, 1);"><span>${topic[rand].item[key]}</span></label>
        </div>`;
      }
      document.querySelectorAll("div.options")[0].innerHTML = opt;
    } else if (topic[rand].answer.includes(",")) {
      // 多选题处理
      topicType = "多选题";
      // console.log(topic[rand].answer);
      let opt = ``;
      for (let key in topic[rand].item) {
        //   console.log(key)
        opt += `<input name="radio" id="radio${list[key]}" type="checkbox" />
        <div class="item">
          <label for="radio${list[key]}"><span>${topic[rand].item[key]}</span></label>
        </div>`;
      }
      document.querySelectorAll("div.options")[0].innerHTML = opt;
    }
    document.querySelectorAll("div.answer")[0].setAttribute("bool", ``);
    document.querySelectorAll("div.type")[0].textContent = `${topicType}`;
    document.querySelectorAll(
      "div.left > span"
    )[0].textContent = `${newTopic.answer}`;
    bool[2] = false;
  } else {
    send();
  }
}

let time = [0, 0];

let timer = setInterval(() => {
  time[1]++;
  if (time[1] > 59) {
    time[0]++;
    time[1] = 0;
  }
  document.querySelectorAll(
    "div.head > div > span.time"
  )[0].textContent = `${time[0].toString().padStart(2, "0")}:${time[1]
    .toString()
    .padStart(2, "0")}`;
}, 1000);
