# タイピングゲーム(Vite + VanillaTS)

知人のGさんがChatGPTと作ったタイピングゲームをもらっていじってます。

遊べるようにデプロイしてるページはこちら！

- [タイピングゲーム](https://htpvdev.github.io/contents/typing-game/dist/index.html)

Viteで、ESLint + PrettierでVanillaTS環境を作ってるので、ボイラープレートに使えます。
`npx vite init`を実行するだけですぐ作れるんですけどね。

TypeScriptが使いたくて、Webpackで環境構築しました。でも、グローバル変数が効かなかったり環境構築でちょうしんどかった。
Viteに乗り換えたら、面倒な設定がなくて拍子抜けした。楽するためにTypeScript使うんだし、Viteみたいなフレームワークに乗っかる方がいいですね。

- サーバー起動コマンド

```
npm run dev
```

- ビルドコマンド(URLをGitHub Pages用に設定してるやつ)

```
npm run buildHp
```
