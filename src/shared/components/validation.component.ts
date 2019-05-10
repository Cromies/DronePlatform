import { Component, Input, Output }        from '@angular/core';
// import fontawesome          from '@fortawesome/fontawesome';
// import { faCrosshairs }     from '@fortawesome/fontawesome-free-solid/faCrosshairs';
//
// fontawesome.library.add(faCrosshairs);




@Component({
  selector: 'pass-validation',

  template: `                        <label for='pass' class=" form-control-label">{{label}}</label>
  <input type="password" id='pass'  name='pass' (keyup)='validatePass($event)' class="form-control" [(ngModel)] = 'pass'>
                          <!-- <span class="help-block">Please enter your email</span> -->
                          <div *ngIf='!special || !minLength || !lower_case || !upper_case || !numeric'>
                          <div syle='float: left; padding: 5px;'>
                          <p class='vp-bit'><span [style.color] = 'minLength ? "#e7e7e7" : "#0086E8"' class="fa fa-circle"></span>8 characters minimum</p>
                          <p class='vp-bit'><span [style.color] = 'special ? "#e7e7e7" : "#0086E8"' class="fa fa-circle"></span>Special character ($ % & # . ,) </p>
                          <p class='vp-bit'><span [style.color] = 'upper_case ? "#e7e7e7" : "#0086E8"' class="fa fa-circle"></span>Uppercase letter</p>

                          </div>
                          <div syle='float: left; padding: 5px;'>
                          <p class='vp-bit'><span [style.color] = 'lower_case ? "#e7e7e7" : "#0086E8"' class="fa fa-circle"></span>Lowercase letter</p>
                          <p class='vp-bit'><span [style.color] = 'numeric ? "#e7e7e7" : "#0086E8"' class="fa fa-circle"></span>Number</p>

                          </div>

                         </div>
                          <div class="alert alert-success" style='text-align: center; margin-top: 5px;' *ngIf='special && minLength && lower_case && upper_case && numeric'>
                              <i class="fas fa-check"></i>Your password is secure and you're all set!
                          </div>
`,
  styleUrls: [
      '../../assets/css/bootstrap.min.css',
      '../../assets/css/font-awesome.min.css',
      '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-regular.css',
      '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-solid.css',
      '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-brands.css'
  ]
})
export class ValidationComponent {
    @Output() field_name: string;
    @Input() label: string;
    public lower_case:  boolean = false;
    public upper_case:  boolean = false;
    public numeric:     boolean = false;
    public special:     boolean = false;
    public minLength:   boolean = false;
    public new: any
    public pass: any;

    constructor(){
    }

    validatePass(event: any){
        let pass = event.target.value;

            if(pass.length >= 8){
                this.minLength = true;
                console.log('minimum length reached')
            } else {
                this.minLength = false;
            }
            if(pass.search(/[A-Z]/g) >= 0){
                this.upper_case = true;
                console.log('at least one capital letter')
            } else {
                this.upper_case = false;
            }
            if(pass.search(/[a-z]/g) >= 0){
                this.lower_case = true;
                console.log('at least one lower case letter')
            } else {
                this.lower_case = false;
            }

            if(pass.search(/[0-9]/g) >= 0){
                this.numeric = true;
                console.log('at least one number')
            } else {
                this.numeric = false;
            }

            if((pass.search(/[- \/ \\^$!@#%*+?.()|[ \] {}]/g) >= 0)){
                this.special = true;
                console.log('at least one special character')
            } else {
                this.special = false;
            }
    }

}
