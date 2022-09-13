import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  fromEvent,
  map,
  scan,
  merge,
  switchMap,
  interval,
  tap,
  debounceTime,
  skip,
} from 'rxjs';
interface State {
  count: number;
  timerWork: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('btnStartStop', { static: true, read: ElementRef })
  buttonStartStop!: ElementRef;
  @ViewChild('btnWait', { static: true, read: ElementRef })
  buttonWait!: ElementRef;
  @ViewChild('btnReset', { static: true, read: ElementRef })
  buttonReset!: ElementRef;
  timerWork = false;

  hours = 0;
  minutes = 0;
  seconds = 0;
  mlSeconds = 0;

  btnStartStopSubs$: any;
  btnWaitSubs$: any;
  btnResetSubs$: any;
  watch$: any;

  startWatch: State = {
    count: 0,
    timerWork: true,
  };

  ngAfterViewInit(): void {
    this.watch$ = merge(
      fromEvent(
        this.buttonStartStop.nativeElement as HTMLElement,
        'click'
      ).pipe(
        map(() => {
          this.timerWork = !this.timerWork;

          return this.timerWork
            ? { timerWork: true }
            : { timerWork: false, count: 0 };
        })
      ),
      fromEvent(this.buttonWait.nativeElement as HTMLElement, 'click').pipe(
        debounceTime(500),
        skip(1),
        map(() => {
          this.timerWork = false;
          return { timerWork: false };
        })
      ),
      fromEvent(this.buttonReset.nativeElement as HTMLElement, 'click').pipe(
        map(() => ({})),
        tap(() => this.reset())
      )
    )
      .pipe(
        scan(
          (state: State, curr: Partial<State>) => ({ ...state, ...curr }),
          this.startWatch
        ),
        switchMap((state: State) => {
          return interval(10).pipe(
            tap(() => {
              if (state.timerWork) {
                state.count += 1;
                this.changeWatchTimer();
              }

              if (!state.count && !state.timerWork) {
                this.reset();
              }
            })
          );
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.btnStartStopSubs$.unsubscribe();
    this.btnWaitSubs$.unsubscribe();
    this.btnResetSubs$.unsubscribe();
    this.watch$.unsubscribe();
  }

  private changeWatchTimer() {
    this.mlSeconds += 1;
    if (this.mlSeconds < 100) return;
    this.mlSeconds = 0;
    this.seconds += 1;
    if (this.seconds < 60) return;
    this.seconds = 0;
    this.minutes += 1;
    if (this.minutes < 60) return;
    this.minutes = 0;
    this.hours += 1;
  }

  createWatchTimer() {
    const { mlSeconds, seconds, minutes, hours, prepareTime } = this;

    return `${prepareTime(hours)}:${prepareTime(minutes)}:${prepareTime(
      seconds
    )}:${prepareTime(mlSeconds)}`;
  }

  prepareTime(count: number) {
    return count < 10 ? '0' + count : '' + count;
  }

  private reset() {
    this.mlSeconds = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
  }
}
