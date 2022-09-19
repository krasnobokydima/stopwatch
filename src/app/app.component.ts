import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  switchMap,
  map,
  concat,
  Observable,
  EMPTY,
  scan,
  of,
  combineLatest,
  timer,
  delay,
  buffer,
  filter,
  Subject,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  timer$$!: Observable<number>;
  isWatchWork$ = new BehaviorSubject<boolean>(false);
  resetWatch$ = new BehaviorSubject<boolean>(false);
  delay$ = new Subject<void>();

  interval$ = timer(0, 10).pipe(map(() => 1));

  ngOnInit() {
    this.timer$$ = combineLatest([this.isWatchWork$, this.resetWatch$]).pipe(
      switchMap(([watchWork, reset]) =>
        watchWork && !reset
          ? this.interval$
          : watchWork && reset
          ? concat(of(-1), this.interval$)
          : !watchWork && !reset
          ? EMPTY
          : of(-1)
      ),
      scan((acc, curr) => (curr > 0 ? acc + curr : 0), 0),
      map((x) => x * 10)
    );

    this.delay$.pipe(
      buffer(this.delay$.pipe(delay(300))),
      filter((clickArray) => clickArray.length === 2),
    ).subscribe(() => {
      this.resetWatch$.next(false);
      this.isWatchWork$.next(false);
    });
  }

  onStart() {
    this.isWatchWork$.next(true);
    this.resetWatch$.next(false);
  }
  onStop() {
    this.isWatchWork$.next(false);
    this.resetWatch$.next(true);
  }
  onWait() {
    this.delay$.next();
  }
  onReset() {
    this.resetWatch$.next(true);
  }
}
