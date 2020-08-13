This is a date time range picker done with Angular 5, Bulma.css and Moment.js. 

I have documented the process of building it in this medium post: https://medium.com/@mokshithnathpyla/building-a-date-time-range-picker-with-angular-bulma-and-moment-js-16cb8ed9d140

You can use this component as both a single date picker as well as range including time picker(includes start date, end date and time)

The behaviour can be controlled through the parent component. Following are the properties:

| Property      | Description   | Type  | Default  |
| :------------- | :----------: | -----------: | :------------- | 
| isRange | provides option to pick end date if true, hides the option if false | boolean  | - |
| hasTime | It provides option to pick time if true, hides the option if false. | boolean | - |
| startDate | To set start date of the date range (In simple datepicker mode, it is the default date) | any (moment) | - |
| endDate | To set end date of the date range | any (moment) | - |
| minDate  | To set minimum available date that can be selected by the user | any (moment) | today's date |
| maxDate |  To set maximum available date that can be selected by the user| any (moment) | current day and month of next year |
| emitSelected |  To set maximum available date that can be selected by the user. (By default it is current day and month of next year) | EventEmitter | - |

You may fork it and contribute as I have from JoniWanKenobi/angular-bulma-datepicker. 

Improvements from original repository:
- Include Range (ability to pick start and end date)
- Include Time (ability to pick time)
- Developed a smart time picker
- Refactored to implement sound Angular practices i.e avoiding functions within the template.


# AngularBulmaDateTimeRangeicker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
