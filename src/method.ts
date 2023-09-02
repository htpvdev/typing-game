import romaji, { Romaji } from "./config/romaji";

/**
 * フリガナから実際のキー入力するデータを返す。引数が「シンニョウ3ホン」であれば「sinnyou3hon」を返す。
 * @param furigana フリガナ(カタカナ)
 * @returns ローマ字の文字列
 *
 */
export const returnInputKeyText = (furigana: string) => {
  const wordList: string[] = [];
  let skipFlag = false;
  furigana.split('').map((word, index) => {
      if (skipFlag === true) {
          skipFlag = false;
          return;
      }

      let wordPiece = word;

      // この次の文字が小文字の場合は、次の文字と結合して1つの文字として配列に格納する
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
          wordPiece = word + furigana[index + 1];
          skipFlag = true;
      }
      wordList.push(wordPiece);
  });

  let inputText = '';

  wordList.map((word, index) => {
      // 「ッ」の直前対応
      if (word === 'ッ') {
          inputText += romaji[wordList[index + 1] as Romaji][0].charAt(0);
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
              || nextWord === 'ン'
          ) {
              inputText += 'nn';
              return;
          }
      }

      inputText += (romaji[word as Romaji] ?? [word])[0];
  });

  return inputText;
}