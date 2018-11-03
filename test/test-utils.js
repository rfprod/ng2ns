/**
 * @const
 * File system module.
 */
const fs = require('fs');

/**
 * @function isDocker
 * Detects Docker environment, checks if .dockerenv is present.
 */
function isDocker() {
	try {
		fs.statSync('/.dockerenv');
		console.log('DOCKER environment detected');
		return true;
	} catch(e) {
		return false;
	}
}

/** load .env file */
require('dotenv').load();

/**
 * @function isCI
 * Detects CI environment, checks if respective environment variable is present.
 * This env variable should be set in CI environment.
 */
function isCI() {
	return process.env.CI === 'true';
}

/**
 * @function setJasmineDefaultInterval
 * Sets jasmine.DEFAULT_TIMEOUT_INTERVAL.
 * Accepts value in milliseconds, value should be greater than current (default) value
 */
function setJasmineDefaultInterval(value) {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = (typeof value === 'number' && isFinite(value) && value > jasmine.DEFAULT_TIMEOUT_INTERVAL) ? value : jasmine.DEFAULT_TIMEOUT_INTERVAL;
	console.log('set jasmine.DEFAULT_TIMEOUT_INTERVAL', jasmine.DEFAULT_TIMEOUT_INTERVAL);
}

/**
 * @function karmaBrowserTimeoutValue
 * Returns karma browser timeout interval for different environments.
 */
function karmaBrowserTimeoutValue() {
	return isDocker() || isCI() ? 8000000 : 200000;
}

/**
 * @function headlessChromeFlags
 * Headless Chrome flags config.
 */
function headlessChromeFlags() {
	const flags = [
		'--headless',
		'--disable-gpu',
		'--window-size=1680x1024',
		// Without a remote debugging port Chrome exits immediately
		'--remote-debugging-port=9222'
	];
	if (isDocker()) {
		flags.push('--no-sandbox'); // required by Docker
	}
	return flags;
};

module.exports = {
	isDocker: isDocker,
	isCI: isCI,
	setJasmineDefaultInterval: setJasmineDefaultInterval,
	headlessChromeFlags: headlessChromeFlags,
	karmaBrowserTimeoutValue: karmaBrowserTimeoutValue
};
