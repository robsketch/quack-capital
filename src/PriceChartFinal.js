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
            query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select last price,time by sym, time:5 xbar time.minute from trade where (time.date=.z.D) | (time.date=.z.D-1)',
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

        console.log('QUERY DATA')
        console.log(queryData)

        var dates = []
        let rawDates = queryData.result[0].data.y[0]

        console.log('rawDates')
        console.log(rawDates)

        for (let i = 0; i < rawDates.length; i++) {
            dates.push(new Date('2020-01-09T' + rawDates[i]))
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
        console.log('SERIES DATA')
        console.log(seriesData)

        this.setState({
            series: seriesData,

            options: {
                title: {
                    text: 'Stock Price over Time by sym',
                    align: 'left'
                },
                chart: {
                    
                    id: 'chart2',
                    type: 'line',
                    height: 1230,
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    },
                    zoom: {
                        tyoe:'x',
                        autoScaleYaxis: true
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
                    type: 'datetime'
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

            seriesLine: seriesData,
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
                        enabled: false
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
