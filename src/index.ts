import _ from 'lodash'
import $ from 'jquery'

import { questionDictionary, Question, stages, Stages } from './config/questions'
import { returnInputKeyText } from './method';

import './index.scss'
import { State } from './state';

const userInputEl = $('#userInput');
const inputKeyViewEl = $('#inputKeyView');
const resultViewEl = $('#resultView');
const countdownEl = $('#countdown');
const gameAreaEl = $('#gameArea');
const stageSelectEl = $('#stageSelect');
const questionViewEl = $('#questionView');
// const errorSound = $('#errorSound');

// const state = State.getInstance()

/**  */
let nowQuestions: Question[] = [];
/** 選択されたステージの文字列キーが入る */
let nowStage: Stages;
/** 現在何問目か */
let currentQuestion: number;
/** 完了した問題の数 */
let correctCount: number;
/** 何回間違えたか */
let wrongCharCount = 0;
/**  */
let currentTarget = '';
/** 赤文字のHTMLテキストを格納する */
let redContent = '';
/**  */
let newContent = '';
/**  */
let remainingTarget = '';
/**  */
let targetQuestion = '';
/**  */
let inputExist = false;
/**  */
let afterCurrentTarget = '';
/**  */

// 最初に表示しない要素を隠す
gameAreaEl.hide();
// ステージのボタンのリストを作る
stageSelectEl.html(_.map(stages, (stageName, stage) => `<button id="${stage}StageBtn">${stageName}</button>`).join(''));


const startGame = (stage: Stages) => {
    nowQuestions = questionDictionary[stage].sort(() => Math.random() - 0.5).slice(0, 5);
    currentQuestion = 0;
    correctCount = 0;
    stageSelectEl.hide();
    gameAreaEl.show();
    startCountdown(() => changeWord(nowQuestions));
}

const startCountdown = (callback: () => void) => {
    // let countdownInterval: NodeJS.Timeout;
    let countdownValue = 3;
    countdownEl.text(String(countdownValue));

    const countdownInterval = setInterval(() => {
        countdownValue--;
        countdownEl.text(String(countdownValue));

        if (countdownValue < 0) {
            countdownValue = 3;
            clearInterval(countdownInterval);
            countdownEl.hide();
            callback();
        }
    }, 1000);
}

const changeWord = (nowQuestions: Question[]) => {
    console.log(nowQuestions)
    if (currentQuestion < nowQuestions.length) {
        questionViewEl.text(nowQuestions[currentQuestion].questionText);
        targetQuestion = returnInputKeyText(nowQuestions[currentQuestion].furigana)
        console.log(targetQuestion);
        currentTarget = remainingTarget;

        inputKeyViewEl.html(targetQuestion);
        currentQuestion++;
    } else {
        gameAreaEl.hide();
        resultViewEl.html(`単語数: ${correctCount} / ${nowQuestions.length}<br>間違えた文字数: ${wrongCharCount}`);
    }
}

const backToStageSelect = () => {
    // clearInterval(countdownInterval);  // この行を追加

    stageSelectEl.show();
    gameAreaEl.hide();
    countdownEl.show();
    countdownEl.text('3');
    userInputEl.val('');
    inputKeyViewEl.html('');
    questionViewEl.text('');
    resultViewEl.html('');
    wrongCharCount = 0;
    correctCount = 0;
    currentQuestion = 0;
    afterCurrentTarget = '';
    currentTarget = '';
    inputExist = false;
    redContent = '';
    newContent = '';
}

//#region イベントリスナー

userInputEl.on('keydown', (e) => {
    const inputValue = userInputEl.val();
    const inputKey = e.key;

    if (inputKey === currentTarget[0]) {
        redContent += `<span style="color: red">${currentTarget[0]}</span>`;
        remainingTarget = currentTarget.slice(1);
        newContent = redContent + remainingTarget;
        inputKeyViewEl.html(newContent);
    } else {
        wrongCharCount++;
        e.preventDefault();
        inputKeyViewEl.html(newContent);
    }

    if (inputValue !== '' && targetQuestion === inputValue + e.key || targetQuestion === inputValue) {
        console.log('正解や！問題変更や！')
        correctCount++;
        userInputEl.val('');
        inputExist = false;
        currentTarget = ''
        redContent = '';
        newContent = '';
        e.preventDefault();
        changeWord([]);
    }
});

_.forEach(stages, (stageName, stage: Stages) => {
    $(`#${stage}StageBtn`).on('click', () => startGame(stage));
})

$('#restartBtn').on('click', backToStageSelect);

//#endregion イベントリスナー
