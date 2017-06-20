/// <reference path="./KinveyStat.ts"/>

namespace ChartsDraw {

    export class ChartsHelper {

        public static drawLineChart(context: CanvasRenderingContext2D, 
                                    startDate: Date, 
                                    endDate: Date, 
                                    data?: Kinvey.StatData[]) {
            let labels = data ? this.dateLabelsForRange(startDate, endDate) : []
            let values = data ? this.chartValuesForRange(data, startDate, endDate) : []
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

        public static dateLabelsForRange(startDate: Date, endDate: Date): string[] {
            let labels: string[] = []
            for (let tempDate = new Date(startDate); tempDate <= endDate; tempDate = this.addDaysToDate(tempDate, 1)) {
                labels.push(this.formattedStringFromDate(tempDate))
            }
            return labels
        }

        public static chartValuesForRange(rawValues: Kinvey.StatData[], startDate: Date, endDate: Date): number[] {
            let values: number[] = []
            for (let tempDate = new Date(startDate); tempDate <= endDate; tempDate = this.addDaysToDate(tempDate, 1)) {
                let item = rawValues.find(obj => obj.date.valueOf() == tempDate.valueOf())
                 console.log(item)
                if (item) {
                    values.push(item.value)
                }
                else {
                    values.push(0)
                }
            }
            return values
        }

        private static addDaysToDate(date: Date, days: number): Date {
            let newDate = new Date(date)
            newDate.setDate(date.getDate() + days)
            return newDate
        }

        private static formattedStringFromDate(date: Date): string {
            let formattedString = ('0' + date.getDate()).slice(-2) + '.' + 
                                ('0' + (date.getMonth()+1)).slice(-2) + '.' +
                                date.getFullYear()
            return formattedString
        }
    }
}