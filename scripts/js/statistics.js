/// <reference path="../typings/jquery.d.ts"/>
class ChartDataSet {
}
class ChartData {
}
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
                        backgroundColor: 'rgba(173, 207, 45, 0.3)',
                        borderColor: 'rgb(173, 207, 45)',
                        data: [10, 50, 30, 10, 20, 50, 20],
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
}
//# sourceMappingURL=statistics.js.map