import React from 'react'
import ReactApexChart from 'react-apexcharts'

function zip(a, b) {
    var arr = [];
    for (var key in a) arr.push([a[key], b[key]]);
    return arr;
}

class PriceChartFinal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                data: []
            }],
            options: {
                title: {
                    text: 'Historical Stock Price by Sym',
                    align: 'left',
                    style: {
                        fontSize: '23px',
                        color: '#011638'
                    },

                },
                chart: {

                    id: 'chart2',
                    type: 'line',
                    height: 1230,
                    zoom: {
                        type: 'x',
                        autoScaleYaxis: true,
                        enabled: true
                    }
                },
                colors: ['#1A8FE3', '#484041', '#E07A5F', '#3D405B', '#81B29A', '#011638', '#E6C229', '#F17105', '#D11149', '#6610F2'],

                stroke: {
                    width: 3
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    opacity: 1,
                },
                markers: {
                    size: 0
                },
                xaxis: {
                    type: 'datetime',
                    formatter: function (val) {
                        if (val) {
                            let x = new Date(val)
                            var moment = require('moment')
                            return moment(x).format('Do MMM')
                            // return x.getDate().toString() + '-' + (x.getMonth() + 1).toString() + '-' + x.getFullYear().toString();
                        }
                        //return (val / 10000).toFixed(0);
                    },
                },
                yaxis: {
                    labels: {
                        formatter: function (val) {
                            if (val) {
                                return (val).toFixed(2);
                            }
                        },
                    },
                }
            },

            seriesLine: [{
                data: []
            }],
            optionsLine: {
                chart: {
                    id: 'chart1',
                    height: 130,
                    type: 'area',
                    brush: {
                        target: 'chart2',
                        enabled: true
                    },
                    selection: {
                        enabled: true,
                    },
                },
                legend: {
                    show: false
                },

                colors: ['#484041', '#E07A5F', '#3D405B', '#81B29A', '#011638', '#E6C229', '#F17105', '#D11149', '#6610F2', '#1A8FE3'],

                fill: {
                    type: 'gradient',
                    gradient: {
                        opacityFrom: 0.91,
                        opacityTo: 0.1,
                    }
                },
                xaxis: {
                    type: 'datetime',
                    tooltip: {
                        enabled: false,
                        theme: {
                            monochrome: {
                                enabled: true,
                                color: '#255aee',
                                shadeTo: 'light',
                                shadeIntensity: 0.65
                            }
                        }

                    }

                },
                yaxis: {
                    tickAmount: 2,
                    labels: {
                        formatter: function (val) {
                            if (val) {
                                return (val).toFixed(0);
                            }
                        },
                    },
                },
            },

            


        };
        this.getData(); // fetch rdb data
    }



    async getData() {
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select last price,time by sym, time:15 xbar time.minute from trade where (time.date=.z.D)',
            response: true,
            type: 'sync'
        }
        const httpParams = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '.concat(btoa('user:pass'))
            },
            body: JSON.stringify(kdbParams),
        }

        const response = await fetch(url, httpParams)
        const queryData = await response.json()


        const kdbParams2 = {
            query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select last price,time by time.date, sym, time:15 xbar time.minute from trade where (time.date>=.z.D-3)',
            response: true,
            type: 'sync'
        }
        const httpParams2 = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '.concat(btoa('user:pass'))
            },
            body: JSON.stringify(kdbParams2),
        }

        const response2 = await fetch(url, httpParams2)
        const queryData2 = await response2.json()
        // console.log('HDB Query Result')
        // console.log(queryData2)

        // console.log('RDB Query Result')
        // console.log(queryData)

        //var testData = []
        for (let i = 0; i < queryData2.result.length; i++) {
            queryData.result[i].data.y[0] = queryData2.result[i].data.y[0].concat(queryData.result[i].data.y[0])
            queryData.result[i].data.y[1] = queryData2.result[i].data.y[1].concat(queryData.result[i].data.y[1])
        }
        // console.log('ConcatTest')
        // console.log(queryData)

        var dates = []
        let rawDates = queryData.result[0].data.y[0]

        var moment = require('moment')

        for (let i = 0; i < 96; i++) {
            dates.push(new Date((moment().subtract(3, 'day').format('YYYY-MM-DD') + "T") + rawDates[i]))
        }
        for (let i = 96; i < 192; i++) {
            dates.push(new Date((moment().subtract(2, 'day').format('YYYY-MM-DD') + "T") + rawDates[i]))
        }
        for (let i = 192; i < 288; i++) {
            dates.push(new Date((moment().subtract(1, 'day').format('YYYY-MM-DD') + "T") + rawDates[i]))
        }
        for (let i = 288; i < rawDates.length; i++) {
            dates.push(new Date((moment().format('YYYY-MM-DD') + "T") + rawDates[i]))
        }

        let seriesData = []
        for (let i = 0; i < queryData.result.length; i++) {

            var dataTest = []
            dataTest.push(zip(dates, queryData.result[i].data.y[1]))
            seriesData.push({
                name: queryData.result[i].sym,
                type: 'line',
                data: dataTest[0]
            })
        }
        // console.log('SERIES DATA')
        // console.log(seriesData)

        this.setState({
            series: seriesData,
            seriesLine: seriesData,
        })
    }

    // Ensure data is loaded
    componentDidMount() {
        this.getData()
    }

    render() {
        return (
            <div id="wrapper">
                <div id="chart-line2">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={530} />
                </div>
                <div id="chart-line">
                    <ReactApexChart options={this.state.optionsLine} series={this.state.seriesLine} type="area" height={200} />
                </div>
            </div>
        );
    }
}

export default PriceChartFinal