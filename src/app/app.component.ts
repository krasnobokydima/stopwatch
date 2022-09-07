import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  currentStopWatch: Date = new Date();
  currentTimer = 0;
  date$!: Subscription;
  isTimerWork = false;

  timer: any = 0;
  prevent = false;
  delay = 300;

  constructor(private toast: MatSnackBar) {}

  ngOnInit(): void {
    this.currentStopWatch.setHours(0, 0, 0, 0);
  }

  ngOnDestroy(): void {
    this.date$.unsubscribe();
    this.isTimerWork = false;
  }

  start() {
    this.resetError();

    this.date$ = timer(0, 1000).subscribe(() => {
      this.currentTimer += 1
      const newDate = new Date();
      newDate.setHours(0, 0, this.currentTimer)

      this.currentStopWatch = newDate;
    });

    this.isTimerWork = true;
  }

  stop() {
    this.resetError();

    this.date$.unsubscribe();
    this.isTimerWork = false;
  }

  reset() {
    this.resetError();

    this.date$.unsubscribe();
    this.currentStopWatch = new Date();
    this.currentStopWatch.setHours(0, 0, 0, 0);
    this.currentTimer = 0;
    this.isTimerWork = false;
  }

  errorToast() {
    this.timer = setTimeout(() => {
      if (!this.prevent) {
        this.toast.open('Use double Click', '!!!', { duration: 1000 });
      }

      this.prevent = false;
    }, this.delay);
  }

  private resetError() {
    clearTimeout(this.timer);
    this.prevent = true;
  }
}
