import { Component, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  // stopWatch
  hours = 0;
  minutes = 0;
  seconds = 0;
  mlSeconds = 0;
  timer$: Subscription | undefined;

  // delay
  timerDelay!: ReturnType<typeof setTimeout>;
  delay = 300;
  prevents = false;

  constructor(private toast: MatSnackBar) {}

  ngOnDestroy(): void { this.timer$?.unsubscribe() }

  start() {
    if (!this.prevents) return this.error();
    this.prevents = false;
    clearInterval(this.timerDelay)

    this.timer$ = timer(0, 10).subscribe(() => this.changeWatchTimer());
  }

  stop() {
    if (!this.prevents) return this.error();
    this.prevents = false;
    clearInterval(this.timerDelay)

    this.timer$?.unsubscribe();
  }

  reset() {
    if (!this.prevents) return this.error();
    this.prevents = false;
    clearInterval(this.timerDelay)

    this.timer$?.unsubscribe();

    this.mlSeconds = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
  }

  error() {
    this.prevents = true;

    this.timerDelay = setTimeout(() => {
      this.prevents = false;

      this.toast.open('Use double Click', '!!!', { duration: 1000 });
    }, this.delay);
  }

  createWatchTimer() {
    const prNumber = (number: number) => (number > 9 ? number : '0' + number);
    const { hours, minutes, seconds, mlSeconds } = this;

    return `${prNumber(hours)}:${prNumber(minutes)}:${prNumber(seconds)}:${prNumber(mlSeconds)}`;
  }

  private changeWatchTimer() {
    this.mlSeconds += 1;

    if (this.mlSeconds === 100) {
      this.mlSeconds = 0;
      this.seconds += 1;

      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes += 1;

        if (this.minutes === 60) {
          this.minutes = 0;
          this.hours += 1;
        }
      }
    }
  }
}
