# Ng2NodeStarter (Ng2NS)

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

# Start

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

Create a file named `.env` in the root directory. This file should contain:

```
PORT=8080
APP_URL=http://localhost:8080/
```

#### Openshift deployment requires env variables setup via rhc

for example

`rhc env set -a ng2ns -e APP_URL=https://Ng2NS-ecapseman.rhcloud.com/`

required vars

```
APP_URL=application-url
```

### Starting the App

To start the app, execute in the terminal while in the project folder (dependencies installation check will be performed before)

```
npm start
```

Now open your browser and type in the address bar

```
http://localhost:8080/
```

Ng2NS is up and running.

### Testing

#### Server

To test the server execute the following command in the terminal window while in your project's folder when the server is running:

```
$ npm run server-test
```

#### Client Unit

`HeadlessChrome`: in initial configuration for client unit tests to work you will have to export an environment variable for headless Chrome by appending it to `~/.bashrc`, its value should be set to one of the following options, depending on what you have installed: `chromium-browser, chromium, google-chrome`

```
export CHROME_BIN=chromium-browser
```

To test the client execute the following command in the terminal window while in your project's folder:

for continuous testing

```
$ npm run client-test
```

for single test

```
$ npm run client-test-single-run
```

#### Client E2E

```
$ npm run protractor
```

#### Code Linting

To lint the code execute the following command in the terminal window while in your project's folder:

```
$ npm run lint
```

### The OpenShift cartridges documentation

* [`cartridge guide`](https://github.com/openshift/origin-server/blob/master/documentation/oo_cartridge_guide.adoc#openshift-origin-cartridge-guide)
* [`cartridge guide: nodejs`](https://github.com/openshift/origin-server/blob/master/documentation/oo_cartridge_guide.adoc#11-nodejs)

## Licenses

* [`Ng2NS`](LICENSE.md)
