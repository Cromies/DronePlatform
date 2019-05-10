import { Component, OnInit, AfterViewInit, ViewChild }    from '@angular/core';
import { FormsModule }          from '@angular/forms';
import { Http, RequestOptions, Headers }        from '@angular/http';
import { Observable}           from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import { AgmCoreModule, AgmMap }        from '@agm/core';
import { MapsAPILoader }          from '@agm/core';
import { GoogleMapsAPIWrapper, LatLngBounds, LatLngBoundsLiteral } from '@agm/core';
import {DatePipe } from '@angular/common';
import {EventSourcePolyfill} from 'ng-event-source';

declare var google: any;
import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/animations';

import { DetectionService }     from './detection.service';



@Component({
	selector: 'detection',
	templateUrl: './detection.html',
	styleUrls: [
			'../assets/css/sidebar.css',
			'../assets/css/bootstrap.min.css',
			'../assets/css/font-awesome.min.css',
			'../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-regular.css',
			'../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-solid.css',
			'../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-brands.css'
],
	animations: [
			trigger('flash', [
					state('white', style({
							backgroundColor: '#FFFFFF',
							color: '#D53B3C'
					})),
					state('red', style({
							backgroundColor:'#D53B3C',
							color: '#FFF'
					})),
					state('orange', style({
							backgroundColor:'#EE6D0B',
							color: '#FFF'
					})),
					state('green', style({
							backgroundColor:'#45A567',
							color: '#FFF'
					})),
					transition('red <=> white', animate('2s ease-in-out'))
			])
	]
})
export class DetectionComponent implements OnInit, AfterViewInit{
		dropConfirmed = true;
		dropThreat = true;
		dropSensor = true;

		public state: string;
		public SENSORS: any = [];
		public THREATS: any = [];
		public POTENTIAL: any = [];
		public status = {
				Color: '#000',
				Message: 'Loading....'
		}
		public timer: any;
		public tracker: any;

		public markerColor = '';
		public location: any;
		public lat: number = 35.448735;
		public lon: number = -77.607615;
		public paths: any = [];
		public hardPause: boolean = false;
		public tally: number = 0;
		public sensors: any = [];
		public markers: any;
		public drones: any = [];
		public detecting: boolean = true;
		public bounds: any;
		public alert: boolean = true;
		public threats: number = 0;

		public droneIcon: any = {
				controller: '../assets/img/threat-controller.png',
				drone: '../assets/img/threat-drone.png',
				unknown: '../assets/img/threat-unknown.png'
		}
		public newStartIcon: any = {
				Gold: {
						color: '#FFC000',
						icon: '../assets/img/1-start.png'
				},
				Yellow: {
						color: '#E7FA45',
						icon: '../assets/img/2-start.png'
				},
				Green: {
						color: '#0DF704',
						icon: '../assets/img/3-start.png'
				},
				Mint: {
						color: '#24F9A2',
						icon: '../assets/img/4-start.png'
				},
				Aquamarine: {
						color: '#19FCF9',
						icon: '../assets/img/5-start.png'
				},
				Blue: {
						color: '#3FD2FF',
						icon: '../assets/img/6-start.png'
				}
		}
		public statusIcon: any = {
				Online: '../assets/img/sensor-online.png',
				Offline: '../assets/img/sensor-issue.png',
				Error: '../assets/img/sensor-error.png',
				reference: '../assets/img/reference.png'
		}
		private alarm_path: string = '../assets/util/Alarm.wav';

		constructor(private date: DatePipe, private http: Http, private detection: DetectionService, private _loader: MapsAPILoader, private _gmap: GoogleMapsAPIWrapper ){
		}


		ngOnInit(): void {
				this.detection.getCenter().subscribe((data) => {
						console.log(data);
						let coords = data[0].LOCATION.split(',');
						this.lat = parseFloat(coords[0]);
						this.lon = parseFloat(coords[1]);

						console.log('location: '+this.lat+' - '+this.lon);
				})

		}
		@ViewChild(AgmMap) agmMap;

		ngAfterViewInit(): void {
				this.agmMap.mapReady.subscribe(map => {
						console.log('native map', map);

						// let coords: any = new google.maps.LatLng(this.lat, this.lon);
						// let bounds: LatLngBounds = new google.maps.LatLngBounds(coords);
						// this.bounds = bounds;
						this.getReferences(map);
						this.getPoints();
						this.startTimer(map);
						this.startTracker(map);
						var headers = new Headers();
						headers.append('Authorization', 'my-auth-token');

						// let eventSource = new EventSourcePolyfill('Https://localhost:3000/detect', { headers: headers });
						// eventSource.onmessage = (data => {
						//     console.log(data);
						// });
						// eventSource.onopen = (a) => {
						//     // Do stuff here
						// };
						// eventSource.onerror = (e) => {
						//     // Do stuff here
						//     console.log(e)
						// }

				})
		}

