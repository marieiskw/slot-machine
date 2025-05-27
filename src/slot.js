const slots = [
  document.getElementById("slot1"),
  document.getElementById("slot2"),
  document.getElementById("slot3"),
];
let isSpinning = [false, false, false];
let slotTimers = [];

let firstSymbols = [];
let secondSymbols = [];
let thirdSymbols = [];

let fullScreenFlg = false;

// 音声ファイル
const timpani = new Audio("src/sounds/timpani.mp3");
const rollStop = new Audio("src/sounds/rollStop.mp3");
const tadah = new Audio("src/sounds/tadah.mp3");

// 当日の参加者の人数に変更
const people = 230;
let hundredsPlace = Math.floor(people / 100);
let tensPlace = Math.floor((people % 100) / 10);
let onesPlace = Math.floor(people % 10);

// 既出の当選番号
// let usedNumbers = new Set(["000"]);

let savedInfo;

// ローカルストレージの情報を取り出す
function getSavedInfo() {
  let savedNumbers = localStorage.getItem("usedNumbers");
  let usedNumbers = new Set(["000"]);
  if (savedNumbers) {
    try {
      console.log('savedNumbers:', savedNumbers);
      usedNumbers = new Set();
      console.log('this.usedNumbers:', usedNumbers)
      const parsed = JSON.parse(savedNumbers);
      if (Array.isArray(parsed)) {
        parsed.forEach((num) => usedNumbers.add(num));
      }
    } catch (e) {
      console.error("ERROR", e);
    }
  }
  return usedNumbers
}

// 重複チェック用
function getExcludedUnits(firstDigit, secondDigit) {
  const excluded = [];

  const firstStr = String(firstDigit).padStart(1, "0");
  const secondStr = String(secondDigit).padStart(1, "0");

  this.savedInfo.forEach((num) => {
    const h = num.charAt(0);
    const t = num.charAt(1);
    const o = parseInt(num.charAt(2));
    if (firstStr === h && secondStr === t) {
      excluded.push(o);
    }
  });

  return excluded;
}

// 10の位の数字が有効かチェック
function getValidTens(firstDigit) {
  const validNum = [];
  for (let i = 0; i <= 9; i++) {
    const excluded = getExcludedUnits(firstDigit, i);
    if (excluded.length < 10) {
      validNum.push(i);
    }
  }
  return validNum;
}

function resetSlot() {
  firstSymbols = [];
  secondSymbols = [];
  thirdSymbols = [];
  for (let i = 0; i <= hundredsPlace; i++) {
    firstSymbols.push(i);
  }
  for (let i = 0; i <= 9; i++) {
    secondSymbols.push(i);
    thirdSymbols.push(i);
  }
}

function startSlot() {
  this.savedInfo = getSavedInfo();
  resetSlot();

  timpani.currentTime = 0;
  timpani.play();

  for (let i = 0; i < slots.length; i++) {
    if (!isSpinning[i]) {
      isSpinning[i] = true;
      slotTimers[i] = setInterval(() => {
        switch (i) {
          case 0:
            slots[i].textContent =
              firstSymbols[Math.floor(Math.random() * firstSymbols.length)];
            break;
          case 1:
            slots[i].textContent =
              secondSymbols[Math.floor(Math.random() * secondSymbols.length)];
            break;
          case 2:
            slots[i].textContent =
              thirdSymbols[Math.floor(Math.random() * thirdSymbols.length)];
            break;
        }
      }, 150);
    }
  }
}

function stopSlot(reelIndex) {
  if (isSpinning[reelIndex]) {
    clearInterval(slotTimers[reelIndex]);
    isSpinning[reelIndex] = false;

    if (reelIndex < 2) {
      rollStop.currentTime = 0;
      rollStop.play();
    } else if (reelIndex === 2) {
      tadah.currentTime = 0;
      tadah.play();
      timpani.pause();

      // const currentNum = `${slots[0].textContent}${slots[1].textContent}${slots[2].textContent}`;
      // const currentNum = ${slots[0].textContent}${slots[1].textContent}${slots[2].textContent};
      const currentNum =
        String(slots[0].textContent).padStart(1, "0") +
        String(slots[1].textContent).padStart(1, "0") +
        String(slots[2].textContent).padStart(1, "0");
      this.savedInfo.add(currentNum);

      console.log(this.savedInfo);
      // ローカルストレージに保存
      localStorage.setItem(
        "usedNumbers",
        JSON.stringify(Array.from(this.savedInfo))
      );
    }

    // 10の位の数値範囲を再設定
    if (reelIndex === 0) {
      const firstDigit = parseInt(slots[0].textContent);

      const validtens = getValidTens(firstDigit);
      const maxTens = firstDigit === hundredsPlace ? tensPlace : 9;

      secondSymbols = validtens.filter((t) => t <= maxTens);
    }
    // 1の位の数値範囲を再設定
    if (reelIndex === 1) {
      const firstText = slots[0].textContent;
      const firstDigit = firstText ? parseInt(firstText) : 0;
      const secondDigit = parseInt(slots[1].textContent);

      const excludedUnits = getExcludedUnits(firstDigit, secondDigit);

      thirdSymbols = [];
      const maxUnit =
        firstDigit === hundredsPlace && secondDigit === tensPlace
          ? onesPlace
          : 9;
      for (let i = 0; i <= maxUnit; i++) {
        if (!excludedUnits.includes(i)) {
          thirdSymbols.push(i);
        }
      }
    }
  }
}

const pressKeyboard = (event) => {
  const key = event.key;
  if (key === " ") {
    startSlot();
  } else if (key === "Enter") {
    let idx = 0;
    isSpinning.forEach((spinningFlg) => {
      if (spinningFlg) {
        stopSlot(idx);
        return;
      }
      idx++;
    });
  }
};

window.addEventListener("keydown", pressKeyboard);

// document.getElementById("startButton").addEventListener("click", startSlot);
document
  .getElementById("stopButton1")
  .addEventListener("click", () => stopSlot(0));
document
  .getElementById("stopButton2")
  .addEventListener("click", () => stopSlot(1));
document
  .getElementById("stopButton3")
  .addEventListener("click", () => stopSlot(2));

document.getElementById("fullScreen").addEventListener("click", () => {
  if(!this.fullScreenFlg){
    console.log('false')
    document.documentElement.requestFullscreen();
    this.fullScreenFlg = true;
  } else {
    console.log('true')
    document.exitFullscreen();
    this.fullScreenFlg = false;
  }
});
