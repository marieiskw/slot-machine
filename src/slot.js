const slots = [
  document.getElementById('slot1'),
  document.getElementById('slot2'),
  document.getElementById('slot3'),
];
let isSpinning = [false, false, false];
let slotTimers = [];

const firstSymbols = ['0', '1', '2'];
const otherSymbols = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

function startSlot() {
  for (let i = 0; i < slots.length; i++) {
    if (!isSpinning[i]) {
      isSpinning[i] = true;
      slotTimers[i] = setInterval(() => {
        slots[i].textContent =
          i === 0
            ? firstSymbols[Math.floor(Math.random() * firstSymbols.length)]
            : otherSymbols[Math.floor(Math.random() * otherSymbols.length)];
      }, 40);
    }
  }
}

function stopSlot(reelIndex) {
  if (isSpinning[reelIndex]) {
    clearInterval(slotTimers[reelIndex]);
    isSpinning[reelIndex] = false;
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
