/**
 * Created by Werner on 2016/06/21.
 */
'use strict';

var dateFunctions = {
  getWeekOfTheYearISOISO8601: function(date) {
    // This script is released to the public domain and may be used, modified and
    // distributed without restrictions. Attribution not necessary but appreciated.
    // Source: http://weeknumber.net/how-to/javascript

    var d = new Date(date.getTime());
    d.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(d.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
  },

  getWeeksInMonth: function(date) {
    var firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1),
      lastDayOfMonth = new Date(new Date(date.getFullYear(), date.getMonth() + 1, 1).setDate(0)),
      firstWeek = this.getWeekOfTheYearISOISO8601(firstOfMonth),
      lastWeek = this.getWeekOfTheYearISOISO8601(lastDayOfMonth);

    // in case the first day of the week falls in the last week of the previous year.
    if(firstWeek > lastWeek) {
      firstWeek = 1;
      lastWeek++;
    }

    return lastWeek - firstWeek + 1
  },

  getDayOfTheWeek: function(date, firstDay) {
    var dayOfTheWeek = date.getDay() - firstDay;
    if (dayOfTheWeek < 0) dayOfTheWeek = 7 + dayOfTheWeek;

    return dayOfTheWeek;
  },

  getWeekDayAbbr: function(date, abbrArr) {
    if (abbrArr == undefined || abbrArr.length != 7) {
      abbrArr = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    }

    return abbrArr[date.getDay()];
  },

  addDays: function(date, days) {
    date = new Date(date.setDate(date.getDate() + days));
  },

  getFirstDayOfMonth: function(month, year) {
    return new Date(year, month, 1, 0, 0, 0, 0);
  }

};
