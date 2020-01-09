import React from 'react'
// import Chart from 'react-apexcharts'
import ReactApexChart from 'react-apexcharts'

function zip(a, b) {
    var arr = [];
    for (var key in a) arr.push([a[key], b[key]]);
    return arr;
}

class PriceChart2 extends React.Component {
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
                    type: 'datetime',
                    labels: {
                        formatter: function(val) {
                            return new Date(val);
                            //return (val / 10000).toFixed(0);
                        }
                    }
                }

            },


        };
    }

    async getData() {
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select avg price by (5 * 60000000000) xbar time,sym  from trade where(time.date=.z.D), sym=`GOOG',
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
        let seriesData = []
        for (let i = 0; i < queryData.result[0].data.y[0].length; i++) {
            let x = new Date('2020-01-09T' + queryData.result[0].data.y[0][i]);
            seriesData.push([
                x,
                queryData.result[0].data.y[1][i]
            ])
        }
        console.log('data returned')
        console.log(queryData)
        console.log('array of times')
        console.log(queryData.result[0].data.y[0])
        //let seriesData = zip(queryData.result[0].time, queryData.result[0].price)
        
        console.log("This is the series data")
        console.log(seriesData)
        console.log("---------------")
        this.setState({
            series: [{
                name: 'AAPL',
                type: 'line',
                data: seriesData
            }]
        })
    }

    // Ensure data is loaded
    componentDidMount() {
        this.getData()
    }


    render() {
        // if (!Object.keys(this.state.data).length) { return <div>Loading graph...</div> }
        const data = this.state.series
        // const data = [107.4]
        console.log(data)

        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>
        );
    }
}

//const domContainer = document.querySelector('#app');
// ReactDOM.render(React.createElement(ApexChart), domContainer);
export default PriceChart2
