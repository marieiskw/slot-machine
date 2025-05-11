const slots = [
  document.getElementById('slot1'),
  document.getElementById('slot2'),
  document.getElementById('slot3'),
];
let isSpinning = [false, false, false];
let slotTimers = [];

let firstSymbols = [];
let secondSymbols = [];
let thirdSymbols = [];

// 当日の参加者の人数に変更
const people = 256;
let hundredsPlace = Math.trunc(people / 100);
let tensPlace = Math.trunc((people % 100) / 10);
let onesPlace = Math.trunc((people % 100) % 10);

function resetSlot() {
  firstSymbols = [];
  secondSymbols = [];
  thirdSymbols = [];
  for(let i = 0; i <= hundredsPlace; i++) {
    firstSymbols.push(i);
  }
  for(let i = 0; i <= 9; i++) {
    secondSymbols.push(i);
    thirdSymbols.push(i);
  }
}

function startSlot() {
  resetSlot();
  for (let i = 0; i < slots.length; i++) {
    if (!isSpinning[i]) {
      isSpinning[i] = true;
      slotTimers[i] = setInterval(() => {
          switch(i) {
            case 0:
              slots[i].textContent = firstSymbols[Math.floor(Math.random() * firstSymbols.length)];
              break;
            case 1:
              slots[i].textContent = secondSymbols[Math.floor(Math.random() * secondSymbols.length)];
              break;
            case 2:
              slots[i].textContent = thirdSymbols[Math.floor(Math.random() * thirdSymbols.length)];
              break;
          }
      }, 40);
    }
  }
}

function stopSlot(reelIndex) {
  if (isSpinning[reelIndex]) {
    clearInterval(slotTimers[reelIndex]);
    isSpinning[reelIndex] = false;
    
    // 10の位の数値範囲を再設定
    if(reelIndex === 0) {
      const firstDigit = parseInt(slots[0].textContent);

      secondSymbols = [];
      const maxTens = (firstDigit === hundredsPlace) ? tensPlace : 9;
      for(let i = 0; i <= maxTens; i++) {
        secondSymbols.push(i);
      }
    }
      // 1の位の数値範囲を再設定
      if(reelIndex === 1) {
        const firstDigit = parseInt(slots[0].textContent);
        const secondDigit = parseInt(slots[1].textContent);
  
        thirdSymbols = [];
        const maxUnit = (firstDigit === hundredsPlace && secondDigit === tensPlace) ? onesPlace : 9;
        for(let i = 0; i <= maxUnit; i++) {
          thirdSymbols.push(i);
        }
      }
  }
}

const pressKeyboard = (event) => {
  const key = event.key
  if (key === ' ') {
    startSlot();
  } else if (key === 'Enter') {
    let idx = 0
    isSpinning.forEach(spinningFlg => {
      if(spinningFlg) {
        stopSlot(idx);
        return;
      }
      idx++;
    });
  }
}

window.addEventListener('keydown', pressKeyboard)

document.getElementById('startButton').addEventListener('click', startSlot);
document
  .getElementById('stopButton1')
  .addEventListener('click', () => stopSlot(0));
document
  .getElementById('stopButton2')
  .addEventListener('click', () => stopSlot(1));
document
  .getElementById('stopButton3')
  .addEventListener('click', () => stopSlot(2));
