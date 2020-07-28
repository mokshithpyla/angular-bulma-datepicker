import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

  @Input() isRange: boolean = false;
  @Input() hasTime: boolean = false;
  @Input() startDate: any = moment();
  @Input() endDate: any;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Output() emitSelected = new EventEmitter<any>();

  locale: string = 'en';
  navDate: any;
  weekDaysHeaderArr: Array<string> = [];
  gridArr: any = {};
  selectedDate: any;
  canAccessPrevious: boolean = true;
  canAccessNext: boolean = true;
  todaysDate = moment().set({ hour:0, minute:0, second:0, millisecond:0 });
  startDay: any;
  endDay: any;
  mode = 'start';
  initialEmptyCells: number;
  lastEmptyCells: number;
  arrayLength: number;
  currentMonth: number;
  currentYear: number;
  formats = ['AM', 'PM'];
  stFormat: string = 'AM';
  etFormat: string = 'AM';
  selected: any;

  constructor() { }

  ngOnInit() {
    moment.locale(this.locale);
    if (!this.startDate) {
      this.startDate = moment();
    }
    this.navDate = moment();
    this.makeHeader();
    this.currentMonth = this.navDate.month();
    this.currentYear = this.navDate.year();
    this.makeGrid(this.currentYear, this.currentMonth);     
  }

  setAccess() {
    this.canAccessPrevious = this.canChangeNavMonth(-1);
    this.canAccessNext = this.canChangeNavMonth(1);
  }

  changeNavMonth(num: number) {
    if (this.canChangeNavMonth(num)) {
      this.navDate.add(num, 'month');
      this.currentMonth = this.navDate.month();
      this.currentYear = this.navDate.year();
      this.makeGrid(this.currentYear, this.currentMonth);
    }
  }

  canChangeNavMonth(num: number) {      
    const clonedDate = moment(this.navDate);
    return this.canChangeNavMonthLogic(num, clonedDate);   
  }

  makeHeader(){
    const weekDaysArr: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArr.forEach(day => this.weekDaysHeaderArr.push(moment().weekday(day).format('ddd')));
  }

  getDimensions(date: any) {
    const firstDayDate = moment(date).startOf('month');
    this.initialEmptyCells = firstDayDate.weekday();
    const lastDayDate = moment(date).endOf('month');
    this.lastEmptyCells = 6 - lastDayDate.weekday();
    this.arrayLength = this.initialEmptyCells + this.lastEmptyCells + date.daysInMonth();
  }

  makeGrid(year, month) {
    if (!this.gridArr.hasOwnProperty(year)) {
      this.gridArr[year] = {};
    }
    if (!this.gridArr[year].hasOwnProperty(month)) {
      this.gridArr[year][month] = [];
      this.getDimensions(this.navDate);
      for (let i = 0; i < this.arrayLength; i++) {
        let obj: any = {};
        if (i < this.initialEmptyCells || i > this.initialEmptyCells + this.navDate.daysInMonth() - 1 ) {
          obj.value = 0;
          obj.available = false;
          obj.isToday = false;
        } else {
          obj.value = i - this.initialEmptyCells +1;
          obj.available = this.isAvailable(i - this.initialEmptyCells +1);
          obj.isToday = this.isToday(i - this.initialEmptyCells +1, month, year);
          obj.month = month;
          obj.date = this.navDate;
          obj.year = year;
          obj.isActive = false;
          if (this.dateFromDayAndMonthAndYear(obj.value, month, year).isSame(this.startDate)) {
            this.startDay = obj;
          }
          if (this.dateFromDayAndMonthAndYear(obj.value, month, year).isSame(this.endDate)) {
            this.endDay = obj;
          }
          if (obj.isToday && !this.startDay && !this.endDay) {
            this.startDay = obj;
            this.endDay = obj;
            obj.isActive = true;
          }
        }
        obj.inRange = false;
        this.gridArr[year][month].push(obj);
      }
    }
    this.setAccess();
  }

  isAvailable(num: number): boolean {
    let dateToCheck = this.dateFromNum(num, this.navDate);
    return this.isAvailableLogic(dateToCheck);
  }

  isToday(num: number, month: number, year: number): boolean {
    const dateToCheck = moment(this.dateFromDayAndMonthAndYear(num, month, year));
    return dateToCheck.isSame(moment(this.todaysDate));
  }

  dateFromNum(num: number, referenceDate: any): any{
    let returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  selectDay(day: any) {
    if (day.available) {
      this.selectedDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
      if (this.isRange) {
        const currDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year)
        switch(this.mode) {
          case 'end':
            if (currDate.isSame(this.startDate)) {
              this.mode = 'start';
            }
            else if (currDate.isSameOrBefore(this.startDate)) {
              this.endDay = this.startDay;
              this.startDay = day;
              this.mode = 'start';
            }
            else {
              this.endDay = day;
            }
            break;
          case 'start':
            if (currDate.isSame(this.endDate)) {
              this.mode = 'end';
            }
            else if (currDate.isSameOrAfter(this.endDate)) {
              this.startDay = this.endDay;
              this.endDay = day;
              this.mode = 'end';
            }
            else {
              this.startDay = day;
            }
            break; 
        }
        this.startDate = this.dateFromDayAndMonthAndYear(this.startDay.value, this.startDay.month, this.startDay.year);
        this.endDate = this.dateFromDayAndMonthAndYear(this.endDay.value, this.endDay.month, this.endDay.year);
        this.applyRange();
        this.startDay.isActive = true;
        this.endDay.isActive = true;
        this.selected = {
          startDate: this.startDate,
          endDate: this.endDate
        }
      }
      else {
        this.resetActivity();
        this.startDate = this.selectedDate;
        this.startDay = day;
        this.startDay.isActive = true;
        this.selected = {
          startDate: this.startDate
        }
      }
      if (this.startDate && this.endDate) {
        this.emitSelected.emit(this.selected);
      }
    }
  }

  resetRange() {
    Object.keys(this.gridArr).forEach(year => {
      Object.keys(this.gridArr[year]).forEach(month => {
        this.gridArr[year][month].map(day => {
          day.inRange = false;
          day.isActive = false;
        });
      });
    });
  }

  resetActivity() {
    Object.keys(this.gridArr).forEach(year => {
      Object.keys(this.gridArr[year]).forEach(month => {
        this.gridArr[year][month].map(day => {
          day.isActive = false;
        });
      });
    });
  }

  dateFromDayAndMonthAndYear(day, month, year) {
    return moment([year, month, day]).set({ hour:0, minute:0, second:0, millisecond:0 });
  }

  applyRange() {
    this.getDimensions(this.startDate);
    const start = this.initialEmptyCells + this.startDay.value - 1;
    const startMonthLength = this.arrayLength;
    this.getDimensions(this.endDate);
    const endMonthLength = this.arrayLength;
    const end = this.initialEmptyCells + this.endDay.value - 1;
    this.resetRange();
    if (this.startDay.month !== this.endDay.month || this.startDay.year !== this.endDay.year) {
      Object.keys(this.gridArr).forEach(year => {
        const calendar = this.gridArr[year];
        Object.keys(calendar).forEach(month => {
          const days = this.gridArr[year][month];
          if (month == this.startDay.month && year == this.startDay.year) {
            for (let i = 0; i < start; i++) {
              days[i]["inRange"] = false;
            }
            for (let i = start; i < startMonthLength; i++) {
              days[i]["inRange"] = true;
            } 
          }
          else if (month == this.endDay.month && year == this.endDay.year) {
            for (var i = 0; i <= end; i++) {
              days[i]["inRange"] = true;
            }
            for (var i = end + 1; i < endMonthLength; i++) {
              days[i]["inRange"] = false;
            } 
          }
          else if ((month > this.startDay.month || year > this.startDay.year) && (month < this.endDay.month || year < this.endDay.year)) {
            days.forEach(day => day.inRange = true);
          }  
        });
      });
    }
    else {
      const month = this.startDay.month;
      const year = this.startDay.year;
      for (let i = 0; i < start; i++) {
        this.gridArr[year][month][i].inRange = false;
      }
      for (let i = start; i <= end; i++) {
        this.gridArr[year][month][i].inRange = true;
      }
      for (let i = end + 1; i < this.arrayLength; i++) {
        this.gridArr[year][month][i].inRange = false;
      }
    }
  }

  isAvailableLogic(dateToCheck: any) {
    if (this.minDate || this.maxDate) {
       if (dateToCheck.isBefore(this.minDate) || dateToCheck.isAfter(this.maxDate)) {
         return false;
       }
       else {
         return true;
       }
    }
    else {
      if (dateToCheck.isBefore(moment(), 'day')) {
        return false;
      }
      else {
        return true;
      }
    }
  }

  canChangeNavMonthLogic(num, currentDate){
    currentDate.add(num, 'month');
    const minDate = this.minDate ? this.minDate : moment().add(-1, 'month');
    const maxDate = this.maxDate ? this.maxDate: moment().add(1, 'year');
    return currentDate.isBetween(minDate, maxDate);
  }

  changeMode(mode: string) {
    this.mode = mode;
  }

  clear() {
    this.resetRange();
    this.startDate = null;
    this.endDate = null;
    // this.startDay = null;
    // this.endDay = null;
    this.navDate = this.todaysDate;
    this.currentMonth = this.navDate.month();
    this.currentYear = this.navDate.year();
    this.isRange = false;
    this.hasTime = false;
    this.mode = 'start';
    this.makeGrid(this.currentYear, this.currentMonth);
  }

  setTime(time, hour, minute) {
    return time.set({ hour: hour, minute: minute, second:0, millisecond:0 });
  }

  updateHours() {
    if (this.mode === 'start') {
      switch (this.stFormat) {
        case 'AM':
          this.startDate = this.setTime(this.startDate, this.stHours, this.stMinutes);
          break;
        case 'PM':
          this.startDate = this.setTime(this.startDate, this.stHours + 12, this.stMinutes);
          break;
      }
    }
    else {
      switch (this.etFormat) {
        case 'AM':
          this.endDate = this.setTime(this.endDate, this.etHours, this.etMinutes);
          break;
        case 'PM':
          this.endDate = this.setTime(this.endDate, this.etHours + 12, this.etMinutes);
          break;
      }
    }
  }

  updateMinutes() {
    switch(this.mode) {
      case 'start': 
        this.startDate = this.setTime(this.startDate, this.stHours, this.stMinutes);
        break;
      case 'end':
        this.endDate = this.setTime(this.endDate, this.etHours, this.etMinutes);
        break;
    }
  }

  updateAMPM(format) {
    if (this.mode === 'start') {
      this.stFormat = format;
    }
    else {
      this.etFormat = format;
    }
    this.updateHours();
    this.updateMinutes();
  }

  get stHours() {
    return this.startDate.hours() == 0? 12: this.startDate.hours();
  }

  get stMinutes() {
    return this.startDate.minutes();
  }

  get etHours() {
    return this.endDate.hours() == 0? 12: this.endDate.hours();
  }

  get etMinutes() {
    return this.endDate.minutes();
  }

  handleModeChange() {
    this.resetRange();
    this.mode = 'end';
    if (this.startDay) {
      this.startDay.isActive = true;
    }
    if (!this.isRange) {
      this.endDate = null;
      this.mode = 'start';
      this.startDay.isActive = false;
      this.endDay.isActive = false;
    }
  }
}
