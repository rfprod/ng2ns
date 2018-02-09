if ('serviceWorker' in navigator) {
	console.log('serviceWorker exists in navigator');
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('/service-worker.js', {
			scope: '/'
		}).then(function(registration) {
			console.log("serviceWorker registration completed, registration:", registration);
		});
	});
} else {
	console.log('serviceWorker does not exist in navigator');
}
