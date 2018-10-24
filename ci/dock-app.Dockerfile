# define image
FROM node:slim as builder

# create directory structure
## create app directory
WORKDIR /app
## copy app source
COPY . .

## export variables for tests
ENV DISPLAY=:99 CHROME_BIN=chromium

# install, build, and clean
#
## install apt packages for tests execution:
### chromium, xvfb
#
## start xvfb
#
## install and build
### install all local dependencies
### rebuild node-sass
### install global dependencies: gulp-cli, typescript
### build application, and create .env file for client application server
#
## run tests
#
## uninstall npm dependencies
### uninstall dev deps, used local deps, global deps, clean cache
#
## remove source code, tests, and build files
#
## dont purge previously installed packages (via apt, and clean apt cache), go multistage instead, see below
RUN apt-get -y update --fix-missing; \
	apt-get -y install --fix-missing --no-install-recommends apt-utils; \
	apt-get -y upgrade --fix-missing && apt-get -y install --fix-missing chromium xvfb; \
	sleep 1; \
	Xvfb :99 -screen 0 1680x1024x8 -nolisten tcp & sleep 2; \
	sleep 1; \
	npm install -g gulp-cli typescript; \
	npm update --no-optional; \
	npm rebuild node-sass --force; \
	npm install --no-optional; \
	gulp compile-and-build && gulp create-env-development; \
	sleep 1; \
	gulp server & npm run server-test && npm run client-test && gulp client-e2e-test && gulp server-kill && npm run doc-docker; \
	sleep 1; \
	npm prune --production --no-optional && \
	npm uninstall @angular/animations @angular/cdk @angular/common @angular/compiler @angular/core \
	@angular/flex-layout @angular/forms @angular/http @angular/material @angular/material-moment-adapter \
	@angular/platform-browser @angular/platform-browser-dynamic @angular/router @types/core-js \
	@types/hammerjs @types/jasmine @types/node components-font-awesome core-js d3 datamaps \
	electron-squirrel-startup gulp gulp-autoprefixer gulp-concat gulp-cssnano gulp-eslint gulp-hashsum \
	gulp-mocha gulp-plumber gulp-rename gulp-replace gulp-sass gulp-systemjs-builder gulp-tslint gulp-uglify \
	gulp-util hammerjs jasmine-core karma karma-redirect-preprocessor material-design-icon-fonts moment \
	reflect-metadata run-sequence rxjs systemjs traceur tslib tslint typescript \
	zone.js --no-save --production --no-optional && \
	npm uninstall -g gulp-cli typescript --save && \
	npm cache clean --force; \
	sleep 1; \
	rm -rf ./public/app/components ./public/app/directives ./public/app/interfaces ./public/app/modules \
	./public/app/pipes ./public/app/services ./public/app/translate ./public/app/scss \
	./test/client ./test/e2e ./build-system ./topoData && \
	find ./public/app/modules -type f -name "*.ts" -exec rm {} + && \
	find ./public/app/modules -type f -name "*.scss" -exec rm {} + && \
	find ./public/app -type f -name "*.ts" -exec rm {} + && \
	find ./public/app -type f -name "*.js" -exec rm {} + && \
	find ./public/app -type f -name "*.scss" -exec rm {} + && \
	find ./test -type f -name "*.js" -exec rm {} + && \
	find ./* -not -path "./node_modules/*" -not -path "./logs/*" -type f -name "*.md" -exec rm {} + && \
	find ./* -not -path "./node_modules/*" -not -path "./logs/*" -type f -name "*.sh" -exec rm {} + && \
	find ./* -not -path "./node_modules/*" -not -path "./logs/*" -type f -name "*.Dockerfile" -exec rm {} + && \
	find ./* -not -path "./node_modules/*" -not -path "./logs/*" -type f -name "systemjs*" -exec rm {} + && \
	find ./* -not -path "./node_modules/*" -not -path "./logs/*" -type f -name "*.json" -exec rm {} + && \
	rm ./public/electron.preload.js ./main.js ./gulpfile.js \
	./.dockerignore ./.editorconfig ./.eslintignore ./.gitignore

# MULTISTAGE, use build from the previous stage, don't build anything, just copy and start, use lighter image

# define image
FROM node:alpine
# create directory structure
#
## Create app directory.
WORKDIR /app
## Copy app source.
COPY --from=builder /app .

# run the application
#
## Map app port to docker.
EXPOSE 8080
## Define command to run app.
CMD [ "node", "server.js" ]
