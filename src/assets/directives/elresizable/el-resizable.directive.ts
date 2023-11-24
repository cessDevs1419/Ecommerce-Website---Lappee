import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ElResizable]'
})
export class ElResizableDirective {

  private initialX: number;
  private initialY: number;
  private initialWidth: number;
  private initialHeight: number;
  private isResizing = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Output() emitIsResizing: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.isResizeHandle(event.target!)) {
      this.startResize(event.clientX, event.clientY);
    } else {
      this.isResizing = false;
      this.emitIsResizing.emit(this.isResizing);
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (this.isResizeHandle(event.target!)) {
      const touch = event.touches[0];
      this.startResize(touch.clientX, touch.clientY);
    } else {
      this.isResizing = false;
      this.emitIsResizing.emit(this.isResizing);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.handleResize(event.clientX, event.clientY);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    this.handleResize(touch.clientX, touch.clientY);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isResizing = false;
    this.emitIsResizing.emit(this.isResizing);
  }

  @HostListener('document:touchend')
  onTouchEnd(): void {
    this.isResizing = false;
    this.emitIsResizing.emit(this.isResizing);
  }

  private startResize(x: number, y: number): void {
    this.initialX = x;
    this.initialY = y;
    this.initialWidth = this.el.nativeElement.offsetWidth;
    this.initialHeight = this.el.nativeElement.offsetHeight;
    this.isResizing = true;
    this.emitIsResizing.emit(this.isResizing);
  }

  private handleResize(x: number, y: number): void {
    if (this.isResizing) {
      const deltaX = x - this.initialX;
      const deltaY = y - this.initialY;
      const parentWidth = this.el.nativeElement.parentElement.offsetWidth;
      const parentHeight = this.el.nativeElement.parentElement.offsetHeight;

      let newWidth = this.initialWidth + deltaX;
      let newHeight = this.initialHeight + deltaY;

      // Apply constraints based on parent dimensions
      newWidth = Math.min(newWidth, parentWidth);
      newHeight = Math.min(newHeight, parentHeight);

      this.renderer.setStyle(this.el.nativeElement, 'width', `${newWidth}px`);
      this.renderer.setStyle(this.el.nativeElement, 'height', `${newHeight}px`);
    }
  }

  private isResizeHandle(target: EventTarget): boolean {
    // Check if the target is the resize handle or a child of the resize handle
    return (
      (target as HTMLElement).classList.contains('resize-handle') ||
      (target as HTMLElement).closest('.resize-handle') !== null
    );
  }
}
