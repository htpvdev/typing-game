export const stages = {
  phoneShop: '携帯店員の金言',
  program: 'プログラマー所信',
  se: 'SEの業務のやりとり',
}

export type Stages = keyof typeof stages
export type QuestionDictionary = {
  [K in Stages]: Question[]
}

export const questionDictionary: QuestionDictionary = {
  phoneShop: [
    { questionText: 'お乗り換えでしょうか', furigana: 'オノリカエデショウカ' },
    {
      questionText: 'iPhoneが今なら安いですよ',
      furigana: 'iPhoneガイマナラヤスイデスヨ',
    },
    {
      questionText: 'キャッシュバックが今なら2万円です',
      furigana: 'キャッシュバックガイマナラ2マンエンデス',
    },
    {
      questionText: 'ご家族と一緒に申し込むとキャッシュバックが増えます',
      furigana: 'ゴカゾクトイッショニモウシコムトキャッシュバックガフエマス',
    },
    {
      questionText:
        '解約金はかからないので契約してから2か月後に解約してUQに乗り換えましょう',
      furigana:
        'カイヤクキンハカカラナイノデケイヤクシテカラ2カゲツゴニカイヤクシテUQニノリカエマショウ',
    },
  ],

  program: [
    { questionText: '条件分岐', furigana: 'if' },
    { questionText: 'ホワイル', furigana: 'while' },
    { questionText: 'フォー！', furigana: 'for' },
    { questionText: 'Let it be', furigana: 'let' },
    { questionText: '偉大なるOS', furigana: 'Linux' },
    { questionText: 'カラオケ', furigana: 'echo' },
    {
      questionText: 'まずは画面共有をします',
      furigana: 'マズハガメンキョウユウヲシマス',
    },
  ],

  se: [],
}

export type Question = {
  questionText: string
  furigana: string
}