		public getPoints(): void {
				this.detection.getPoints().subscribe(
						data => {
						this.mkSquares(data)
						// console.log(data);
						// console.log(this.mkSquares(data))
						// this.points = this.mkSquares(data);
				}, err => {
				})

		}
		public getReferences(map): void {
				this.detection.getReferences().subscribe((data) => {
						console.log(data);
						let points = [];
						data.forEach((point) => {
								let coords = point.LOCATION.split(',');
								coords = new google.maps.LatLng(coords[0], coords[1]);
								let marker = new google.maps.Marker({
										map: map,
										icon: this.statusIcon.reference,
										position: coords,
										zIndex: 0

								});
								console.log(point);

								let infoWindow = new google.maps.InfoWindow({
										content: '<strong>'+point.REFERENCE_NAME+'<strong>'
								})

								marker.addListener('mouseover', () => infoWindow.open(map, marker));
								marker.addListener('mouseout', () => infoWindow.close());
								points.push(marker);
						})
				})
		}
		public startTimer(map): void {
				let timer = Observable.timer(300, 1000);
				this.timer = timer.subscribe(() => {
						this.detection.getData().subscribe(data => {
								this.THREATS = data[0];
								this.POTENTIAL = data[1];
								this.SENSORS = data[2];
								console.log(data);
								let threats = this.THREATS.length;
								if( threats > 0) {
										this.alarm(threats);
								}

								this.setStatusBar();
								if(this.sensors.length > 0){
									this.sensors.forEach((sensor) => sensor.setMap(null));
									// this.sensors = [];
								}
								for(let sensor in this.SENSORS){
										let status = this.setStatus(this.SENSORS[sensor].STATUS);
										this.SENSORS[sensor].codex = status;
										let sensor_keys = Object.keys(this.sensors);
										console.log("sensor keys", sensor_keys);
										if(!sensor_keys.includes(this.SENSORS[sensor].NAME)){
											console.log('I should only show up for the drones that dont exist')
											if(this.SENSORS[sensor].LOCATION !== null){
													let coords = this.SENSORS[sensor].LOCATION.split(',');
													let sensor_mark;
													coords = new google.maps.LatLng(coords[0], coords[1]);

													switch(this.SENSORS[sensor].codex.code){

															case 'Online':
																	sensor_mark = new google.maps.Marker({
																			map: map,
																			icon: this.statusIcon.Online,
																			position: coords,
																			zIndex:99
																	});
																	break;
															case 'Error':
																	sensor_mark = new google.maps.Marker({
																			map: map,
																			icon: this.statusIcon.Error,
																			position: coords,
																			zIndex:99

																	});
																	break;
															default:
																	sensor_mark = new google.maps.Marker({
																			map: map,
																			icon: this.statusIcon.Offline,
																			position: coords,
																			zIndex:99

																	});
																	break;
													}
													let infoWindow = new google.maps.InfoWindow({
															content: '<strong>'+this.SENSORS[sensor].NAME+'<strong>'
													})

													sensor_mark.addListener('mouseover', () => infoWindow.open(map, sensor_mark));
													sensor_mark.addListener('mouseout', () => infoWindow.close());
													this.sensors[this.SENSORS[sensor].NAME] = sensor_mark;



												}

											}  else {
												console.log(this.SENSORS[sensor].codex.code);
												switch(this.SENSORS[sensor].codex.code){
														case 'Online':
																this.sensors[this.SENSORS[sensor].NAME].setIcon(this.statusIcon.Online)
																break;
														case 'Error':
																this.sensors[this.SENSORS[sensor].NAME].setIcon(this.statusIcon.Error)
																break;
														default:
																this.sensors[this.SENSORS[sensor].NAME].setIcon(this.statusIcon.Offline)
																break;
												}

										}

								}
								// this.SENSORS.forEach( (sensor) => {
								//     let status = this.setStatus(sensor.STAT)
								// })
						})
		})
		}
		public alarm(threats: number): void {
				if(this.threats == threats){
						return
				} else {

						let audio = new Audio();
						audio.src = this.alarm_path;
						audio.load();
						audio.play();

						// let interval = setInterval(() => {
						//
						//
						//     // audio.play();
						//     let x = 0;
						//     if(++x === 3){
						//         clearInterval(interval);
						//     }
						// }, 1000);
						// audio.pause();
						this.threats = threats;

				}
		}
		public startTracker(map): void {
				let tracker = Observable.timer(300, 1000);
				// starting tracker
				this.tracker = tracker.subscribe(() => {
						let countdown = this.tally * 20;
						// gathering drone id's
						this.detection.getDrone().subscribe(data => {
								let devices = data.map((device) => device.DEVICE_ID);
								let droneKeys = Object.keys(this.drones);
								if(droneKeys.length > devices.length){
										droneKeys.forEach((key) => {
												if(!devices.includes(key)){
																console.log(key);
																console.log(this.drones);
																console.log(this.drones[key]);
																this.drones[key].marker.setMap(null);
																if(this.drones[key].initial !== undefined){
																		this.drones[key].initial.setMap(null);
																}
																this.drones[key].lines.forEach((line) => {
																		line.setMap(null);
																})
																delete this.drones[key];
																//this.drones = this.drones.filter((drone) =>  drone === this.drones[key]);
																console.log(this.drones);
												}
										})
								}


								console.log(data);

								devices.forEach((device, index, array) => {
										let iconKeys = Object.keys(this.newStartIcon);
										let newIndex = 0;
										if(index >= iconKeys.length){
												if(newIndex == iconKeys.length){
														newIndex = 0;
												} else {
														newIndex++;
												}
										} else {
												newIndex = index;
										}
										let droneKeys = Object.keys(this.drones);
										if(!droneKeys.includes(device)){
												this.detection.getTrackPoints(device).subscribe((data) => {
													if(data.length > 0){
														this.detection.getStartPoint(device).subscribe((startPoint) => {


															let initialPoint = startPoint[0];
															let startCoords = new google.maps.LatLng(initialPoint.LAT, initialPoint.LON);

															let schemeID    = iconKeys[newIndex];

															let stroke      = this.newStartIcon[schemeID].color;
															let icon        = this.newStartIcon[schemeID].icon;
															let id = device.split('_');


															let cluster;
															let initial;

															switch(id[0]){
																	case 'Unknown':
																			cluster = new google.maps.Marker({
																					map: map,
																					icon: this.droneIcon.unknown,
																					zIndex: 9999
																			});
																			initial = new google.maps.Marker({
																					map: map,
																					icon: icon,
																					zIndex: 1,
																					position: startCoords
																			});
																			break;
																	case 'Drone':
																	case 'Video':
																			let image = {
																					url: this.droneIcon.drone,
																					anchor: new google.maps.Point(20, 20),
																					origin: new google.maps.Point(0, 0)
																			}
																			cluster = new google.maps.Marker({
																					map: map,
																					icon: image,
																					zIndex: 9999

																			});
																			initial = new google.maps.Marker({
																					map: map,
																					icon: icon,
																					zIndex: 1,
																					position: startCoords
																			});

																			break;
																	default:
																			cluster = new google.maps.Marker({
																					map: map,
																					icon: this.droneIcon.controller,
																					zIndex: 9999


																			});
																			break;
															}
															let infoWindow = new google.maps.InfoWindow({
																	content: '<strong>'+device+'<strong>'
															})

															cluster.addListener('mouseover', () => infoWindow.open(map, cluster));
															cluster.addListener('mouseout', () => infoWindow.close());


															// establishing marker switch/case by drone id

															//creating polyline
															// striped line symbol
															let lineSymbol = {
																		path: 'M 0,-1 0,1',
																		strokeOpacity: 1,
																		scale: 3
																	};
															// creating striped polyline
															let stripedPoly = new google.maps.Polyline({
																	strokeColor: stroke,
																	strokeOpacity: 0,
																	icons: [{
																			icon: lineSymbol,
																			offset: '0',
																			repeat: '20px'
																	}],
																	map: map
															});


															this.drones[device] = {
																	marker: cluster,
																	initial: initial,
																	points: data,
																	stroke: stroke,
																	last_heard: data[data.length-1].TIME,
																	lines: []
															}

														})
													}
													console.log(data);
													this.mapMarkers(map);

												}
										)
								} else {
										this.detection.getTrackPoints(device).subscribe((data) => {
												console.log(data);
												// let lastPoint = this.drones[device].points[this.drones[device].points.length-1];
												// let lastCoords = new google.maps.LatLng(lastPoint.LAT, lastPoint.LON);
												// this.drones[device].marker.setPosition(lastCoords);

												this.drones[device].points = data;
												this.mapMarkers(map);

										})
								}
								})
						})
				})
		}


