import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

const DEFAULT_YEAR = 2010;

@Directive({
  selector: '[appYearSpinner]',
  standalone: true
})
export class YearSpinnerDirective {
  private lastValue = '';

  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() @Self() private ngControl: NgControl
  ) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && this.isEmpty()) {
      event.preventDefault();
      this.applyYear(DEFAULT_YEAR);
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (document.activeElement === this.el.nativeElement && this.isEmpty()) {
      event.preventDefault();
      this.applyYear(DEFAULT_YEAR);
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputType = (event as InputEvent).inputType;
    const isTyping =
      inputType === 'insertText' ||
      inputType === 'insertFromPaste' ||
      inputType === 'deleteContentBackward' ||
      inputType === 'deleteContentForward' ||
      inputType === 'deleteByCut';

    if (!isTyping && this.wasEmpty(this.lastValue) && this.isNativeEmptyStart()) {
      this.applyYear(DEFAULT_YEAR);
      return;
    }

    this.lastValue = this.el.nativeElement.value;
  }

  private isEmpty(): boolean {
    return this.wasEmpty(this.el.nativeElement.value);
  }

  private wasEmpty(value: string | null): boolean {
    return value == null || value === '';
  }

  private isNativeEmptyStart(): boolean {
    const n = Number(this.el.nativeElement.value);
    return n === 0 || n === 1 || n === -1;
  }

  private applyYear(year: number): void {
    const value = String(year);
    this.el.nativeElement.value = value;
    this.lastValue = value;

    if (this.ngControl?.control) {
      this.ngControl.control.setValue(year);
    } else {
      this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
