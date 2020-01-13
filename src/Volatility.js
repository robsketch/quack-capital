import React from 'react'
// import Chart from 'react-apexcharts'
import ReactApexChart from 'react-apexcharts'

class Volatility extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                name: "Desktops",
                data: []
            }],
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: true
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Product Trends by Month',
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: [],
                }
            },

        };
        this.getData();
    }

    // Ensure data is loaded
    componentDidMount() {
        //this.getData()
        this.interval = setInterval(() => this.getData(), 10000000)
    }

    async getData() {
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            // Temporary static query
            // TODO: Fix this so that it can have more than one sym and variable number of days.
            query: '{[x] key[x]!([]data:flip each value x)}select t, x by sym from select x: sqrt var price by t: time.date, sym from trade where time.date >= .z.D - 30',
            //query: '{[x] key[x]!([]data:flip each value x)}select t, x by sym from select x: sqrt var price by t: time.date, sym from trade where time.date >= .z.D - 20',
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

        // Fetch data from server
        const response = await fetch(url, httpParams)
        const queryData = await response.json()
        console.log('Volatility')
        console.log(queryData)

        // Make an array of the dates that will be plotted on the x-axis.
        var dates = []
        let rawDates = queryData.result[0].data.y[0]

        console.log('rawDates')
        console.log(rawDates)

        for (let i = 0; i < rawDates.length; i++) {
            dates.push(new Date(rawDates[i]))
        }

        console.log('Dates')
        console.log(dates)
        
        console.log("queryData")
        console.log(queryData)

        let seriesData = []
        var dataArray = queryData.result;
        for (let i = 0; i < dataArray.length; i++) {

            var dataTest = []
            dataTest.push(zip(dates,dataArray[i].data.y[1]))
            seriesData.push({
                name: dataArray[i].sym,
                type: 'line',
                // data: [dataArray[i].data.y[0],dataArray[i].data.y[1]]
                data: dataTest[0]
            })
        }
        console.log('DataTest')
        console.log(dataTest)

        console.log('SeriesData vol')
        console.log(seriesData)

        function zip(a, b) {
        var arr = [];
        for (var key in a) arr.push([a[key], b[key]]);
        return arr;

        
        }

        this.setState({
            series: seriesData,

            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: true
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Price volatility by sym',
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function(val) {
                            if (val) {
                            let x = new Date(val)
                            return x;
                            }
                            //return (val / 10000).toFixed(0);
                        },
                    },
                    title: {
                        text: 'Time'
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
                    title: {
                        text: 'Volatility'
                    },
                }
            }
        })
    }



    render() {
        return (


            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>


        );
    }
}

export default Volatility