import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { trigger,	state,	style, animate, transition} from '@angular/animations';


@Component({
      selector: 'toggle-switch',
      templateUrl: '../html/switch.html',
      styleUrls: ['../../../assets/css/toggle.scss'],
      animations: [
          trigger('toggle', [
            state('active', style({
              backgroundColor: '#F8F8F8',
              boxShadow: 'inset 2px 2px 5px 1px rgba(0,0,0,0.3)',
              color: '#000'
              })),
            state('inactive', style({
               backgroundColor: '#007bff',
               color: '#FFF'

             }))
          ])
        ]
    })

export class SwitchComponent {
  @Input() on_text: string;
  @Input() off_text: string;
  @Input() default: any;
  @Input() actionWhenOn: any;
  @Input() actionWhenOff: any;
  @Input() params: any;
  @Input() toggled: boolean = true;

  public on_state: any = 'on';
  public off_state: any = 'off';
  public state: any = 'on';

  constructor() {}


  public onAction(action: Function = null, params = null){
    this.toggled = this.toggled == true ? false : true;
    if(action != null){
      if(params != null){
        console.log(params);
        action(params);
      } else {
        action();
      }
    }
  }
  public tester(text){
    console.log(text);
  }


}
