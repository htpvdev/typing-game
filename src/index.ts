import _ from 'lodash'
import $ from 'jquery'

import questions, { Question } from './config/questions'
import romajiInputMap, { Romaji } from './config/romaji'

import './index.css'

const msg = [ '焦らず頑張って！', '基礎ができていませんね', 'どうしてこれができないんですか？', 'まずは何ができないのか最初に言ってください。' ];

$(function () {
    const inputKeyViewEl = $('#inputKeyView');
    const userInputEl = $('#userInput');
    const resultViewEl = $('#resultView');
    const countdownEl = $('#countdown');
    const gameAreaEl = $('#gameArea');
    const genreSelectionEl = $('#genreSelection');
    const questionViewEl = $('#questionView');
    const msgEl = $('#msg');
    // const errorSound = $('#errorSound');
    
    let setQuestions: Question[] = [];
    let currentQuestion = 0;
    let correctCount = 0;
    let totalAttempts = 0;
    let wrongCharCount = 0;
    let countdownInterval: NodeJS.Timeout;
    let afterCurrentTarget = '';
    let currentTarget = '';
    let inputExist = false;
    let redContent = '';
    let newContent = '';
    let remainingTarget = '';
    
    // 最初に表示しない要素を隠す
    gameAreaEl.hide();
    
    
    
    function returnInputText(furigana: string) {
        const wordList: string[] = [];
        let skipFlag = false;
        furigana.split('').map((word, index) => {
            if (skipFlag) {
                skipFlag = false;
                return;
            }
    
            let wordRomaji = word;
    
            if (
                furigana[index + 1] === 'ァ'
                || furigana[index + 1] === 'ィ'
                || furigana[index + 1] === 'ゥ'
                || furigana[index + 1] === 'ェ'
                || furigana[index + 1] === 'ォ'
                || furigana[index + 1] === 'ャ'
                || furigana[index + 1] === 'ュ'
                || furigana[index + 1] === 'ョ'
            ) {
                wordRomaji = word + furigana[index + 1];
                skipFlag = true;
            }
            wordList.push(wordRomaji);
        });
    
        let inputText = '';
    
        wordList.map((word, index) => {
            // 「ッ」の直前対応
            if (word === 'ッ') {
                inputText += romajiInputMap[wordList[index + 1] as Romaji][0].charAt(0);
                return;
            }
            // 「ン」のナ行直前対応
            if (word === 'ン') {
                const nextWord = wordList[index + 1][0];
                if (
                    nextWord === 'ナ'
                    || nextWord === 'ニ'
                    || nextWord === 'ヌ'
                    || nextWord === 'ネ'
                    || nextWord === 'ノ'
                ) {
                    inputText += 'nn';
                    return;
                }
            }
    
            inputText += (romajiInputMap[word as Romaji] ?? [word])[0];
        });
    
        return inputText;
    }
    
    function changeWord() {
        if (currentQuestion < setQuestions.length) {  // 修正：問題数に基づく条件判定
            questionViewEl.text(setQuestions[currentQuestion].questionText);
    
            console.log('changeWord, next text is ', returnInputText(setQuestions[currentQuestion].furigana));
    
            inputKeyViewEl.html(returnInputText(setQuestions[currentQuestion].furigana));
            currentQuestion++;
        } else {
            gameAreaEl.hide();
            resultViewEl.html(`単語数: ${correctCount} / ${setQuestions.length}<br>間違えた文字数: ${wrongCharCount}`);
        }
    }

    // デバウンス関数の定義
function debounce(func: (e: any) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

    
    userInputEl.on('keydown', debounce(function (e) {
        const targetQuestion = returnInputText(setQuestions[currentQuestion - 1].furigana);
        if (inputExist) {
            currentTarget = remainingTarget;
        } else {
            currentTarget = targetQuestion;  // 修正: 現在の問題の単語を正しく取得
        }
        const inputValue = $(this).val();
        const inputKey = e.key;
    
        if (inputKey === currentTarget[0]) {
            inputExist = true;
            redContent += `<span style="color: red">${currentTarget[0]}</span>`;
            remainingTarget = currentTarget.slice(1);
            newContent = redContent + remainingTarget;
            inputKeyViewEl.html(newContent);
            msgEl.html('');
            // $(this).val();
        } else {
            wrongCharCount++;
            e.preventDefault();
            msgEl.html(`<span style="color: red">${randomMsg(wrongCharCount)}</span>`);
            if (inputExist) {
                inputKeyViewEl.html(newContent);
            } else {
                inputKeyViewEl.html(targetQuestion);
            }
        }
    
        if (targetQuestion === inputValue + e.key || targetQuestion === inputValue) {
            console.log('正解や！問題変更や！')
            correctCount++;
            $(this).val('');
            inputExist = false;
            currentTarget = ''
            redContent = '';
            newContent = '';
            e.preventDefault();
            changeWord();
        }
    }, 10));
    
    function startCountdown(callback: () => void) {
        let countdownValue = 3;
        countdownEl.text(countdownValue);
        countdownInterval = setInterval(() => {
            countdownValue--;
            countdownEl.text(countdownValue);
    
            if (countdownValue < 0) {
                countdownValue = 3;
                clearInterval(countdownInterval);
                countdownEl.hide();
                callback();
            }
        }, 1000);
    }
    
    function startGame(genre: 'iphone' | 'program') {
        setQuestions = questions[genre].sort(() => Math.random() - 0.5).slice(0, 5);
        currentQuestion = 0;
        correctCount = 0;
        genreSelectionEl.hide();
        gameAreaEl.show();
    
        startCountdown(changeWord);
    }
    
    $('#iphoneGenreBtn').on('click', () => startGame('iphone'));
    $('#programGenreBtn').on('click', () => startGame('program'));
    
    function randomMsg(wrongCharCount: number) {
        if (msg.length < wrongCharCount) {
            return 'しんじゃえ(*´∀｀) [笑]';
        }
        return msg[wrongCharCount - 1];
    }
    
    function restartGame() {
        clearInterval(countdownInterval);  // この行を追加
    
        genreSelectionEl.show();
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
    
    $('#restartBtn').on('click', restartGame);

})

