/// <reference path="../typings/jquery.d.ts"/>
// class ChartData implements LinearChartData {
//     labels: string[]
//     datasets: CustomChartDataSet[]
// }
// class CustomChartDataSet implements ChartDataSet {
//     label: string
//     fillColor: string
//     strokeColor: string
//     data: number[]
// }
class Statistcis {
    render() {
        let canvas = $("#myChart");
        var ctx = canvas[0].getContext("2d");
        console.log(ctx);
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                        label: "My First dataset",
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: [0, 10, 5, 2, 20, 30, 45],
                    }]
            },
            // Configuration options go here
            options: {}
        });
    }
}
//# sourceMappingURL=statistics.js.map