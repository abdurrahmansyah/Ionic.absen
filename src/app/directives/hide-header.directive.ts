import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appHideHeader]'
  // host: {
  //   '(ionScroll)': 'onContentScroll($event)'
  // }
})
export class HideHeaderDirective {

  @Input("header") header: HTMLElement;
  constructor() { 
    console.log("Directive");
    
  }

  // onContentScroll(event) {
  //   console.log(event);
  // }
}
