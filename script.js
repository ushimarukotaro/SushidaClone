const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById('typeDisplay');
const typeInput = document.getElementById('typeInput');
const timer = document.getElementById('timer');

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

// inputテキスト入力。合っているかどうかの判定
typeInput.addEventListener("input", () => {

  // タイプ音をつける
  typeSound.volume = 0.3;

  typeSound.play();
  typeSound.currentTime = 0;
  const sentenceArray = typeDisplay.querySelectorAll("span");

  // console.log(sentenceArray);
  const arrayValue = typeInput.value.split("");

  let correct = true;
  sentenceArray.forEach((characterSpan, index) => {
    if ((arrayValue[index] == null)) { //何も入力していない
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterSpan.innerText == arrayValue[index]) { // 正解を入力した時
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else { // 間違えた時
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");

      wrongSound.volume = 0.3;
      wrongSound.play();
      wrongSound.currentTime = 0;

      correct = false;
    }
  });

  if(correct == true) {
    correctSound.volume = 0.6;

    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
  }
})




// 非同期でランダムば文章を取得する
function GetRandomSentence() {
  // APIを利用するときはfetch()を使う
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then((data) => data.content);
}

// ランダムな文章を取得し表示する
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  console.log(sentence);

  typeDisplay.innerText = "";

  // 文章を1文字ずつ分解して、spanタグを生成する
  let oneText = sentence.split("");

  oneText.forEach((character) => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    // console.log(characterSpan);
    typeDisplay.appendChild(characterSpan);
    // characterSpan.classList.add('correct');
  });

  // テキストボックスの中身を消す
  typeInput.value = "";

  StartTimer();
}

let startTime;

let originTime = 30;
function StartTimer() {
  timer.innerText = originTime;
  timer.classList.remove('incorrect');
  startTime = new Date();
  // console.log(startTime);
  setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    if(timer.innerText <= 5) {
      timer.classList.add('incorrect');
    }
    if (timer.innerText <= 0) TimeUp();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function TimeUp() {
  return RenderNextSentence();
}

RenderNextSentence();