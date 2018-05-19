import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';
import { ServerStaticDataService } from '../services/server-static-data.service';
import { PublicDataService } from '../services/public-data.service';
import { WebsocketService } from '../services/websocket.service';

declare let d3: any;

@Component({
	selector: 'dashboard-intro',
	templateUrl: '/public/app/views/dashboard-intro.html',
	host: {
		class: 'mat-body-1'
	}
})
export class DashboardIntroComponent implements OnInit, OnDestroy {

	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private websocket: WebsocketService,
		private serverStaticDataService: ServerStaticDataService,
		private publicDataService: PublicDataService
	) {
		// console.log('this.el.nativeElement:', this.el.nativeElement);
	}

	private subscriptions: any[] = [];

	public title: string = 'Ng2NodeStarter (Ng2NS)';
	public description: string = 'Angular, NodeJS';

	public chartOptions: { chart } = {
		chart: {
			type: 'pieChart',
			height: 450,
			donut: true,
			x: (d) => d.key,
			y: (d) => d.y,
			showLabels: true,
			labelSunbeamLayout: false,
			pie: {
				startAngle: (d) => d.startAngle / 2 - Math.PI / 2,
				endAngle: (d) => d.endAngle / 2 - Math.PI / 2,
			},
			duration: 1000,
			title: 'user sessions',
			legend: {
				margin: {
					top: 5,
					right: 5,
					bottom: 5,
					left: 5,
				},
			},
		},
	};
	public appUsageData: any[] = [
		{
			key: 'Default',
			y: 1,
		},
		{
			key: 'Default',
			y: 1,
		},
		{
			key: 'Default',
			y: 1,
		},
		{
			key: 'Default',
			y: 1,
		},
		{
			key: 'Default',
			y: 1,
		}
	];
	public serverData: { static, dynamic } = {
		static: [] as any[],
		dynamic: [] as any[],
	};

	private wsEndpoint: string = '/api/app-diag/dynamic';
	private ws: WebSocket = new WebSocket(this.websocket.generateUrl(this.wsEndpoint));

	private getServerStaticData(): Promise<void> {
		const def = new CustomDeferredService<void>();
		this.serverStaticDataService.getData().subscribe(
			(data: any[]) => {
				this.serverData.static = data;
				def.resolve();
			},
			(error: any) => null, // service catches error
			() => {
				console.log('getServerStaticData done');
			}
		);
		return def.promise;
	}
	private getPublicData(): Promise<void> {
		const def = new CustomDeferredService<void>();
		this.publicDataService.getData().subscribe(
			(data: any[]) => {
				this.nvd3.clearElement();
				this.appUsageData = data;
				def.resolve();
			},
			(error: any) => null, // service catches error
			() => {
				console.log('getPublicData done');
			}
		);
		return def.promise;
	}

	public showModal: boolean = false;
	public toggleModal(): void {
		if (this.showModal) {
			this.ws.send(JSON.stringify({action: 'pause'}));
		} else { this.ws.send(JSON.stringify({action: 'get'})); }
		this.showModal = (!this.showModal) ? true : false;
	}

	@ViewChild ('chart') private nvd3: any;

	public ngOnInit(): void {
		console.log('ngOnInit: DashboardIntroComponent initialized');
		this.emitter.emitSpinnerStartEvent();
		this.emitter.emitEvent({appInfo: 'show'});

		this.ws.onopen = (evt: any): void => {
			console.log('websocket opened:', evt);
			/*
			*	ws connection is established, but data is requested
			*	only when this.showModal switches to true, i.e.
			*	app diagnostics modal is visible to a user
			*/
			// this.ws.send(JSON.stringify({action: 'get'}));
		};
		this.ws.onmessage = (message: any): void => {
			console.log('websocket incoming message:', message);
			this.serverData.dynamic = [];
			const data: any = JSON.parse(message.data);
			for (const d in data) {
				if (data[d]) { this.serverData.dynamic.push(data[d]); }
			}
			console.log('this.serverData.dynamic:', this.serverData.dynamic);
		};
		this.ws.onerror = (evt: any): void => {
			console.log('websocket error:', evt);
			this.ws.close();
		};
		this.ws.onclose = (evt: any): void => {
			console.log('websocket closed:', evt);
		};

		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('/intro consuming event:', event);
			if (event.websocket === 'close') {
				console.log('closing webcosket');
				this.ws.close();
			}
		});
		this.subscriptions.push(sub);

		this.getPublicData()
			.then(() => this.getServerStaticData())
			.then(() => {
				this.emitter.emitSpinnerStopEvent();
			})
			.catch((error: any) => console.log('dashboard intro init requests error'));

	}
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: DashboardIntroComponent destroyed');
		this.ws.close();
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
