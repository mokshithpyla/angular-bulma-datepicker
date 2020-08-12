import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {

  selectedDate: any;
  isRange: boolean = true;
  hasTime: boolean = true;
  startDate: any;
  endDate: any;
  maxDate: any;
  minDate: any;
  constructor() { }

  ngOnInit() {
  }

}
