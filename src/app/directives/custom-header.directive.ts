import { Directive, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCustomHeader]',
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class CustomHeaderDirective {
  @Input('header') header: any;
  @Input('label') label: any;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.header = this.header.el;
    this.label = this.label.el;
  }

  onContentScroll(event: any) {
    if (event.detail.scrollTop > 50) {
      this.renderer.setStyle(this.label, 'visibility', 'visible');
    } else{
      this.renderer.setStyle(this.label, 'visibility', 'hidden');
    }
  }
}
