/** @description 副作用のない純粋関数を定義する */

import romaji, { Romaji } from './config/romaji'

export const setText = (el: HTMLElement | null | undefined, text: string) => {
  // console.log(text)
  if (el?.textContent) {
    el.textContent = text
  }
}

export const setHtml = (
  el: HTMLElement | null | undefined,
  htmlText: string,
) => {
  if (el?.innerHTML) {
    el.innerHTML = htmlText
  }
}

export const setStyle = (el: HTMLElement | null | undefined, style: string) => {
  if (el?.style) {
    el.style.display = style
  }
}

export const setValue = (el: HTMLInputElement | null, value: string) => {
  if (el?.value) {
    el.value = value
  }
}

export const returnInputText = (furigana: string) => {
  const wordList: string[] = []
  let skipFlag = false
  furigana.split('').map((word, index) => {
    if (skipFlag) {
      skipFlag = false
      return
    }

    let wordRomaji = word

    if (
      furigana[index + 1] === 'ァ' ||
      furigana[index + 1] === 'ィ' ||
      furigana[index + 1] === 'ゥ' ||
      furigana[index + 1] === 'ェ' ||
      furigana[index + 1] === 'ォ' ||
      furigana[index + 1] === 'ャ' ||
      furigana[index + 1] === 'ュ' ||
      furigana[index + 1] === 'ョ'
    ) {
      wordRomaji = word + furigana[index + 1]
      skipFlag = true
    }
    wordList.push(wordRomaji)
  })

  let inputText = ''

  wordList.map((word, index) => {
    // 「ッ」の直前対応
    if (word === 'ッ') {
      inputText += romaji[wordList[index + 1] as Romaji][0].charAt(0)
      return
    }
    // 「ン」のナ行直前対応
    if (word === 'ン') {
      const nextWord = wordList[index + 1][0]
      if (
        nextWord === 'ナ' ||
        nextWord === 'ニ' ||
        nextWord === 'ヌ' ||
        nextWord === 'ネ' ||
        nextWord === 'ノ'
      ) {
        inputText += 'nn'
        return
      }
    }

    inputText += (romaji[word as Romaji] ?? [word])[0]
  })

  return inputText
}
