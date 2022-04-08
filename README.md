# joom
zoom clone (from 노마드 코더)

## 1. 개발환경준비 및 서버 셋팅
- 윈도우로 진행했음
- N

디렉토리 생성하고 npm 개발준비 및 깃 연결
```
mkdir joom
cd mkdir
npm init -y
git init
git config user.name "jaeseong"
git config user.email "woavldsj12@gmail.com"
git add package.json
git commit -m "init"
git branch -M main
git remote add origin https://github.com/jaeseong90/joom.git
git push -u origin main
```

.gitignore 파일생성 
/node_modules 추가

nodemon 설치
```
npm i nodemon -D
```
우리 프로그램의 변경사항을 확인하여 서버를 재시작하여주는 프로그램

- babel.config.json 파일 생성
- nodemon.json 파일 생성
- src 디렉토리 생성
- src 디렉토리 server.js 파일 생성

server.js
```
console.log('hello world!!');
```

바벨 설치 
```
 npm i @babel/core @babel/cli @babel/node -D
```

nodemon.json
```
{
  "ignore": ["src/public/*"],
  "exec":"babel-node src/server.js"
}
```
서버를 재시작하는 대신에 바벨노드 시작
바벨은 소스코드를 일반 NodeJS 코드로 변환
다른 JS 수정할때 재시작 방지

babel.config.json
```
{
    "presets": ["@babel/preset-env"]
}
```

babel/preset-env 설치
```
npm i @babel/preset-env -D
```

package.json 추가
```
  "scripts": {
    "dev":"nodemon"
  },
```

실행 확인
```
>yarn dev
yarn devyarn run v1.22.4
$ nodemon
[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `babel-node src/server.js`
hello world!!
```
npm 설치
```
npm i express
```

## FrontEnd Setup
- pug 설치
```
yarn add pug
```

- /src/publicjs/app.js
```
hello
```

- /src/views/home.pug (html 하면 내용 자동완성)
```
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Joom
        link(rel="stylesheet", href="https://unpkg.com/mvp.css")
    body 
        header Joom
            h1 It works! 
        main 
            h2 
        button  call  
        script(src="/public/js/app.js") 
```

-server.js 수정
```
import express from 'express';

const app = express();

//__dirname global

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
//js, css 파일들 접근

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));
//home만 사용할테니 다 막음

const handleListen = () => console.log('Listening on http://localhost:3000');

app.listen(3000, handleListen);
```


