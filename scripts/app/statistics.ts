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
        
        let startDate = new Date(2017, 4, 1)
        console.log(startDate.toISOString())
        this.statManager.fetchCondition(startDate, (conditions: Kinvey.StatData[], error: string) => {
            ChartsDraw.ChartsHelper.drawLineChart(ctx, startDate, new Date(), conditions)
        })
    }
}