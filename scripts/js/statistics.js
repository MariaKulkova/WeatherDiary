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
        // Set up save button
        let drawButton = $(".draw-button");
        drawButton.on("click", (e) => {
            e.preventDefault();
            let startDate = new Date($("#range-start").val());
            startDate.setHours(0, 0, 0, 0);
            let endDate = new Date($("#range-end").val());
            endDate.setHours(0, 0, 0, 0);
            this.statManager.fetchCondition(startDate, endDate, (conditions, error) => {
                ChartsDraw.ChartsHelper.drawLineChart(ctx, startDate, endDate, conditions);
            });
        });
    }
}
//# sourceMappingURL=statistics.js.map