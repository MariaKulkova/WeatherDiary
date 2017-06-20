/// <reference path="./KinveyStat.ts"/>
var ChartsDraw;
(function (ChartsDraw) {
    class ChartsHelper {
        static drawLineChart(context, startDate, endDate, data) {
            let labels = data ? this.dateLabelsForRange(startDate, endDate) : [];
            let values = data ? this.chartValuesForRange(data, startDate, endDate) : [];
            var chart = new Chart(context, {
                // The type of chart we want to create
                type: 'line',
                // The data for our dataset
                data: {
                    labels: labels,
                    datasets: [{
                            label: "My dataset",
                            backgroundColor: 'rgba(173, 207, 45, 0.3)',
                            borderColor: 'rgb(173, 207, 45)',
                            data: values,
                        }],
                },
                // Configuration options go here
                options: {
                    maintainAspectRatio: false,
                    legend: {
                        display: false,
                    }
                }
            });
        }
        // Data processing
        static dateLabelsForRange(startDate, endDate) {
            let labels = [];
            for (let tempDate = new Date(startDate); tempDate <= endDate; tempDate = this.addDaysToDate(tempDate, 1)) {
                labels.push(this.formattedStringFromDate(tempDate));
            }
            return labels;
        }
        static chartValuesForRange(rawValues, startDate, endDate) {
            let values = [];
            for (let tempDate = new Date(startDate); tempDate <= endDate; tempDate = this.addDaysToDate(tempDate, 1)) {
                let item = rawValues.find(obj => obj.date.valueOf() == tempDate.valueOf());
                console.log(item);
                if (item) {
                    values.push(item.value);
                }
                else {
                    values.push(0);
                }
            }
            return values;
        }
        static addDaysToDate(date, days) {
            let newDate = new Date(date);
            newDate.setDate(date.getDate() + days);
            return newDate;
        }
        static formattedStringFromDate(date) {
            let formattedString = ('0' + date.getDate()).slice(-2) + '.' +
                ('0' + (date.getMonth() + 1)).slice(-2) + '.' +
                date.getFullYear();
            return formattedString;
        }
    }
    ChartsDraw.ChartsHelper = ChartsHelper;
})(ChartsDraw || (ChartsDraw = {}));
//# sourceMappingURL=chartsDrawer.js.map