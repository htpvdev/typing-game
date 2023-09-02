import { Question, Stages } from "./config/questions";

export class State {
  private static instance: State;

  /**  */
  private globalNowQuestions: Question[] = [];
  /** 選択されたステージの文字列キーが入る */
  private globalNowStage: Stages;
  /** 現在何問目か */
  private globalCurrentQuestion: number;
  /** 完了した問題の数 */
  private globalCorrectCount: number;
  /** 何回間違えたか */
  private globalWrongCharCount = 0;
  /**  */
  private globalCurrentTarget = '';
  /** 赤文字のHTMLテキストを格納する */
  private globalRedContent = '';
  /**  */
  private globalNewContent = '';
  /**  */
  private globalRemainingTarget = '';
  /**  */
  private globalTargetQuestion = '';
  /**  */
  private globalInputExist = false;
  /**  */
  private globalAfterCurrentTarget = '';
  /**  */

  private constructor() {}

  static getInstance(): State {
      if (!this.instance) {
          this.instance = new State();
      }
      return this.instance;
  }

  get nowQuestions(): Question[] {
      return this.globalNowQuestions;
  }

  // set nowQuestions(nowQuestions: Question[]) {
  //     this.globalNowQuestions = nowQuestions;
  // }

  set nowQuestions(nowQuestions: Question[]) {
    console.log("Setting nowQuestions:", nowQuestions);
    this.globalNowQuestions = nowQuestions;
}


  get nowStage(): Stages {
      return this.globalNowStage;
  }

  set nowStage(nowStage: Stages) {
      this.globalNowStage = nowStage;
  }

  get currentQuestion(): number {
      return this.globalCurrentQuestion;
  }

  set currentQuestion(currentQuestion: number) {
      this.globalCurrentQuestion = currentQuestion;
  }

  get correctCount(): number {
      return this.globalCorrectCount;
  }

  set correctCount(correctCount: number) {
      this.globalCorrectCount = correctCount;
  }

  get wrongCharCount(): number {
      return this.globalWrongCharCount;
  }

  set wrongCharCount(wrongCharCount: number) {
      this.globalWrongCharCount = wrongCharCount;
  }

  get currentTarget(): string {
      return this.globalCurrentTarget;
  }

  set currentTarget(currentTarget: string) {
      this.globalCurrentTarget = currentTarget;
  }

  get redContent(): string {
      return this.globalRedContent;
  }

  set redContent(redContent: string) {
      this.globalRedContent = redContent;
  }

  get newContent(): string {
      return this.globalNewContent;
  }

  set newContent(newContent: string) {
      this.globalNewContent = newContent;
  }

  get remainingTarget(): string {
      return this.globalRemainingTarget;
  }

  set remainingTarget(remainingTarget: string) {
      this.globalRemainingTarget = remainingTarget;
  }

  get targetQuestion(): string {
      return this.globalTargetQuestion;
  }

  set targetQuestion(targetQuestion: string) {
      this.globalTargetQuestion = targetQuestion;
  }

  get inputExist(): boolean {
      return this.globalInputExist;
  }

  set inputExist(inputExist: boolean) {
      this.globalInputExist = inputExist;
  }

  get afterCurrentTarget(): string {
      return this.globalAfterCurrentTarget;
  }

  set afterCurrentTarget(afterCurrentTarget: string) {
      this.globalAfterCurrentTarget = afterCurrentTarget;
  }

  public resetState() {
      this.globalNowQuestions = [];;
      this.globalCurrentQuestion = 0;
      this.globalCorrectCount = 0;
      this.globalWrongCharCount = 0;
      this.globalCurrentTarget = '';
      this.globalRedContent = '';
      this.globalNewContent = '';
      this.globalRemainingTarget = '';
      this.globalTargetQuestion = '';
      this.globalInputExist = false;
      this.globalAfterCurrentTarget = '';
  }
}