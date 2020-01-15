import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ApexCharts from 'apexcharts';

function zip(a, b) {
    var arr = [];
    for (var key in a) arr.push([a[key], b[key]]);
    return arr;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
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
                    text: 'Stock Price over Time by sym',
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
                colors: ['#484041', '#E07A5F', '#3D405B', '#81B29A', '#011638', '#E6C229', '#F17105', '#D11149', '#6610F2', '#1A8FE3'],

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
                    title: 'Time'
                },
                yaxis: {
                    labels: {
                        formatter: function (val) {
                            if (val) {
                                return (val).toFixed(2);
                            }
                        },
                    },
                    title: 'Price'
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
                        enabled: true,
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
                                return (val).toFixed(2);
                            }
                        },
                    },
                }
            },


        };
        //this.getData(); // fetch rdb data
    }

    async getHDBData() {
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams2 = {
            query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select last price,time by time.date, sym, time:5 xbar time.minute from trade where (time.date>=.z.D-3)',
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
        console.log('HDB Query Result')
        console.log(queryData2)

        var dt = new Date()
        let dt0 = formatDate(dt.setDate(dt.getDate())) + "T"
        let dt1 = formatDate(dt.setDate(dt.getDate() - 1)) + "T"
        let dt2 = formatDate(dt.setDate(dt.getDate() - 1)) + "T"
        let dt3 = formatDate(dt.setDate(dt.getDate() - 1)) + "T"
        console.log(dt0, dt1, dt2, dt3)

        var dates = []
        let rawDates = queryData2.result[0].data.y[0]

        for (let i = 0; i < 288; i++) {
            dates.push(new Date(dt3 + rawDates[i]))
        }
        for (let i = 288; i < 576; i++) {
            dates.push(new Date(dt2 + rawDates[i]))
        }
        for (let i = 576; i < 864; i++) {
            dates.push(new Date(dt1 + rawDates[i]))
        }

        let seriesHDBData = []
        for (let i = 0; i < queryData2.result.length; i++) {

            var dataTest = []
            dataTest.push(zip(dates, queryData2.result[i].data.y[1]))
            seriesHDBData.push({
                name: queryData2.result[i].sym,
                type: 'line',
                data: dataTest[0]
            })
        }

        // this.setState({
        //     series: seriesHDBData,
        //     seriesLine: seriesHDBData,
        // })
    }

    async getData() {
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select last price,time by sym, time:1 xbar time.minute from trade where (time.date=.z.D)',
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

        console.log('RDB Query Result')
        console.log(queryData)

        //var testData = []
        // for (let i = 0; i < queryData2.result.length; i++) {
        //     queryData.result[i].data.y[0] = queryData2.result[i].data.y[0].concat(queryData.result[i].data.y[0])
        //     queryData.result[i].data.y[1] = queryData2.result[i].data.y[1].concat(queryData.result[i].data.y[1])
        // }
        // console.log('ConcatTest')
        // console.log(queryData)

        var dates = []
        let rawDates = queryData.result[0].data.y[0]

        console.log('rawDates')
        console.log(rawDates)

        var dt = new Date()
        let dt0 = formatDate(dt.setDate(dt.getDate())) + "T"

        for (let i = 0; i < rawDates.length; i++) {
            dates.push(new Date(dt0 + rawDates[i]))
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

        ApexCharts.exec('chart2', 'appendSeries', seriesData)
        // console.log('SERIES DATA')
        // console.log(seriesData)

        // this.setState({
        //     series: seriesData,
        //     seriesLine: seriesData,
        // })
    }

    // async getData2() {
    //     // Define url, kdb params and http params
    //     const url = 'https://localhost:8090/executeQuery'
    //     const kdbParams = {
    //         query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select last price,time:time by sym from trade where (time.date=.z.D)',
    //         response: true,
    //         type: 'sync'
    //     }
    //     const httpParams = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Basic '.concat(btoa('user:pass'))
    //         },
    //         body: JSON.stringify(kdbParams),
    //     }

    //     const response = await fetch(url, httpParams)
    //     const queryData = await response.json()

    //     console.log('REAL Query Result')
    //     console.log(queryData)

    //     var dates = []
    //     let rawDates = queryData.result[0].data.y[0]

    //     console.log('rawDates')
    //     console.log(rawDates)

    //     var dt = new Date()
    //     let dt0 = formatDate(dt.setDate(dt.getDate())) + "T"
    //     console.log(dt0)

    //     dates.push(new Date(dt0 + rawDates[0]))

    //     console.log('Dates')
    //     console.log(dates)

    //     let seriesData2 = []
    //     for (let i = 0; i < queryData.result.length; i++) {

    //         var dataTest = []
    //         dataTest.push(zip(dates, queryData.result[i].data.y[1]))
    //         seriesData2.push({
    //             name: queryData.result[i].sym,
    //             type: 'line',
    //             data: dataTest[0]
    //         })
    //     }
    //     // console.log('SERIES DATA')
    //     // console.log(seriesData)

    //     this.setState({
    //         series: seriesData2,
    //         seriesLine: seriesData2,
    //     })
    // }

    toggle(e) {
        ApexCharts.exec('seriesData', 'toggleSeries', e);
    }

    // Ensure data is loaded
    componentDidMount() {
        this.getHDBData()
        this.interval = setInterval(() => this.getData(), 10000)
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