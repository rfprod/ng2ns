import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, HostListener } from '@angular/core';

import { EventEmitterService } from '../services/event-emitter.service';

declare let d3: any;
declare let Datamap: any;

/**
 * Dashboard map component.
 */
@Component({
	selector: 'dashboard-map',
	templateUrl: '/public/app/views/dashboard-map.html',
	host: {
		class: 'mat-body-1'
	}
})
export class DashboardMapComponent implements OnInit, AfterViewInit, OnDestroy {

	/**
	 * @param el Element reference
	 * @param emitter Event emitter service - components interaction
	 */
	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService
	) {
		// console.log('this.el.nativeElement:', this.el.nativeElement);
	}

	/**
	 * Component subscriptions.
	 */
	private subscriptions: any[] = [];

	/**
	 * Map form data.
	 */
	public formData: any = {
		country: '' as string,
		regions: '' as string
	};
	/**
	 * Selected geo ids: countries, regions.
	 */
	private selectedGeoIDs: any = { // store codes (classes of selected svg paths for form -> map feedback)
		country: '' as string,
		regions: [] as string[]
	};
	/**
	 * Selects country.
	 * @param value country name
	 * @param geoID country geo id
	 */
	public selectCountry(value: string, geoID: string): void {
		console.log('select country');
		// do not reselect country if already selected
		if (this.formData.country !== value) {
			this.formData.country = value;
			this.selectedGeoIDs.country = geoID;
			// reset regions when selecting country
			this.formData.regions = '';
			this.selectedGeoIDs.regions = [];
		}
	}
	/**
	 * Selects region.
	 * @param value region name
	 * @param geoID region geo id
	 */
	public selectRegion(value: string, geoID: string): void {
		console.log('select region: value =', value, ', geoID =', geoID);
		let currentlySelectedRegions = this.formData.regions;
		if (currentlySelectedRegions.split(',').indexOf(value) === -1) {
			console.log('select region, currentlySelectedRegions', currentlySelectedRegions);
			this.selectedGeoIDs.regions.push(geoID);
			currentlySelectedRegions += (currentlySelectedRegions) ? ', ' + value : value;
			this.formData.regions = currentlySelectedRegions;
		} else {
			console.log('deselect region, currentlySelectedRegions', currentlySelectedRegions);
			this.selectedGeoIDs.regions = this.selectedGeoIDs.regions.filter((item) => item !== geoID);
			currentlySelectedRegions = currentlySelectedRegions.split(', ').filter((item) => item !== value).join(', ');
			this.formData.regions = currentlySelectedRegions;
		}
	}

	/**
	 * Map markers: factories.
	 */
	public factories: any[] = [
		{ lng: 128.1445, lat: 59.62333, name: 'factory 1', description: 'factory 1 description' },
		{ lng: 91.63147, lat: 59.46183, name: 'factory 2', description: 'factory 2 description' },
		{ lng: 76.81641, lat: 57.68066, name: 'factory 3', description: 'factory 3 description' },
		{ lng: 55.54688, lat: 59.80063, name: 'factory 4', description: 'factory 4 description' },
		{ lng: 36.73828, lat: 59.62333, name: 'factory 5', description: 'factory 5 description' }
	];
	/**
	 * Map instance.
	 */
	private map: any;
	/**
	 * Map regisons.
	 */
	public regions: any[] = ['world', 'rus'];
	/**
	 * Selected map id.
	 */
	public selectedMapId: number = 0;
	/**
	 * Returns selected map code name.
	 */
	public selectedMap(): string {
		return this.regions[this.selectedMapId];
	}
	/**
	 * Selects map.
	 */
	public selectMap(mapCode: string): void {
		const mapId = this.regions.indexOf(mapCode);
		if (mapId !== -1) {
			this.selectedMapId = mapId;
			this.drawMap();
		}
	}
	/**
	 * Shows marker tooltip.
	 */
	public showMarkerToolip(data: any) {
		/*
		*	use already existing tooltip
		*	change inner html and show on marker mouseover event
		*/
		d3.select('.hoverinfo')
			.html(`<div><p><strong> ${data.name} </strong></p><p> ${data.description} </p><p> ${data.lat} / ${data.lng} </p></div>`);
		d3.select('.datamaps-hoverover')
			.style('display', 'block');
	}
	/**
	 * Draws markers.
	 */
	public drawMarkers(datamap: any, s: number = 1): void {
		datamap.svg.selectAll('.mark').remove();
		datamap.svg.select('.datamaps-subunits').selectAll('.mark')
			.data(this.factories)
			.enter()
			.append('text')
			.attr('class', 'mark')
			.attr('font-family', 'FontAwesome')
			.attr('font-size', (d: any): string => 1 + 'em')
			.text((d: any): string => '\uf276')
			.attr('transform', (d: any): string => {
				const x = datamap.projection([d.lng, d.lat])[0];
				const y = datamap.projection([d.lng, d.lat])[1];
				return 'translate(' + x + ',' + y + ')scale(' + s + ')';
			})
			.on('mouseover', (data: any): void => {
				console.log('tooltip mouseover, data', data);
				this.showMarkerToolip(data);
			});
	}
	/**
	 * Draws map.
	 */
	public drawMap(): void {
		/*
		*	remove map if present first
		*/
		if (this.map) {
			d3.select('svg').remove();
			d3.selectAll('.datamaps-hoverover').remove();
		}
		/*
		*	datamaps docs
		*	https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
		*/
		this.map = new Datamap({
			element: document.getElementById('d3-map-container'),
			scope: this.selectedMap(),
			setProjection: (el: any) => {
				let proj;
				let scaleValue = el.offsetWidth / 2.5 / Math.PI;
				if (this.selectedMap() === 'world') {
					/*
					*	projections docs
					*	https://github.com/d3/d3-geo/blob/master/README.md#azimuthal-projections
					*/
					scaleValue = (scaleValue > 75) ? scaleValue : 75;
					proj = d3.geo.equirectangular()
						.center([10, 40])
						.rotate(0, 0)
						.scale(scaleValue)
						.translate([el.offsetWidth / 2, 95 + el.offsetHeight / 5]);
				} else {
					scaleValue = (scaleValue > 100) ? scaleValue : 100;
					proj = d3.geo.mercator()
						.center([100, 70])
						.rotate(4.4, 0)
						.scale(scaleValue)
						.translate([el.offsetWidth / 2, 95 + el.offsetHeight / 4]);
				}
				const p = d3.geo.path().projection(proj);
				return { path: p, projection: proj };
			},
			geographyConfig: {
				dataUrl: null, // if not null, datamaps fetches map json (only topojson supported)
				hideAntarctica: true,
				hideHawaiiAndAlaska: false,
				borderWidth: 0.5,
				borderOpacity: 0.5,
				borderColor: '#FDFDFD',
				popupTemplate: (geography: any, data: any): string => {
					return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
				},
				popupOnHover: true, // show popup on hover event
				highlightOnHover: false,
				highlightFillColor: '#FC8D59',
				highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
				highlightBorderWidth: 1,
				highlightBorderOpacity: 1
			},
			height: null,
			width: null,
			responsive: true,
			done: (datamap: any) => {
				/*
				*	dragging
				*/
				datamap.svg.call(d3.behavior.drag().on('drag', () => {
					// console.log('drag event', d3.event);
					d3.event.sourceEvent.preventDefault();
				})
				.on('dragstart', () => {
					// console.log('dragstart');
					d3.event.sourceEvent.preventDefault();
				})
				.on('dragend', () => {
					// console.log('dragend');
					d3.event.sourceEvent.preventDefault();
				}));
				/*
				*	zooming
				*/
				datamap.svg.call(d3.behavior.zoom().scaleExtent([1, 9]).on('zoom', () => {
					/*
					*	simple logic which allous to grag/move the map infinitely
					*	datamap.svg.selectAll('g').attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
					*/
					/*
					*	complex logic which sets bounds for dragging/moving the map
					*/
					const t = d3.event.translate;
					const s = d3.event.scale;
					const height = datamap.svg[0][0].clientHeight || datamap.svg[0][0].scrollHeight;
					const width = datamap.svg[0][0].clientWidth || datamap.svg[0][0].scrollWidth;
					const h = height / 3;
					// console.log('t, s, h:', t, s, h);
					t[0] = Math.min(
						(width / height) * (s - 1),
						Math.max(width * (1 - s), t[0])
					);
					t[1] = Math.min(
						h * (s - 1) + h * s,
						Math.max(height * (1 - s) - h * s, t[1])
					);
					datamap.svg.selectAll('g').attr('transform', 'translate(' + t + ')scale(' + s + ')');
					this.drawMarkers(datamap);
				}));

				/*
				*	initialize map regions with data from authenticated user profile
				*/
				datamap.svg.selectAll('.datamaps-subunit').forEach((items) => {
					console.log('initialize map regions selection with data from authed user profile');
					// console.log('svg paths: ', items);
					console.log('selected country', this.selectedGeoIDs.country);
					console.log('selected regions:', this.selectedGeoIDs.regions);
					items.forEach((path) => {
						// console.log('path.__data__:', path.__data__.properties.name);
						if (path.__data__.properties.name === this.selectedGeoIDs.country || this.selectedGeoIDs.regions.includes(path.__data__.properties.name)) {
							const className = path.classList[1];
							datamap.svg.selectAll('.' + className).attr('style', 'fill: rgb(151, 121, 164); stroke-width: 0.5px; stroke: rgb(253, 253, 253); fill-opacity: 1;');
							/*
							*	replace region names with respective geoID
							*/
							if (this.selectedMap() !== 'world') {
								const index = this.selectedGeoIDs.regions.indexOf(path.__data__.properties.name);
								this.selectedGeoIDs.regions[index] = className;
							}
						}
					});
					console.log('selected regions after init and replacement', this.selectedGeoIDs.regions);
				});

				/*
				*	show selected regions on the map after switching world/country view
				*	feedback from signup form to the map on map draw
				*/
				if (this.selectedMap() === 'world' && this.selectedGeoIDs.country) {
					console.log('selected country', this.selectedGeoIDs.country);
					datamap.svg.selectAll('.' + this.selectedGeoIDs.country).attr('style', 'fill: rgb(151, 121, 164); stroke-width: 0.5px; stroke: rgb(253, 253, 253); fill-opacity: 1;');
				} else if (this.selectedGeoIDs.regions.length > 0) {
					console.log('selected regions');
					for (const region of this.selectedGeoIDs.regions) {
						// console.log('region:', region);
						datamap.svg.selectAll('.' + region).attr('style', 'fill: rgb(151, 121, 164); stroke-width: 0.5px; stroke: rgb(253, 253, 253); fill-opacity: 1;');
					}
				}
				/*
				*	click events for map sections
				*/
				datamap.svg.selectAll('.datamaps-subunit').on('click', (geography: any) => {
					console.log('d3.event', d3.event);
					/*
					*	default is prevented by draggin event so that draggin does not interfere with click
					*/
					if (!d3.event.defaultPrevented) {
						console.log('geography', geography);
						console.log('geography.properties.name:', geography.properties.name);
						// reset all ap selections
						datamap.svg.selectAll('.datamaps-subunit').attr('style', 'fill: rgb(171, 221, 164); stroke-width: 0.5px; stroke: rgb(253, 253, 253); fill-opacity: 1;');
						/*
						*	update map regions highlighting and signup form inputs
						*/
						if (this.selectedMap() === 'world') {
							// select country in world mode
							this.selectCountry(geography.properties.name, geography.id);
							// set style for selected item on the world map
							datamap.svg.selectAll('.' + geography.id).attr('style', 'fill: rgb(151, 121, 164); stroke-width: 0.5px; stroke: rgb(253, 253, 253); fill-opacity: 1;');
							if (geography.properties.name === 'Russia') {
								// show detaied map for Russian Fedetation
								this.selectedMapId = 1;
								this.drawMap();
							}
						} else {
							// select region in country details mode
							this.selectRegion(geography.properties.name, geography.id);
							// set style for selected item on the world map
							for (const region of this.selectedGeoIDs.regions) {
								datamap.svg.selectAll('.' + region).attr('style', 'fill: rgb(151, 121, 164); stroke-width: 0.5px; stroke: rgb(253, 253, 253); fill-opacity: 1;');
							}
						}
					}
				}).on('mouseenter', (event: any): void => {
					/*
					*	this is needed because on mouseout datamap recreates currently hovered path
					*	and markers over it get hidden in background
					*/
					console.log('mouseenter', event);
					this.drawMarkers(datamap);
				}).on('mouseleave', (event: any): void => {
					/*
					*	this is needed because on mouseout datamap recreates currently hovered path
					*	and markers over it get hidden in background
					*/
					console.log('mouseleave', event);
					this.drawMarkers(datamap);
				});
				/*
				*	no need to set inline styling for svg element yet, but in case it's needed
				*	datamap.svg.attr('style', 'overflow: hidden; display: block; position: absolute; width: 100%; height: 50%;');
				*/
				/*
				*	factories marks on the map
				*/
				this.drawMarkers(datamap);
			}
		});
	}

	/**
	 * Window resize host listener.
	 * @param event window resize event
	 */
	@HostListener('window:resize', ['$event'])
	/**
	 * Window resize event handler.
	 */
	private onResize(event) {
		// console.log('onResize, event', event);
		/*
		*	redraw map on window resize
		*/
		this.drawMap();
	}

	/**
	 * Lifecycle hook called on component initialization.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: DashboardMapComponent initialized');
		this.emitter.emitSpinnerStartEvent();
		this.emitter.emitEvent({appInfo: 'hide'});

		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('/map consuming event:', event);
			/*
			*	TODO: event emitter listener
			*/
		});
		this.subscriptions.push(sub);

		this.emitter.emitSpinnerStopEvent();
	}
	/**
	 * Lifecycle hook called after component view is initialized.
	 */
	public ngAfterViewInit() {
		this.drawMap();
	}
	/**
	 * Lifecycle hook called on component destruction.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: DashboardMapComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
