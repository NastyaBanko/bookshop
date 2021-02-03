import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[windowHeight]',
})
export class WindowHeightDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.elementRef.nativeElement, "height", window.innerHeight+"px");
  }
}
