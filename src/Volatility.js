import React from 'react'
import ReactApexChart from 'react-apexcharts'

function zip(a, b) {
    var arr = [];
    for (var key in a) arr.push([a[key], b[key]]);
    return arr;
}

class Volatility extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                name: "",
                data: []
            }],
            options: {
                chart: {
                    height: 1000,
                    type: 'line',
                    zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: true
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 3,
                    curve: 'straight'
                },
                title: {
                    text: 'Price Volatility by Sym',
                    align: 'left',
                    style: {
                        fontSize:  '23px',
                        color:  '#011638'
                      },
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
                        formatter: function (val) {
                            if (val) {
                                let x = new Date(val)
                                return x.getDate().toString() + '-' + (x.getMonth() + 1).toString() + '-' + x.getFullYear().toString();
                            }
                            //return (val / 10000).toFixed(0);
                        },
                    },
                    title: {
                        text: 'Date'
                    },
                    categories: [],
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
                },
                colors: ['#484041', '#E07A5F', '#3D405B', '#81B29A', '#011638', '#E6C229', '#F17105', '#D11149', '#6610F2', '#1A8FE3'],
            },
            colors: ['#484041', '#E07A5F', '#3D405B', '#81B29A', '#011638', '#E6C229', '#F17105', '#D11149', '#6610F2', '#1A8FE3'],
        };
        this.getData();
    }

    async getData() {
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            query: '{[x] key[x]!([]data:flip each value x)}select t, x by sym from select x: sqrt var price by t: time.date, sym from trade where time.date= .z.D',
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

        const kdbParams2 = {
            query: '{[x] key[x]!([]data:flip each value x)}select t, x by sym from select x: sqrt var price by t: time.date, sym from trade where time.date >= .z.D - 30',
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

        // Fetch data from server
        const response2 = await fetch(url, httpParams2)
        const queryData2 = await response2.json()
        console.log('HDB Query Result')
        console.log(queryData2)

        console.log('RDB Query Result')
        console.log(queryData)

        for (let i = 0; i < queryData.result.length; i++) {
            queryData.result[i].data.y[0] = queryData2.result[i].data.y[0].concat(queryData.result[i].data.y[0])
            queryData.result[i].data.y[1] = queryData2.result[i].data.y[1].concat(queryData.result[i].data.y[1])
        }
        console.log('ConcatTest')
        console.log(queryData)

        // Make an array of the dates that will be plotted on the x-axis.
        var dates = []
        let rawDates = queryData.result[0].data.y[0]

        for (let i = 0; i < rawDates.length; i++) {
            dates.push(new Date(rawDates[i]))
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

        this.setState({
            series: seriesData,
        })
    }

    // Ensure data is loaded
    componentDidMount() {
        this.interval = setInterval(() => this.getData(), 10000000)
    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={550} />
            </div>
        );
    }
}

export default Volatility