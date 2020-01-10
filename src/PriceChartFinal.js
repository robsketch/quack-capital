import React from 'react'
// import Chart from 'react-apexcharts'
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
                chart: {
                    id: 'chart2',
                    type: 'line',
                    height: 230,
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    }
                },
                colors: ['#546E7A'],
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
                    type: 'datetime'
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
                        xaxis: {
                            min: new Date('19 Jun 2017').getTime(),
                            max: new Date('14 Aug 2017').getTime()
                        }
                    },
                },
                colors: ['#008FFB'],
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
                        enabled: false
                    }
                },
                yaxis: {
                    tickAmount: 2
                }
            },


        };
        this.getData();
    }

    async getData() {
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            //query: '{[x] key[x]!([]data:flip each value x)}select `time$time,avgs price by sym from trade where(time.date=.z.D), sym=`AAPL',
            query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select last price,time by sym, time:5 xbar time.minute from trade where (time.date=.z.D)',
            //query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select avg price by (60000000000) xbar time,sym  from trade where(time.time>.z.T-`minute$100), sym=`GOOG',

            //query: 'select[10] time from trade',
            //query: 'select time, price by sym from 0!select avg price by (5 * 60000000000) xbar time, sym from trade where sym=`GOOG, ',
            //query: '0!select avg price by (5 * 60000000000) xbar time, sym from trade where sym=`GOOG',
            //query: 'select minute,price by sym from select avg price by sym, 10 xbar time.minute from trade where (sym in `AAPL`GOOG)',
            //query: 'select time,avgs price by sym from trade where (i<1000),(sym=`AAPL)',
            // (5 * 60000000000) xbar a - how to xbar timestamps
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


        // Getting the dates in order


        // Fetch data from server
        const response = await fetch(url, httpParams)
        const queryData = await response.json()

        var dates = []
        console.log('QUERY DATA')
        console.log(queryData)
        let rawTimes = queryData.result[0].data.y[0]
       
        for (let i = 0; i < rawTimes.length; i++) {
             dates.push(new Date(rawTimes[i]))
         }

        let seriesData = []
         for (let i = 0; i < queryData.result[0].data.y[0].length; i++) {
             let x = queryData.result[0].data.y[0][i];
             seriesData.push([
                 x,
                 queryData.result[0].data.y[1][i]
             ])
         }
        console.log('SERIES DATA')
        console.log(seriesData)

        this.setState({
            series: seriesData,

            options: {
                chart: {
                    id: 'chart2',
                    type: 'line',
                    height: 230,
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    }
                },
                colors: ['#546E7A'],
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
                    type: 'datetime'
                }
            },

                

            }

        )
    }


    // Ensure data is loaded
    componentDidMount() {
        //this.getData()
        this.interval = setInterval(() => this.getData(), 10000000)
    }



    render() {
        return (


            <div id="wrapper">
                <div id="chart-line2">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={230} />
                </div>
                <div id="chart-line">
                    <ReactApexChart options={this.state.optionsLine} series={this.state.seriesLine} type="area" height={130} />
                </div>
            </div>


        );
    }
}

export default PriceChartFinal
