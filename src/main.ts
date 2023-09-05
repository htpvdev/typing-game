import './style.css'

import _ from 'lodash'

import {
  questionDictionary,
  Question,
  Stages,
  stages,
} from './config/questions'
import {
  createFirstInputText,
  setHtml,
  setStyle,
  setText,
  setValue,
} from './method'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <!-- <audio id="errorSound" src="path_to_your_audio_file/error.mp3" preload="auto"></audio> -->
    <div id="dashboard">
      <h1 id="mainText">タイピングゲーム</h1>
      <p id="subText">残り時間: <span id="time">--</span> スコア: <span id="score">--</span></p>
    </div>

    <div id="stageSelect">
      <h2>ステージを選択</h2>
      ${_.map(stages, (stageName, stage) => {
        return `<button id="${stage}StageBtn">${stageName}</button>`
      }).join('')}
    </div>

    <div id="gameArea">
      <div id="countdown"><p>3</p></div>
      <div id="questionView"><p> </p></div>
      <div id="furiganaView"><p> </p></div>
      <div id="inputKeyView"><p> </p></div>
      <input type="text" id="userInput">
    </div>

    <div>
      <div id="resultView"><p> </p></div>
      <button id="restartBtn">再スタート</button>
    </div>
  </div>
`

const questionViewEl = document
  .querySelector<HTMLDivElement>('#questionView')
  ?.querySelector('p')
const furiganaViewEl = document
  .querySelector<HTMLDivElement>('#furiganaView')
  ?.querySelector('p')
const inputKeyViewEl = document
  .querySelector<HTMLDivElement>('#inputKeyView')
  ?.querySelector('p')
const resultViewEl = document
  .querySelector<HTMLDivElement>('#resultView')
  ?.querySelector('p')
const userInputEl = document.querySelector<HTMLInputElement>('#userInput')
const countdownEl = document
  .querySelector<HTMLDivElement>('#countdown')
  ?.querySelector('p')
const gameAreaEl = document.querySelector<HTMLDivElement>('#gameArea')
const stageSelectEl = document.querySelector<HTMLDivElement>('#stageSelect')
// const errorSound = document.querySelector<>('#errorSound');

let setQuestions: Question[] = []
let currentQuestion = 0
let correctCount = 0
// let totalAttempts = 0;
let wrongCharCount = 0
let countdownInterval: number | undefined
// let afterCurrentTarget = '';
let currentTarget = ''
let inputExist = false
let redContent = ''
let newContent = ''
let remainingTarget = ''

// 最初に表示しない要素を隠す
setStyle(gameAreaEl, 'none')

const startGame = (stage: Stages) => {
  setQuestions = questionDictionary[stage]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
  currentQuestion = 0
  correctCount = 0
  setText(questionViewEl, ' ')
  setText(furiganaViewEl, ' ')
  setText(inputKeyViewEl, ' ')
  setText(resultViewEl, ' ')
  setStyle(stageSelectEl, 'none')
  setStyle(gameAreaEl, 'flex')

  startCountdown(changeWord)
}

const startCountdown = (callback: () => void) => {
  let countdownValue = 3
  setText(countdownEl, String(countdownValue))
  countdownInterval = setInterval(() => {
    countdownValue--
    setText(countdownEl, String(countdownValue))

    if (countdownValue < 0) {
      countdownValue = 3
      clearInterval(countdownInterval)
      setStyle(countdownEl, 'none')
      callback()
    }
  }, 1000)
}

const changeWord = () => {
  if (currentQuestion < setQuestions.length) {
    // 修正：問題数に基づく条件判定
    setText(questionViewEl, setQuestions[currentQuestion].questionText)
    setText(furiganaViewEl, setQuestions[currentQuestion].furigana)
    setHtml(
      inputKeyViewEl,
      createFirstInputText(setQuestions[currentQuestion].furigana),
    )
    currentQuestion++
  } else {
    setStyle(gameAreaEl, 'none')
    setHtml(
      resultViewEl,
      `単語数: ${correctCount} / ${setQuestions.length}<br>間違えた文字数: ${wrongCharCount}`,
    )
  }
}

const restartGame = () => {
  clearInterval(countdownInterval) // この行を追加

  setStyle(stageSelectEl, 'flex')
  setStyle(gameAreaEl, 'none')
  setStyle(countdownEl, 'block')
  setText(countdownEl, '3')
  setText(userInputEl, '')
  setHtml(inputKeyViewEl, ' ')
  setText(questionViewEl, ' ')
  setText(furiganaViewEl, ' ')
  setHtml(resultViewEl, ' ')

  wrongCharCount = 0
  correctCount = 0
  currentQuestion = 0
  // afterCurrentTarget = '';
  currentTarget = ''
  inputExist = false
  redContent = ''
  newContent = ''
}

_.forEach(stages, (_stageName, stage) => {
  document
    .querySelector<HTMLButtonElement>(`#${stage}StageBtn`)
    ?.addEventListener('click', () => startGame(stage as Stages))
})

document
  .querySelector<HTMLButtonElement>('#restartBtn')
  ?.addEventListener('click', restartGame)

userInputEl?.addEventListener('keydown', (e) => {
  console.log(e.key)
  const targetQuestion = createFirstInputText(
    setQuestions[currentQuestion - 1].furigana,
  )
  if (inputExist) {
    currentTarget = remainingTarget
  } else {
    currentTarget = targetQuestion // 修正: 現在の問題の単語を正しく取得
  }
  const inputValue = userInputEl?.value
  const inputKey = e.key

  if (inputKey === currentTarget[0]) {
    inputExist = true
    redContent += `<span style="color: red">${currentTarget[0]}</span>`
    remainingTarget = currentTarget.slice(1)
    newContent = redContent + remainingTarget
    setHtml(inputKeyViewEl, newContent)
  } else {
    wrongCharCount++
    e.preventDefault()

    setHtml(inputKeyViewEl, inputExist ? newContent : targetQuestion)
  }

  if (targetQuestion === inputValue + e.key || targetQuestion === inputValue) {
    correctCount++
    setValue(userInputEl, '')
    inputExist = false
    currentTarget = ''
    redContent = ''
    newContent = ''
    e.preventDefault()
    changeWord()
  }
})