		public mapMarkers(map): void {
				console.log('here');
				 let markers = [];
				for( let drone in this.drones){
						let lines = this.drones[drone].lines;
						let cluster = this.drones[drone].marker;
						let stroke  = this.drones[drone].stroke;
						let points  = this.drones[drone].points.map((point) => new google.maps.LatLng(point.LAT, point.LON));

						if(markers.length > 0 ){
								markers = [];
						}
						console.log(points.length);

						console.log(drone);
						if(this.drones[drone].initial !== undefined){
								let poly    = new google.maps.Polyline({
																strokeColor: stroke,
																strokeOpacity:1,
																strokeWeight: 3,
																map: map,
																zIndex: 999,
																path: points
										});
								if(points.length >= 20){
												// debugger;
												this.drones[drone].lines.forEach((line) => {
														// debugger;
														let path = line.getPath();
														path.forEach((point) => {
																path.removeAt(point);
														})
												})
										}
										lines.push(poly);


						}

						cluster.setPosition(points[0]);
						markers.push(cluster);

				}
		}
		public stopTracker(): void {
				this.tracker.unsubscribe();
		}
		public mkSquares(value: any){
				let squares = [];
				this._loader.load().then(() => {
						this.detection.getSections().subscribe(data => {
								for (let index in data){
										let obj = [];
										for (let point of value){

												if(data[index]['SECTION_ID'] == point.SECTION_ID){
														let splits = point.LAT_LON.split(",");


														 let coords  = new google.maps.LatLng(parseFloat(splits[0]), parseFloat(splits[1]));
														obj.push(coords);
												}
										}

										squares.push(obj);

								}
								this.paths = squares;
						})

				})
		}
		public setStatus(value: number){
				let status = {
						color: '',
						code: '',
						marker: ''
				};
				switch(value){
						case 0:
								status.code = 'Offline: Power or network issue';
								status.color = '#EE6D0B';
								status.marker = '#EE6D0B';
								break;
						case 1:
								status.code = 'Online';
								status.color = '#51d320';
								status.marker = '#51d320';
								break;
						case 2:
								status.code = 'Error';
								status.color ='#D53B3C' ;
								status.marker = '#D53B3C';
								break;
						case 3:
								status.code = 'Offline: New';
								status.color = '#EE6D0B';
								status.marker = '#EE6D0B';
								break;
				}
				return status;

				// if(!value){
				//     status.code = 'Issue - Check network and power';
				//     status.color = '#EE6D0B';
				//     status.marker = '#EE6D0B';
				//
				// } else if(value == 1){
				//     status.code = 'Online';
				//     status.color = '#45A567';
				//     status.marker = '#0086E8';
				//
				// } else {
				//     status.code = 'Error';
				//     status.color ='#D53B3C' ;
				//     status.marker = '#D53B3C';
				//
				// }
		}

