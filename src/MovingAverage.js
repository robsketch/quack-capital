import React from 'react'
import ReactApexChart from 'react-apexcharts'

function zip(a, b) {
    var arr = [];
    for (var key in a) arr.push([a[key], b[key]]);
    return arr;
}

class MovingAverage extends React.Component {
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
                    text: 'Stock Price Running Average',
                    align: 'left'
                },
                grid: {
                    row: {
                        // colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
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
                      text: 'Price'
                    },
                  },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function(val) {
                            if (val) {
                            let x = new Date(val)
                            // return x.getHours().toString() + ':' + x.getMinutes();
                            return x.toLocaleTimeString();
                            }
                            //return (val / 10000).toFixed(0);
                        },
                    },
                    title: {
                        text: 'Time'
                    },
                    axisBorder:{
                        // color: "#333"
                    }
                },
                tooltip: {
                    // theme: 'dark',
                }

            },


        };
        this.getData();
    }

    async getData() {
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            query: '{[x] key[x]!([]data:flip each value x)}select `time$time,avgs price by sym from select avg price by (5 * 60000000000) xbar time,sym  from trade where(time.date=.z.D)',
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

        console.log('queryData')
        console.log(queryData)

        var dates = []
        let rawDates = queryData.result[0].data.y[0]

        console.log('rawDates')
        console.log(rawDates)

        for (let i = 0; i < rawDates.length; i++) {
            dates.push(new Date(rawDates[i]))
        }

        // var seriesData = []
        var dates = []
        for (let i = 0; i < queryData.result[0].data.y[0].length; i++) {
            dates.push(new Date('2020-01-09T' + queryData.result[0].data.y[0][i]));
        }

        let seriesData = []

        for (let i = 0; i < queryData.result.length; i++) {

            var dataTest = []
            dataTest.push(zip(dates,queryData.result[i].data.y[1]))
            seriesData.push({
                name: queryData.result[i].sym,
                type: 'line',
                data: dataTest[0]
            })
        }

        this.setState({
            series: seriesData,

            options: {
                chart: {
                    // foreColor: '#fff',
                    // foreColor: '#fff',
                    height: 1000,
                    type: 'line',
                    zoom: {
                        enabled: true
                    }
                },
                colors:['#484041', '#E07A5F', '#3D405B', '#81B29A', '#011638', '#E6C229', '#F17105', '#D11149', '#6610F2', '#1A8FE3'],
            },
            grid: {

                // borderColor: "#40475D",

            },
        
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

export default MovingAverage
