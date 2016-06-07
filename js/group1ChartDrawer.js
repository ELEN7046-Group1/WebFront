/// <reference path="../Scripts/d3/d3.js" />
(function (window) {
    var group1ChartDrawer = {version: "0.0.0.1"};

    var barChart = {data: []};

    var heatMapColorArray = ['#000000', '#0000FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000', '#FFFFFF'];

    function BarChart(elemId, width, height, title, dataSet) {
        width = Math.abs(width);
        height = Math.abs(height);

        var smallestDimension = d3.min([width, height], function (d) {
            return d;
        });

        // set local scope properties
        this.title = (title || "").toString().replace(/(^\s+|\s+$)/g, ""); // sets the title to an empty string if not supplied and trims the text;
        this.data = dataSet;
        this.targetId = elemId;
        this.paddingForAxis = Math.floor(smallestDimension * 0.166);
        this.chartWidth = width - (2 * this.paddingForAxis);
        this.chartHeight = height - ((this.title === "" ? 1.5 : 2) * this.paddingForAxis);

        // make object accessible to itself
        var me = this;

        // _draw: draws the chart
        function _draw() {
            // get the minimum and maximum values 
            var minVal = d3.min(me.data, function (d) {
                return d.DayTotal;
            });
            var maxVal = d3.max(me.data, function (d) {
                return d.DayTotal;
            });

            // get the minimum and maximum keys
            var minDate = d3.min(me.data, function (d) {
                return new Date(d.Date);
            });
            var maxDate = d3.max(me.data, function (d) {
                return new Date(d.Date);
            });

            // calculate the cell width to to fit all the values in the chart
            var cellWidth = me.chartWidth / me.data.length;

            // the number of bars drawn by calculating it from the cell width and cartWidth. It is done this way so that the x-axis matches up to the total bar width
            var barCount = me.chartWidth / cellWidth;

            // scale function for fitting the data values into the available height for the chart
            var yScale = d3.scale.linear().domain([minVal, maxVal]).range([0, parseFloat(me.chartHeight)]);

            // scale function for creating the x-axis
            var xScale = d3.scale.linear().domain([0, parseFloat(barCount)]).range([0, parseFloat(me.chartWidth)]);

            var colorMap = d3.scale.linear().domain(d3.range(0, 1, 1.0 / (heatMapColorArray.length - 1))).range(heatMapColorArray);

            var colorScale = d3.scale.linear().domain([minVal, maxVal]).range([0,1]);

            // calculate the font size relative to the smallest dimension of the chart
            var fontSize = Math.floor(smallestDimension / 25);

            // add the containing SVG element
            var svg = d3.select(elemId)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            // append the bars to the SVG
            svg.selectAll("*")
                .data(me.data)
                .enter()
                .append("rect")
                .attr("width", cellWidth)
                .attr("height", function (d) {
                    return yScale(d.DayTotal);
                })
                .attr("x", function (d, i) {
                    return me.paddingForAxis + fontSize + (i * cellWidth);
                })
                .attr("y", function (d) {
                    return (me.paddingForAxis / 2) + me.chartHeight - yScale(d.DayTotal);
                })
                .attr("fill", function (d) {
                    return d3.rgb(colorMap(colorScale(d.DayTotal)));
                })
                //.attr("class", "barColor1")
                .append("title")
                .text(function (d) { return d3.rgb(colorMap(colorScale(d.DayTotal))); });

            // create the y-axis
            var yAxisScale = d3.scale.linear().domain([minVal, maxVal]).range([parseFloat(me.chartHeight), 0]);

            var yAxis = d3.svg.axis().scale(yAxisScale).orient("left").tickSize(fontSize / 2); //.ticks((maxVal - minVal) / 100);

            // append the y-axis to the chart
            svg.append("g")
                .attr("transform", "translate(" + (parseFloat(me.paddingForAxis) + parseFloat(fontSize)) + ", " + (me.paddingForAxis / 2) + ")")
                .attr("class", "chartAxis")
                .attr("fill", "none")
                .attr("font-size", fontSize + "px")
                .call(yAxis);

            // create the x-axis
            var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(fontSize / 2).ticks(barCount);

            // append the x-axis to the chart
            svg.append("g")
                .attr("transform", "translate(" + (me.paddingForAxis + fontSize) + ", " + ((me.paddingForAxis / 2) + me.chartHeight) + ")")
                .attr("class", "chartAxis").attr("fill", "none")
                .attr("font-size", fontSize + "px")
                .call(xAxis);

            // add the title to the chart if one was supplied
            if (!(me.title === "")) {
                svg.append("g")
                    .attr("transform", "translate(" + (width / 2) + ", " + (height - me.paddingForAxis + (fontSize * 2.5) + ")"))
                    .attr("font-size", fontSize * 2 + "px")
                    .append("text")
                    .style("text-anchor", "middle")
                    .attr("fill", "#FFFFFF")
                    .text(me.title);
            }
        }

        _draw();
    }

    function CalendarHeatmap(elemId, width, height, dataSet) {
        width = Math.abs(width);
        height = Math.abs(height);

        this.data = dataSet;
        this.targetId = elemId;

        var me = this;

        var dayAbbreviations = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];


        function _draw() {
            var svg = d3.select(me.targetId)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            _fillMonthArr(new Date(2016, 4, 1), svg);

        }

        function _fillMonthArr(date, svg) {
            var startDate = new Date(date.getFullYear(), date.getMonth(), 1);

            var i = 0;
            var dayArr = new Array();
            var day = startDate.DayOfWeek;

            dayArr.push(day);

            while (day != 0) {
                startDate.addDays(-1);

                day = startDate.DayOfWeek;

                dayArr.push(day);

                if (i > 6) break;

                i++;
            }

            //var dateArr = new Array();
            //dateArr[0] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

            svg.selectAll("*")
                .data(dayArr)
                .enter()
                .append("g")
                .attr("transform", function (d, i) {
                    return "translate(5, " + ((i * 20) + 9) + ")"
                })
                .append("text")
                .attr("font-family", "Verdana")
                .attr("font-size", "9px")
                .attr("fill", "rgb(255,255,255)")
                .attr("stroke", "none")
                .text(startDate);

        }

        Date.prototype.DayOfWeek = function (firstDay) {

            var day = date.getDay();
            return day - 1 > 0 ? day - 1 : 6;
        }

        Date.prototype.addDays = function (days) {
            this.setDate(this.getDate() + days);
        }

        _draw();
    }

    group1ChartDrawer.BarChart = function (targetElemId, width, height, title, data) {
        return new BarChart(targetElemId, width, height, title, data);
    };
    group1ChartDrawer.CalendarHeatmap = function (targetElemId, width, height, data) {
        return new CalendarHeatmap(targetElemId, width, height, data);
    };

    window.group1ChartDrawer = group1ChartDrawer;

})(window);
