import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../assets/css/busy.css']
})
export class AppComponent implements OnInit {
    constructor(){

    }
    ngOnInit(): void {
        console.log('test');
    }
}
