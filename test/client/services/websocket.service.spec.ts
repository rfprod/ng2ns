import { WebsocketService } from '../../../public/app/services/websocket.service';

describe('WebsocketService', () => {

	let service: WebsocketService;
	const Window: any = { location: { host: 'localhost', protocol: 'http:' } };

	beforeEach(() => {
		service = new WebsocketService(Window);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		/*
		*	commented variables are private
		* to be able to test presence of any component must have a public getter for each variable to be tested
		*
		*	generateUrl method works with private variables
		*	if it returns a correct result, private variables are present and have correct values
		*/
		// expect(service.host).toBeDefined();
		// expect(service.wsProtocol).toBeDefined();
		// expect(service.wsPort).toBeDefined();
		expect(service.generateUrl).toBeDefined();
	});

	it('generateUrl must return a valid websocket url according to provided parameters', () => {
		expect(service.generateUrl('/test')).toEqual('ws://localhost/test');
	});

	it('generateUrl must return a valid websocket url according to provided parameters', () => {
		Window.location.host = 'c9users';
		service = new WebsocketService(Window);
		expect(service.generateUrl('/test')).toEqual('ws://c9users/test');
	});

	it('generateUrl must return a valid websocket url according to provided parameters', () => {
		Window.location.host = 'rhcloud';
		service = new WebsocketService(Window);
		expect(service.generateUrl('/test')).toEqual('ws://rhcloud:8000/test');
	});

});
