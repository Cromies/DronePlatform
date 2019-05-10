import { Component }        from '@angular/core';
// import fontawesome          from '@fortawesome/fontawesome';
import { AuthService }      from '../../../assets/util/services/auth.service';
// import { faCrosshairs }     from '@fortawesome/fontawesome-free-solid/faCrosshairs';
//
// fontawesome.library.add(faCrosshairs);




@Component({
  selector: 'footerElement',
  templateUrl: '../html/footer.html',
  styleUrls: [
      '../../../assets/css/main.css',
      '../../../assets/css/font-awesome.min.css',
      '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-regular.css',
      '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-solid.css',
      '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-brands.css'
  ]
})
export class FooterComponent {

    constructor(private auth: AuthService){
    }


}
