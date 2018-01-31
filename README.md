# Ng2NodeStarter (Ng2NS)

![build](https://travis-ci.org/rfprod/ng2ns.svg?branch=master)

## Overview

Ng2NodeStarter - application core based on NodeJS and Angular.

### Project structure

* `./app` - server
  * `./app/config` - configurations
  * `./app/models` - data models
  * `./app/routes` - routes
  * `./app/utils` - utilities
* `./public` - client
  * `./public/app` - main module and routes
    * `./public/app/components` - components' scripts (development)
    * `./public/app/interfaces` - interfaces' scripts (development)
    * `./public/app/scss` - stylesheets (development)
    * `./public/app/services` - services' scripts (development)
    * `./public/app/views` - components' templates
  * `./public/css/` - bundled styles (production)
  * `./public/img/` - images
  * `./public/js/` - bundled scripts (production)
* `./test` - client/server tests
  * `./test/client` - client tests
  * `./test/e2e` - end to end tests
  * `./test/server` - server tests
* `./sessions` - FileStore sessions storage
* `./logs` - logs and reports
* `./desktop` - electron builds and installers
  * `./desktop/nix`
    * `./desktop/nix/build` - linux build
    * `./desktop/nix/dist` - linux installer
  * `./desktop/win`
    * `./desktop/win/build` - windows build
    * `./desktop/win/dist` - windows installer
  * `./desktop/osx`
    * `./desktop/osx/build` - osx build
    * `./desktop/osx/dist` - osx installer
* `.topoData` - topological data for maps in `json` format

### Requirements

In order to run your own copy of Ng2NS, you must have the following installed:

- [`Node.js`](https://nodejs.org/)
- [`NPM`](https://nodejs.org/)
- [`Git`](https://git-scm.com/)

### Installation & Startup

To install Ng2NS execute the below command in the terminal window while in your projects folder:

```
git clone https://github.com/rfprod/Ng2NS.git
```

This will install the Ng2NS components into the `Ng2NS` directory in your projects folder.

### Local Environment Variables

Create a file named `.env` in the root directory manually or use a gulp task

```
gulp create-env-development
```

or

```
gulp create-env-development-cluster
```

or

```
gulp create-env-electron
```

or

```
gulp create-env-production
```

This `.env` file should contain

for development environment without nodejs cluster

```
PORT=8080
APP_URL=http://localhost:8080/
APP_VERSION=1.0.0
DEV_MODE=true
```

for development environment with nodejs cluster

```
PORT=8080
APP_URL=http://localhost:8080/
APP_VERSION=1.0.0
DEV_MODE=false
```

for electron environment

```
PORT=8080
APP_URL=http://localhost:8080/
APP_VERSION=1.0.0
ELECTRON=true
NODE_ENV=production
```

for production environment

```
PORT=8080
APP_URL=http://app-url
APP_VERSION=1.0.0
NODE_ENV=production
```

`PORT` is used by the server if defined.

`APP_URL` may be used by the server if it should form urls to client app and return it to user.

`DEV_MODE` is a variable which defines if coverage report should be served to user upon requesting path `host/logs/coverage/html-report/index.html`, for local environment the url path is it is `http://localhost:8080/logs/coverage/html-report/index.html`. If coverage report should `NOT` be served, don't set this variable at all or remove part `=true`, server does not check its value, only presence.

`ELECTRON` tells server to use control flow specific for electron where applicable.

`NODE_ENV` tells `npm` to pass installing devDependencies.

`IP` define this value to use specific IP address for nodejs server like

```
...
IP=127.0.0.1
...
```

### Electron

#### Prerequisites

development environment may need to use a NodeJS version compatible which Electron, which is `7.9.0` by the moment of writing this note, NodeJS versions switching may require node-sass rebuild

```
sudo npm rebuild node-sass --force
```

dependencies must be installed

```
npm install
```

application must be build and packed for required platform

```
tsc && gulp build && gulp electron-packager-win
```

```
tsc && gulp build && gulp electron-packager-nix
```

to create installers for windows or debian after packaging use

```
tsc && gulp build && gulp build-electron-win
```

```
tsc && gulp build && gulp build-electron-deb
```

#### Electron build

Electron app builds are created by gulp tasks and are stored in

* `./desktop`
  * `./desktop/nix`
    * `./desktop/nix/build` - linux build (task - `gulp electron-packager-nix`)
    * `./desktop/nix/dist` - linux installer (task - `gulp TODO`)
  * `./desktop/win`
    * `./desktop/win/build` - windows build (task - `gulp electron-packager-win`)
    * `./desktop/win/dist` - windows installer (task - `gulp electron-winstaller`)
  * `./desktop/osx`
    * `./desktop/osx/build` - osx build (task - `gulp TODO`)
    * `./desktop/osx/dist` - osx installer (task - `gulp TODO`)

#### Electron start

to start Electron app execute the following command form the project root

```
npm run electron
```

#### Docker

##### build

```
sudo docker build -t repo-name/ng2ns -f ./Dockerfile .
```

##### start

```
sudo docker run -d --rm --name ng2ns -p 8080:8080 repo-name/ng2ns:latest
```

##### stop

```
sudo docker stop ng2ns
```

#### remove

search by id

```
sudo docker image ls
```

then execute

```
sudo docker image rm IMAGE_ID
```

### Starting the App

To start the app, execute in the terminal while in the project folder (dependencies installation check will be performed before)

```
npm start
```

executing this command will:

* install the required project dependencies
* build both `js` and `css` bundles
* copy required fonts to a defined location to make it accessible by the app
* make required changes to static json files if any
* start the app

to build the app manually, typescript should be compiled first, then the app can be built, execute:

```
tsc && gulp build
```

Now open your browser and type in the address bar

```
http://localhost:8080/
```

Ng2NS is up and running.

### Testing

`HeadlessChrome` note: in initial configuration for client unit and e2e tests to work you will have to export an environment variable for headless Chrome by appending it to `~/.bashrc`, its value should be set to one of the following options, depending on what you have installed: `chromium-browser, chromium, google-chrome`

```
export CHROME_BIN=chromium-browser
```

#### Server

To test the server execute the following command in the terminal window while in your project's folder when the server is running:

```
$ npm run server-test
```

#### Client Unit

To test the client execute the following command in the terminal window while in your project's folder:

for continuous testing

```
$ npm run client-test
```

for single test

```
$ npm run client-test-single-run
```

single run execution generates a coverage html-report from generated json data, reports location

  * `./logs`
    * `./logs/coverage` - json data
      * `./logs/coverage/html-report` - html-report generated from json data

#### Coverage report

to generate a coverage report for client code execute (should be preceeded by unit tests execution so that json data exists)

```
npm run client-coverage-report
```

previously generated coverage reports are cleared automatically before single run tests execution

to remove previously generated coverage reports manually use

```
npm run clear-reports
```

##### How to read a coverage report

* `Statements` - how much statements of the program module have beed executed
* `Branches` - how much branches of the control flow of the program module have been executed (if else statements)
* `Functions` - how much functions of the program module have beed executed
* `Lines` - how much executable lines in the source code have been executed

for more details see [`istanbul code coverage tool`](https://gotwarlost.github.io/istanbul)

#### Client E2E

```
$ npm run protractor
```

#### Code Linting

To lint the code execute the following command in the terminal window while in your project's folder:

```
$ npm run lint
```

#### NPM scripts and Gulp tasks

most command needed for manual interaction with the project were listed above, full lists can be checked here:

* NPM scripts: [`package.json`](package.json) - `scripts` object
* Gulp tasks: [`gulpfile.js`](gulpfile.js)

### Docker documentation

* [`Docker documentation`](https://docs.docker.com)
* [`Docker documentation: Engine command-line reference`](https://docs.docker.com/engine/reference/commandline/docker/)
* [`Docker documentation: Configure and use Docker`](https://docs.docker.com/engine/reference/commandline/docker/)

## Licenses

* [`Ng2NS`](LICENSE.md)
