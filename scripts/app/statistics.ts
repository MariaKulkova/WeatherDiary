declare var Chart: any; 
/// <reference path="../typings/jquery.d.ts"/>
/// <reference path="./KinveyStat.ts"/>
/// <reference path="./chartsDrawer.ts"/>

class ChartDataSet {
    label: string
    fillColor: string
    strokeColor: string
    data: number[]
}

class ChartData {
    labels: string[]
    datasets: ChartDataSet[]
}

class Statistcis {
    public statManager: Kinvey.StatisticsManager

    constructor(manager: Kinvey.StatisticsManager) {
        this.statManager = manager
    }

    render() {
        let canvas: any = $("#myChart")
        var ctx = canvas[0].getContext("2d")
        ChartsDraw.ChartsHelper.drawLineChart(ctx, new Date(), new Date())
        
        // Set up save button
        let drawButton = $(".draw-button")
        drawButton.on("click", (e: BaseJQueryEventObject) => {
            e.preventDefault()
            let startDate = new Date($("#range-start").val())
            startDate.setHours(0, 0, 0, 0)
            let endDate = new Date($("#range-end").val())
            endDate.setHours(0, 0, 0, 0)
            this.statManager.fetchCondition(startDate, endDate, (conditions: Kinvey.StatData[], error: string) => {
                ChartsDraw.ChartsHelper.drawLineChart(ctx, startDate, endDate, conditions)
            })
        })
    }
}