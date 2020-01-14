import React from 'react'
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
                    height: 1000,
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
        this.interval = setInterval(() => this.getData(), 10000000)
    }

    async getData() {
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            query: '{[x] key[x]!([]data:flip each value x)}select t, x by sym from select x: sqrt var price by t: time.date, sym from trade where time.date >= .z.D - 30',
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

        // Make an array of the dates that will be plotted on the x-axis.
        var dates = []
        let rawDates = queryData.result[0].data.y[0]

        for (let i = 0; i < rawDates.length; i++) {
            dates.push(new Date(rawDates[i]))
        }

        let seriesData = []
        var dataArray = queryData.result;
        for (let i = 0; i < dataArray.length; i++) {

            var dataTest = []
            dataTest.push(zip(dates,dataArray[i].data.y[1]))
            seriesData.push({
                name: dataArray[i].sym,
                type: 'line',
                data: dataTest[0]
            })
        }

        function zip(a, b) {
        var arr = [];
        for (var key in a) arr.push([a[key], b[key]]);
        return arr;

        
        }

        this.setState({
            series: seriesData,

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
                colors: ['#484041', '#E07A5F', '#3D405B', '#81B29A', '#011638', '#E6C229', '#F17105', '#D11149', '#6610F2', '#1A8FE3'],

                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width:3,
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
                            return x.getFullYear().toString() + '-' + (x.getMonth()+1).toString() + '-' + x.getDate().toString();
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
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={550} />
            </div>


        );
    }
}

export default Volatility