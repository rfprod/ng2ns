import { Injectable, Inject } from '@angular/core';

/**
 * Websocker service.
 */
@Injectable()
export class WebsocketService {

	/**
	 * @param window Window - window reference
	 */
	constructor(
		@Inject('Window') public window: Window
	) {}

	/**
	 * Retrieves host.
	 */
	private host(): string {
		return this.window.location.host;
	}

	/**
	 * Retrieves websocket protocol.
	 */
	private wsProtocol(): string {
		return (this.window.location.protocol === 'http:') ? 'ws://' : 'wss://';
	}

	/**
	 * Retrieves websocket port.
	 */
	private wsPort(): string {
		return (this.window.location.protocol === 'http:') ? '8000' : '8443';
	}

	/**
	 * Retrieves websocket url without port.
	 * @param endpoint path without host, and protocol
	 */
	private urlWithoutPort(endpoint: string): string {
		return this.wsProtocol() + this.host() + endpoint;
	}
	/**
	 * Retrieves websocket url with port.
	 * @param endpoint path without host, protocol, and port
	 */
	private urlWithPort(endpoint: string): string {
		return this.wsProtocol() + this.host() + ':' + this.wsPort() + endpoint;
	}

	/**
	 * Generates websocket url.
	 * @param endpoint path without host, protocol, and port
	 */
	public generateUrl(endpoint: string): string {
		/*
		*	TODO:client reconfigure when nginx is configured to support websockets
		*
		*	generates suitable websocket url for currelty running app
		*
		*	8000 and 8443 are ports used by OpenShift for ws and wss connections respectively
		*	sets custom port only if deployed not on localhost or on Openshift
		*	optionally use another control value for any domain and ports instead of Openshift
		*/
		return (this.window.location.origin.indexOf('localhost') !== -1 || this.host().indexOf('rhcloud') === -1) ? this.urlWithoutPort(endpoint) : this.urlWithPort(endpoint);
	}
}
