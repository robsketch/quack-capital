import React from 'react'
// import Chart from 'react-apexcharts'
import ReactApexChart from 'react-apexcharts'

class VolumeChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [],
            options: {
                chart: {
                    height: 350,
                    type: 'radialBar',
                },
                plotOptions: {
                    radialBar: {
                        offsetY: 0,
                        startAngle: 0,
                        endAngle: 270,
                        hollow: {
                            margin: 5,
                            size: '30%',
                            background: 'transparent',
                            image: undefined,
                        },
                        dataLabels: {
                            name: {
                                show: false,
                            },
                            value: {
                                show: false,
                            }
                        }
                    }
                },
                colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5', '#1ab7ea', '#0084ff', '#39539E', '#0077B5', '#0084ff', '#39539E', '#0077B5'],
                labels: [],
                legend: {
                    show: true,
                    floating: true,
                    fontSize: '16px',
                    position: 'left',
                    offsetX: 160,
                    offsetY: 10,
                    labels: {
                        useSeriesColors: true,
                    },
                    markers: {
                        size: 0
                    },
                    formatter: function (seriesName, opts) {
                        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
                    },
                    itemMargin: {
                        horizontal: 3,
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            show: false
                        }
                    }
                }]
            },


        };
        this.getData()
    }

    async getData() {
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            query: 'select Volume:sum size by sym from trade where time.date=.z.D',
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
        console.log('data returned')
        console.log(queryData)
        console.log(queryData.result)
        let volumeSeries = []
        let volumeLabels = []
        let volumeScaled = []

        for (let i = 0; i < queryData.result.length; i++) {
            volumeSeries.push(queryData.result[i].Volume)
            volumeLabels.push(queryData.result[i].sym)
        }

        let maxVolume = Math.max(...volumeSeries)

        for (let i = 0; i < queryData.result.length; i++) {
            volumeScaled.push(volumeSeries[i] / maxVolume)
        }

        console.log('-------------------')
        console.log(volumeLabels)
        console.log(volumeSeries)
        console.log(volumeScaled)
        console.log('-------------------')

        this.setState({
            series: volumeScaled,
            labels: volumeLabels
        })
    }

    // Ensure data is loaded
    componentDidMount() {
        this.interval = setInterval(() => this.getData(), 10000000)
    }

    render() {
        // if (!Object.keys(this.state.data).length) { return <div>Loading graph...</div> }
        const data = this.state.series
        console.log(data)

        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} labels={this.state.labels} type="radialBar" height={350} />
            </div>
        );
    }
}


export default VolumeChart