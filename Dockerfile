# define image
FROM node:latest

# create directory structure
## create app directory
WORKDIR /app
## copy app source
COPY . .

# install global dependencies
## firstly, install gulp and typescript globally to use it from command line
## local installation will be present after `npm install` execution
RUN npm install -g gulp-cli typescript

# install local dependencies
## package.json and package-lock.json for npm@5+ should be also in the app directory
## install dependencies ignoring package's devDependencies
RUN npm install --only=production

# build app
## run gulp build task
RUN gulp compile-and-build
## npm 5.2+ introduces npx - local package runner, which should not require global gulp installation before running a task
### npx gulp build

# create .env file to set environment variables
## to set NODE_ENV=production and as a result ignore installation of project's devDepencencies
## when executing 'npm install', use command: RUN gulp create-env-production
##
## if task 'gulp create-env-production' is used for .env file generation,
## /logs path will not be served by the client app server and it should be removed from the build
## by including path './logs' below, search this text in the file: "# remove source code, tests, and build files"
RUN gulp create-env-development

#
# documentation and test reports (/logs path) should be pregenerated to be included in the container at this point
#

# uninstall unnecessary depencencies used to build the app
## uninstall local dependencies
RUN npm uninstall @angular/animations @angular/cdk @angular/common @angular/compiler \
	@angular/core @angular/flex-layout @angular/forms @angular/http @angular/material \
	@angular/platform-browser @angular/platform-browser-dynamic @angular/router \
	@types/core-js @types/jasmine @types/jquery @types/node components-font-awesome \
	concurrently core-js d3 datamaps electron-squirrel-startup gulp gulp-autoprefixer \
	gulp-concat gulp-cssnano gulp-eslint gulp-hashsum gulp-mocha gulp-plumber gulp-rename \
	gulp-replace gulp-sass gulp-systemjs-builder gulp-tslint gulp-uglify gulp-util hammerjs \
	jasmine-core jquery karma karma-redirect-preprocessor material-design-icon-fonts moment \
	ng2-nvd3 nvd3 reflect-metadata run-sequence rxjs systemjs traceur tslib tslint typescript \
	web-animations-js zone.js --no-save --only=production
## uninstall global dependencies
RUN npm uninstall -g gulp-cli typescript --save
## clean npm cache
RUN npm cache clean --force
## remove source code, tests, and build files
RUN rm -rf ./public/app/components ./public/app/directives ./public/app/interfaces ./public/app/scss \
	./public/app/services ./public/app/translate ./test ./topoData && rm ./public/app/*.ts ./*.sh ./*.md \
	./gulpfile.js ./main.js ./systemjs* ./*.json ./Dockerfile*

# run the application
## map app port to docker
EXPOSE 8080
## define command to run app
CMD [ "node", "server.js" ]
