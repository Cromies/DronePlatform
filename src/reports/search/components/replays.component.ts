import { Component, OnInit, AfterViewInit, ViewChild }    from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import {
    AgmCoreModule,
     AgmMap,
      GoogleMapsAPIWrapper,
       LatLngBounds,
        LatLngBoundsLiteral,
         MapsAPILoader,
        MarkerManager}                      from '@agm/core';
import {ActivatedRoute }                    from '@angular/router';
import {DatePipe }                          from '@angular/common';
import { Http }                             from '@angular/http';
import { Observable, interval, Subject }             from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';

import { ReportsService }                   from '../../reports.service';
import { AuthService }                      from '../../../assets/util/services/auth.service';
import { LogService }                      from '../../../assets/util/services/logs.service';

declare var google: any;



@Component({
      selector: 'replays',
      templateUrl: '../html/replays.html',
      styleUrls: [
          '../../../assets/css/bootstrap.min.css',
          '../../../assets/css/replays.css',
          '../../../assets/css/font-awesome.min.css',
          '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-regular.css',
          '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-solid.css',
          '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-brands.css'
      ]

  })

export class ReplaysComponent implements AfterViewInit, OnInit{
    public switch: string = 'start';
    public raw: any;
    public lat: number;
    public lng: number;
    public paths: any = [];
    public poly: any;
    public data: any;
    public points: any;
    public first: any;
    public last: any;
    public map: any;
    public forwarding: boolean = false;
    public markers: any = [];
    public stop: boolean = false;
    public speed: number = 250;
    public playing: boolean = false;
    public pauser: any;
    public startIcon: any = [
        '../../../assets/img/1-start.png',
        '../../../assets/img/2-start.png',
        '../../../assets/img/3-start.png',
        '../../../assets/img/4-start.png',
        '../../../assets/img/5-start.png',
    ];
    public stopIcon: any = [
        '../../../assets/img/1-stop.png',
        '../../../assets/img/2-stop.png',
        '../../../assets/img/3-stop.png',
        '../../../assets/img/4-stop.png',
        '../../../assets/img/5-stop.png',
    ];
    public droneIcon: any = {
        controller: '../../../assets/img/threat-controller.png',
        drone: '../../../assets/img/threat-drone.png',
        unknown: '../../../assets/img/threat-unknown.png'
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




    constructor(private routes: ActivatedRoute, private _auth: AuthService, private markerManager: MarkerManager, private reports: ReportsService, private http: Http, private _loader: MapsAPILoader, private _gmap: GoogleMapsAPIWrapper,  private datePipe: DatePipe ){
        this.routes.queryParams.subscribe(params => {
            this.data = JSON.parse(params['data']);
            this.first = this.datePipe.transform(this.data.FIRST_HEARD, 'yyyy-MM-dd HH:mm:ss');
            this.last = this.datePipe.transform(this.data.LAST_HEARD, 'yyyy-MM-dd HH:mm:ss');

            console.log(this.data.DEVICE_ID);
        })
    }

    ngOnInit(): void {
        this.reports.getCenter().subscribe((data) => {
            console.log(data);
            let coords = data[0].LOCATION.split(',');
            this.lat = parseFloat(coords[0]);
            this.lng = parseFloat(coords[1]);

            console.log('location: '+this.lat+' - '+this.lng);
        })
    }

    @ViewChild(AgmMap) agmMap;
    ngAfterViewInit(): void {
        this.agmMap.mapReady.subscribe(map => {
            this.map = map;
            this.getPoints();
            this.http.get(this._auth.mode+'/reports/log/'+this.data.DEVICE_ID+'/'+this.first+'/'+this.last)
            .subscribe((data) => {

                let speed = this.speed * 10 ;
                console.log(data.json());
                this.raw = data.json();
                let source = Observable.zip(Observable.from(this.raw), interval(300));


                this.pauser = new Subject();
                this.pauser
                .switchMap( (paused) => paused ? Observable.never() : source)
                .subscribe((point) => {
                  let path = this.poly.getPath();
                  let coords = new google.maps.LatLng(point[0].LAT, point[0].LON);
                  path.push(coords);
                  this.markers[0].setPosition(coords);

                })
                console.log(this.points);
                })
            })
        }
        public toggleSwitch(): void {
            this.switch = this.switch == 'start' ? 'stop' : 'start';
        }

        public getPoints(): void {
            this.reports.getPoints().subscribe(
                data => {
                this.mkSquares(data)
                // console.log(data);
                // console.log(this.mkSquares(data))
                // this.points = this.mkSquares(data);
            }, err => {
                console.log(err);
            })

        }
        public onTap(value: any){
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    data: JSON.stringify(value)
                }
            };
            console.log(value);
            // this.router.navigate(['incident-search/details'], navigationExtras);
        }

        public mkSquares(value: any){
            let squares = [];
            this._loader.load().then(() => {
                this.reports.getSections().subscribe(data => {
                    console.log(data);
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
                    console.log(this.paths);
                })

            })
        }



    public  play(): void {
      console.log(this.raw[0]);
      let initialPoint = this.raw[0];
      let startCoords = new google.maps.LatLng(initialPoint.LAT, initialPoint.LON);
      let iconKeys = Object.keys(this.newStartIcon);
      let stroke      = this.newStartIcon[iconKeys[2]].color;
      let icon        = this.newStartIcon[iconKeys[2]].icon;
      let cluster;
      let initial;
      let id          = this.data.DEVICE_ID.split('_');
      let lines = [];
          switch(id[0]){
              case 'Unknown':
                  cluster = new google.maps.Marker({
                      map: this.map,
                      icon: this.droneIcon.unknown,
                      zIndex: 9999,
                      position: startCoords
                  });
                  initial = new google.maps.Marker({
                      map: this.map,
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
                      map: this.map,
                      icon: image,
                      zIndex: 9999,
                      position: startCoords

                  });
                  initial = new google.maps.Marker({
                      map: this.map,
                      icon: icon,
                      zIndex: 1,
                      position: startCoords
                  });

                  break;
              default:
                  cluster = new google.maps.Marker({
                      map: this.map,
                      icon: this.droneIcon.controller,
                      zIndex: 9999,
                      position: startCoords


                  });
                  initial = new google.maps.Marker({
                      map: this.map,
                      icon: icon,
                      zIndex: 1,
                      position: startCoords
                  });

                  break;
          }
          this.markers.push(cluster);
          this.markers.push(initial);
          this.poly        = new google.maps.Polyline({
                              strokeColor: stroke,
                              strokeOpacity:1,
                              strokeWeight: 3,
                              map: this.map,
                              zIndex: 999
              });
      this.pauser.next(false);
      this.playing = true;

    }
    public forward() {
        if(this.markers.length > 0){
          this.reset();

        }
        let initialPoint = this.raw[0];
        let coords = this.raw.map((point) => new google.maps.LatLng(point.LAT, point.LON));
        let startCoords = new google.maps.LatLng(initialPoint.LAT, initialPoint.LON);
        let iconKeys = Object.keys(this.newStartIcon);
        let stroke      = this.newStartIcon[iconKeys[2]].color;
        let icon        = this.newStartIcon[iconKeys[2]].icon;
        let cluster;
        let initial;
        let id          = this.data.DEVICE_ID.split('_');
            switch(id[0]){
                case 'Unknown':
                    cluster = new google.maps.Marker({
                        map: this.map,
                        icon: this.droneIcon.unknown,
                        zIndex: 9999,
                        position: startCoords
                    });
                    initial = new google.maps.Marker({
                        map: this.map,
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
                        map: this.map,
                        icon: image,
                        zIndex: 9999,
                        position: startCoords

                    });
                    initial = new google.maps.Marker({
                        map: this.map,
                        icon: icon,
                        zIndex: 1,
                        position: startCoords
                    });

                    break;
                default:
                    cluster = new google.maps.Marker({
                        map: this.map,
                        icon: this.droneIcon.controller,
                        zIndex: 9999,
                        position: startCoords


                    });
                    initial = new google.maps.Marker({
                        map: this.map,
                        icon: icon,
                        zIndex: 1,
                        position: startCoords
                    });

                    break;
            }
            this.markers.push(cluster);
            this.markers.push(initial);
            this.poly        = new google.maps.Polyline({
                                strokeColor: stroke,
                                strokeOpacity:1,
                                strokeWeight: 3,
                                map: this.map,
                                zIndex: 999,
                                path: coords
                });
            this.markers[0].setPosition(coords[coords.length-1]);
            this.playing = true;
    }
    public reset() {
      this.playing = false;
        this.pauser.next(true);
        this.markers.forEach((marker) => {
            marker.setMap(null);
        });
        this.markers = [];
        this.poly.setMap(null);
    }
    public  pause(): void {
    }
}
