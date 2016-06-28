'use strict';

/* exported barChart */

function barChart() {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 800,
    height = 400,
    xValue = function (d) {
      return d[0];
    },
    yValue = function (d) {
      return d[1];
    },
    xScale = d3.scale.linear(),
    yScale = d3.scale.linear(),
    barColor = '#FF0000',
    barTitleText = function (d) {
      return d[0] + ' : ' + d[1];
    };

  function chart(selection) {
    selection.each(function (data) {
      data = data.map(function (d) {
        return [xValue.call(data, d), yValue.call(data, d)];
      });

      var chartWidth = width - margin.left - margin.right;
      var chartHeight = height - margin.top - margin.bottom;
      var smallestDimension = d3.min([width, height], function (d) {
        return d;
      });

      // get the minimum and maximum Y values
      var minY = d3.min(data, function (d) {
        return d[1];
      });

      var maxY = d3.max(data, function (d) {
        return d[1];
      });

      // get the minimum and maximum X values
      var minX = d3.min(data, function (d) {
        return new Date(d[0]);
      });

      var maxX = d3.max(data, function (d) {
        return new Date(d[0]);
      });

      // calculate the cell width to to fit all the values in the chart
      var barWidth = chartWidth / data.length;
      // var barPadding = Math.ceil(barWidth * 0.1);
      // var barInnerWidth = barWidth - (2 * barPadding);

      // scale function for fitting the data values into the available height for the chart
      yScale.domain([minY, maxY]).range([parseFloat(chartHeight), 0]);

      // scale function for creating the x-axis
      xScale.domain([minX, maxX]).range([0, chartWidth]);

      // calculate the font size relative to the smallest dimension of the chart
      var fontSize = Math.floor(smallestDimension / 30);

      // add the containing SVG element
      var svg = d3.select(this)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // append the bars to the SVG
      var groups = svg.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + (margin.left + (i * barWidth)) + ',0)';
        });

      groups.append('rect')
        .attr('width', barWidth * 0.9)
        .attr('height', function (d) {
          return chartHeight - yScale(d[1]);
        })
        .attr('y', function (d) {
          return margin.top + yScale(d[1]);
        })
        .attr('fill', barColor);

      // create the y-axis
      var yAxis = d3.svg.axis().scale(yScale).orient('left').tickSize(fontSize / 2);

      // append the y-axis to the chart
      svg.append('g')
        .attr('transform', 'translate(' + (margin.left) + ', ' + margin.top + ')')
        .attr('class', 'chartAxis')
        .attr('fill', 'none')
        .attr('font-size', fontSize + 'px')
        .call(yAxis);

      // create the x-axis
      var xAxis = d3.svg.axis().scale(xScale).orient('bottom').tickSize(fontSize / 2);

      // append the x-axis to the chart
      svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + (margin.top + chartHeight) + ')')
        .attr('class', 'chartAxis').attr('fill', 'none')
        .attr('font-size', fontSize + 'px')
        .call(xAxis);
    });
  }

  chart.margin = function (val) {
    if (!arguments.length) {
      return margin;
    }
    margin = val;
    return chart;
  };

  chart.width = function (val) {
    if (!arguments.length) {
      return width;
    }
    width = val;
    return chart;
  };

  chart.height = function (val) {
    if (!arguments.length) {
      return height;
    }
    height = val;
    return chart;
  };

  chart.x = function (val) {
    if (!arguments.length) {
      return xValue;
    }
    xValue = val;
    return chart;
  };

  chart.y = function (val) {
    if (!arguments.length) {
      return yValue;
    }
    yValue = val;
    return chart;
  };

  chart.xScale = function (val) {
    if (!arguments.length) {
      return xScale;
    }
    xScale = val;
    return chart;
  };

  chart.yScale = function (val) {
    if (!arguments.length) {
      return yScale;
    }
    yScale = val;
    return chart;
  };

  chart.barColor = function (val) {
    if (!arguments.length) {
      return barColor;
    }
    barColor = val;
    return chart;
  };

  chart.barTitleText = function (val) {
    if (!arguments.length) {
      return barTitleText;
    }
    barTitleText = val;
    return chart;
  };

  return chart;
}