		public setStatusBar(){
			 // debugger;

				if(this.SENSORS.length == 0){

						this.status = {
								Color: '#7F7F7F',
								Message: 'SYSTEM OFFLINE'
						}
				} else {
						if(this.THREATS.length > 0){
								this.dropConfirmed = true;
								this.status = {
												Color: '#D53B3C',
												Message: 'THREAT DETECTED'
										};
								this.detecting = false;
								this.state = this.state == 'red' ? 'white' : 'red';
						} else {
								if(this.POTENTIAL.length > 0){
										this.dropThreat = true;
										this.status = {
														Color:'#EE6D0B',
														Message: 'ANALYZING SIGNAL OF INTEREST'
												};
										this.detecting = false;
										this.state = 'orange';

								} else {
										this.dropSensor = true;
										this.status = {
														Color: '#45A567',
														Message: 'CLEAR - NO DRONE ACTIVITY'
												}
										this.detecting = true;
										this.state = 'green';

								}
						}
				}
				//  else if((this.SENSORS && this.THREATS) == true ) {
				//     this.status = {
				//         Color: '#D53B3C',
				//         Message: 'DANGER! THREAT SPOTTED!!'
				//     }
				// }
				//  else if (this.SENSORS && !this.THREATS && this.POTENTIAL) {
				//     console.log('correct case')
				//     this.status = {
				//         Color:'#EE6D0B',
				//         Message: 'WARNING! POTENTIAL THREAT DETECTED!!'
				//     }
				// }
				//  else if (this.SENSORS && !this.THREATS && !this.POTENTIAL){
				//     this.status = {
				//         Color: '#45A567',
				//         Message: 'Clear! No Drone Activity...'
				//     }
				// }
		}

}

interface coordinates {
		lat: number;
		lng: number;
}
