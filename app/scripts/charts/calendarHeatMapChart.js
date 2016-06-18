'use strict';

function calenderHeatmapChart() {
  var margin = {top: 40, right: 20, bottom: 40, left: 20},
      width = 800,
      height = margin.top + margin.bottom;


  var heatMapColorArray = ['#000000', '#0000FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000', '#FFFFFF'];
  //var heatMapColorArray = ['#FFFFFF', '#FF0000', '#0000FF'];
  var colorMap = d3.scale.linear().domain(d3.range(0, 1, 1.0 / (heatMapColorArray.length - 1))).range(heatMapColorArray);
  var colorScale = d3.scale.linear().domain([0, 1]).range([0, 1]);

  var dateVal = function (d) { return new Date(d.date); }; // default x value
  var numericVal = function (d) { return +d.value; }; // default y value

  function chart(selection) {
    selection.each(function (data) {
      // convert the input data format to an array of date and number
      data = data.map(function (d) {
        return [dateVal.call(data, d), numericVal.call(data, d)];
      });

      for(var i = 0; i < data.length; i++) {
        data[i][0].setHours(0,0,0,0);
      }

      var formatDate = d3.time.format('%Y-%m-01');

      var uniqueDates = [];

      data.map(function (d) {
        var aDate = formatDate(d[0]);

        if (uniqueDates.indexOf(aDate) == -1) {
          uniqueDates.push(aDate);
        }
      });

      uniqueDates = uniqueDates.map(function (d) {
        return new Date(d);
      });

      var monthsArr = [];

      uniqueDates.map(function (d) {
        monthsArr.push({ month: d.getMonth(), dataArray: createDateFilledArray(d.getMonth(), d.getFullYear()).map(function(d) { return { date: d, count: 0, partOfMonth: 1}; }) });
      });

      for (var i = 0; i < monthsArr.length; i++) {
        var firstDay = dateUtilities.getDayOfTheWeek(monthsArr[i].dataArray[0].date, "mo");

        for (var j = 0; j < firstDay; j++) {
          var d = new Date(monthsArr[i].dataArray[0].date);
          dateUtilities.addDays(d, -1);
          monthsArr[i].dataArray.unshift({ date: d, count: 0, partOfMonth: 0});
        }

        var lastDay = dateUtilities.getDayOfTheWeek(monthsArr[i].dataArray[monthsArr[i].dataArray.length - 1].date, "mo");

        for (var j = 0; j < 6 - lastDay; j++) {
           var d = new Date(monthsArr[i].dataArray[monthsArr[i].dataArray.length - 1].date);
           dateUtilities.addDays(d, 1);
           monthsArr[i].dataArray.push({ date: d, count: 0, partOfMonth: 0});
        }

        while (monthsArr[i].dataArray.length < 42) {
          var d = new Date(monthsArr[i].dataArray[monthsArr[i].dataArray.length - 1].date);
          dateUtilities.addDays(d, 1);
          monthsArr[i].dataArray.push({ date: d, count: 0, partOfMonth: 0});
        }
      }

      var chartData = [];

      monthsArr.map(function (d) {
        for (var i = 0; i < d.dataArray.length; i++) {
          var idx = dataItemIndexByDate(data, d.dataArray[i].date);

          if (idx != -1 && d.month == data[idx][0].getMonth()) {
            d.dataArray[i].count = data[idx][1];
          }

          chartData.push(d.dataArray[i]);
        }
      });

      var dom = d3.extent(data, function(d) { return d[1]; });
      colorScale.domain(dom);

      var innerWidth = width - margin.left - margin.right;
      var cellWidth = Math.floor(innerWidth / (chartData.length / 42) / 7);
      var fontSize = Math.floor(cellWidth / 2.2);
      var dayFormat = d3.time.format('%d');
      var weekDayArr = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
      var weekDayHeaderRange = d3.range(0, (chartData.length / 42) * 7, 1);

      height =  margin.top + margin.bottom + (8 * cellWidth);

      var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      var svg = d3.select(this)
        .append("svg")
        .attr("width", width)
        .attr('height', height)
        .append('g')
        .attr('class', 'chm-calendar-header')
        .append('g')
        .attr('class', 'chm-calendar-body')
        .append('g')
        .attr('class', 'chm-calendar-footer');

      var calendarHeader = svg.selectAll('.chm-calendar-header')
        .data(weekDayHeaderRange)
        .enter()
        .append('g')
        .attr('transform', function(d, i) { return 'translate(' + (margin.left + (cellWidth * i)) + ', ' + margin.top + ')'});

      calendarHeader.append('rect')
        .attr('width', cellWidth)
        .attr('height', cellWidth)
        .attr('class', 'chm-weekDay-bg')
        .attr('shape-rendering', 'crispEdges');;

      calendarHeader.append('text')
        .style('text-anchor', 'middle')
        .attr('class', 'chm-weekDay-text')
        .attr('font-size', fontSize + 'px')
        .attr('dominant-baseline', "hanging")
        .attr('x', cellWidth / 2)
        .attr('y', (cellWidth / 2) - (fontSize / 2))
        .text(function(d) { return weekDayArr[d % 7] });

      var calendarFooter = svg.selectAll('.chm-calendar-header')
        .data(uniqueDates)
        .enter()
        .append('g')
        .attr('transform', function(d, i) { return 'translate(' + (margin.left + (cellWidth * 7 * i)) + ', ' + (margin.top + (7 * cellWidth)) + ')'});

      calendarFooter.append('rect')
        .attr('width', cellWidth * 7)
        .attr('height', cellWidth)
        .attr('class', 'chm-weekDay-bg')
        .attr('shape-rendering', 'crispEdges');;

      formatDate = d3.time.format('%B %Y');

      calendarFooter.append('text')
        .style('text-anchor', 'middle')
        .attr('class', 'chm-weekDay-text')
        .attr('font-size', fontSize + 'px')
        .attr('dominant-baseline', "hanging")
        .attr('x', (cellWidth * 7) / 2)
        .attr('y', (cellWidth / 2) - (fontSize / 2))
        .text(function(d) { return formatDate(d); });

      var calendarBody = svg.selectAll('chm-calendar-body')
        .data(chartData)
        .enter()
        .append('g')
        .attr('transform', function(d, i) { return 'translate(' + calculateXPos(margin.left, cellWidth, i) + ', ' + calculateYPos(margin.top, cellWidth, i) + ')'});

      formatDate = d3.time.format('%Y-%m-%d');

      calendarBody.append('rect')
        .attr('width', cellWidth)
        .attr('height', cellWidth)
        .attr('fill', function(d) { return colorMap(colorScale(d.count)); })
        .attr('class', 'chm-month-border')
        .attr('shape-rendering', 'crispEdges');

      calendarBody.append('text')
        .style('text-anchor', 'middle')
        .attr('class', 'calDayText')
        .attr('fill', function(d) { return idealTextColor(colorMap(colorScale(d.count))); })
        .attr('fill-opacity', function(d) { return (d.partOfMonth === 1 ? 1 : 0.5) })
        .attr('shape-rendering', 'optimizeQuality')
        .attr('font-size', fontSize + 'px')
        .attr('dominant-baseline', "hanging")
        .attr('x', cellWidth / 2)
        .attr('y', (cellWidth / 2) - (fontSize / 2))
        .text(function(d) { return dayFormat(d.date) })
        .on('mouseover', function(d) {
          div.transition().duration(200).style('opacity', .9);
          div.html('Date: ' + formatDate(d.date) + '<br/>Count: '  + d.count)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - cellWidth) + "px");
        })
        .on("mouseout", function(d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });
    });
  }

  function calculateXPos(paddingLeft, cellWidth, idx) {
    return paddingLeft + (cellWidth * 7 * (Math.floor(idx / 42))) + ((idx % 7) * cellWidth)
  }

  function calculateYPos(paddingTop, cellWidth, idx) {
    return paddingTop + cellWidth + (Math.floor((idx % 42) / 7) * cellWidth)
  }

  function dataItemIndexByDate(data, date) {
    for(var i = 0; i < data.length; i++) {
      if (data[i][0].getTime() === date.getTime()) return i;
    }

    return -1;
  }

  function createDateFilledArray(month, year) {
    var date = new Date(year, month, 1, 0, 0, 0, 0);

    var m = []

    while (date.getMonth() == month) {
      m.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return m;
  }

  // The idealTextColor and getRGBComponents functions was created by Vivin Paliath
  // source: http://stackoverflow.com/a/4726403
  function idealTextColor(bgColor) {

    var nThreshold = 105;
    var components = getRGBComponents(bgColor);
    var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
  }

  function getRGBComponents(color) {

    var r = color.substring(1, 3);
    var g = color.substring(3, 5);
    var b = color.substring(5, 7);

    return {
      R: parseInt(r, 16),
      G: parseInt(g, 16),
      B: parseInt(b, 16)
    };
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function() { return height };

  chart.date = function (value) {
    if (!arguments.length) return dateVal;
    dateVal = value;
    return chart;
  };

  chart.value = function (value) {
    if (!arguments.length) return numericVal;
    numericVal = value;
    return chart;
  };

  return chart;
}
