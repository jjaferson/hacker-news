import { Directive, AfterViewInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, scan, tap, pairwise, map, exhaustMap, debounceTime } from 'rxjs/operators';

interface ScrollPosition {
  sH: number;
  sT: number;
  cH: number;
};


@Directive({
  selector: '[appInfiniteScroller]'
})
export class InfiniteScrollerDirective implements AfterViewInit{

  @Output()
  private loadMore: EventEmitter<boolean> = new EventEmitter();

  @Input()
  scrollPercent: number = 70;

  constructor(
    private elm: ElementRef
  ) { }

  ngAfterViewInit(): void {
    fromEvent(window.document, 'scroll')
      .pipe(
        debounceTime(10),
        map((e: any): ScrollPosition => {
          return {
            sH: this.elm.nativeElement.clientHeight,
            sT: window.scrollY,
            cH: window.innerHeight
          }
        }),
        pairwise(),
        filter(positions => 
          this.isUserScrollingDown(positions) && 
          this.isScrollExpectedPercent(positions[1])
        )
      )
      .subscribe(() => this.loadMore.emit(true));
  }

  private isUserScrollingDown = (positions) => {
    return positions[0].sT < positions[1].sT;
  }

  private isScrollExpectedPercent = (position) => {
    return ((position.sT + position.cH) / position.sH) > (this.scrollPercent / 100);
  }
}
