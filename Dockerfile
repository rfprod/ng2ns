# define image
FROM node:latest

# create directory structure
## create app directory
WORKDIR /app
## copy app source
COPY . .

# install apt packages for tests execution:
## chromium, xvfb
RUN apt-get -y update --fix-missing
RUN apt-get -y install --fix-missing --no-install-recommends apt-utils
RUN apt-get -y upgrade --fix-missing
RUN apt-get -y install --fix-missing chromium xvfb
## export variables for tests
ENV DISPLAY=:99
ENV CHROME_BIN=chromium
## start xvfb
RUN Xvfb :99 -screen 0 1680x1024x8 -nolisten tcp & sleep 2

# install and build
## install all local dependencies
## rebuild node-sass
## install global dependencies: gulp-cli, typescript
## build application, and create .env file for client application server
RUN npm install && \
	npm rebuild node-sass --force && \
	npm install -g gulp-cli typescript && \
	gulp compile-and-build && gulp create-env-development

# run tests
RUN gulp server & npm run server-test && npm run client-test-single-run && gulp client-e2e-test && gulp server-kill && npm run doc-docker

# uninstall npm dependencies
## uninstall dev deps, used local deps, global deps, clean cache
RUN npm prune --production && \
	npm uninstall @angular/animations @angular/cdk @angular/common @angular/compiler @angular/core \
	@angular/flex-layout @angular/forms @angular/http @angular/material @angular/material-moment-adapter \
	@angular/platform-browser @angular/platform-browser-dynamic @angular/router @types/core-js \
	@types/hammerjs @types/jasmine @types/jquery @types/node components-font-awesome core-js d3 datamaps \
	electron-squirrel-startup gulp gulp-autoprefixer gulp-concat gulp-cssnano gulp-eslint gulp-hashsum \
	gulp-mocha gulp-plumber gulp-rename gulp-replace gulp-sass gulp-systemjs-builder gulp-tslint gulp-uglify \
	gulp-util hammerjs jasmine-core jquery karma karma-redirect-preprocessor material-design-icon-fonts moment \
	ng2-nvd3 nvd3 reflect-metadata run-sequence rxjs systemjs traceur tslib tslint typescript \
	web-animations-js zone.js --no-save --only=production && \
	npm uninstall -g gulp-cli typescript --save && \
	npm cache clean --force

## remove source code, tests, and build files
RUN rm -rf ./public/app/components ./public/app/directives ./public/app/interfaces ./public/app/scss \
	./public/app/services ./public/app/translate ./test ./topoData && rm ./public/app/*.ts ./public/app/*.js \
	./public/app/*.js.map ./gulpfile.js ./main.js ./systemjs* ./*.json ./*.sh ./*.md ./Dockerfile* \
	./.dockerignore ./.editorconfig ./.eslintignore ./.gitignore

# purge previously installed packages via apt, and clean apt cache
RUN apt-get purge -y chromium xvfb apt-utils
RUN apt-get -y autoremove
RUN apt-get -y clean

# run the application
## map app port
EXPOSE 8080
## define command to run app
CMD [ "node", "server.js" ]
