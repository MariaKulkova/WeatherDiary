/// <reference path="../typings/jquery.d.ts"/>
/// <reference path="./KinveyStat.ts"/>
/// <reference path="./chartsDrawer.ts"/>
class ChartDataSet {
}
class ChartData {
}
class Statistcis {
    constructor(manager) {
        this.statManager = manager;
    }
    render() {
        let canvas = $("#myChart");
        var ctx = canvas[0].getContext("2d");
        ChartsDraw.ChartsHelper.drawLineChart(ctx, new Date(), new Date());
        let startDate = new Date(2017, 4, 1);
        console.log(startDate.toISOString());
        this.statManager.fetchCondition(startDate, (conditions, error) => {
            ChartsDraw.ChartsHelper.drawLineChart(ctx, startDate, new Date(), conditions);
        });
    }
}
//# sourceMappingURL=statistics.js.map