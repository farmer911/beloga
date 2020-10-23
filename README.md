# Belooga-react

### Introduction

### Technologies

- [ReactJS] - ReactJS Library
- [Redux] - State management library
- [Redux-Saga] - side-effect handling library for redux
- [Reselect] - Memoized Selectors for redux
- [Bootstrap 4] - CSS library
- [Stack-theme] - CSS theme
  - [Iconsmind] - icon collections
  - [Socicon] - social icon collections
- [React-Router] - routing library for react app
- [rc-form] - React High Order Form Component.

### Project Structure

```
src
├── commons
│  ├── environments [declare environment for js package]
│  │  └── rc-form-env.d.ts
│  ├── components [common componnents]
│  │  ├── search-box
│  │  ├── button
│  │  └── index.tsx
│  ├── types [contains type files]
│  │  ├── enums [enum type]
│  │  ├── base  [base type]
│  │  └── view-model [view model type]
├── ducks [file contains reducker/action creator/saga, more [info](https://github.com/erikras/ducks-modular-redux)]
│  ├── combine.tsx
│  ├── user.duck.tsx
│  ├── register.duck.tsx
│  └── home.duck.tsx
├── HOCs [Higher order components]
│  ├── with-datasource.tsx
│  └── with-decorator.tsx
├── scenes [container components which has it own route]
│  ├── app
│  ├── user
│  └── home
├── services [api, datasource, cross-cutting,.. services]
├── styles [css/scss files]
└── utils [ultilities files]
```

### Installation

Requires

- [Node.js](https://nodejs.org/).
- [Git](https://git-scm.com/download/win).

Install the dependencies and devDependencies and start the server.
Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

Configuration

- Copy .env.example to .env.local and .env and change it to match your environment

```
REACT_APP_API_BASE_URL=https://api.belooga.com/v1
REACT_APP_GOOGLE_API_CLIENT_ID=
REACT_APP_FB_API_CLIENT_ID=
REACT_APP_LINKEDIN_API_CLIENT_ID=
REACT_APP_PUBLIC_PROFILE_BASE_URL=https://www.belooga.com/public
REACT_APP_BLOG_BASE_URL=https://www.belooga.com/blog
REACT_APP_CLIENT_SECRET=
REACT_APP_REDIRECT_URI='https://www.belooga.com/login'
REACT_APP_URI='https://www.belooga.com'
REACT_APP_OPENTOK_API_KEY=
REACT_APP_OPENTOK_API_SECRET=
```

```sh
$ cd belooga-react

$ npm install

$ npm start

```

For production environments
Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

```sh
$ cd belooga-react

$ npm run build

$ npm i -g serve

$ serve -s build

```

An example of nginx configure file

```
server {
    listen 80;

    server_name www.belooga.com;
    root /var/www/html/belooga/build;

    expires           0;
    add_header        Cache-Control private;
    sendfile  off;

    index index.html index.htm;
    client_max_body_size 200M;

    # try_files $uri $uri/ index.html;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-FORWARDED_PROTO $scheme;
        proxy_set_header Host $http_host;
        proxy_redirect off;

        proxy_pass http://localhost:3002;
    }

    location ~* (\.js|css|png|gif|jpg|mp4|otf|woff|woff2|json|map|svg)$ {
        try_files $uri $uri/ =404;
    }
}
```

### Start Node JS app

Update .env to match your env.

```bash
$ cd /var/www/html/belooga/
$ sudo npm i -g pm2
$ pm2 start ecosystem.config.js
```

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

### Development

## License

MIT

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[reactjs]: https://reactjs.org/
[redux]: https://redux.js.org/
[redux-saga]: https://redux-saga.js.org/
[reselect]: https://github.com/reduxjs/reselect
[bootstrap 4]: https://getbootstrap.com/docs/4.1/getting-started/introduction/
[stack-theme]: https://stackthemes.net/
[react-router]: https://github.com/ReactTraining/react-router
[iconsmind]: http://stack.tommusdemos.wpengine.com/pages/icons-cheatsheet/
[socicon]: http://www.socicon.com/chart.php
[rc-form]: https://github.com/react-component/form
