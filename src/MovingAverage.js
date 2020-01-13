import React from 'react'
// import Chart from 'react-apexcharts'
import ReactApexChart from 'react-apexcharts'

// function zip(a, b) {
//     var arr = [];
//     for (var key in a) arr.push([a[key], b[key]]);
//     return arr;
// }

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
                    text: 'Stock Price Running Average',
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
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
                            return x.getHours().toString() + ':00';
                            }
                            //return (val / 10000).toFixed(0);
                        },
                    },
                    title: {
                        text: 'Time'
                    },
                },

            },


        };
        this.getData();
    }

    async getData() {
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            //query: '{[x] key[x]!([]data:flip each value x)}select `time$time,avgs price by sym from trade where(time.date=.z.D), sym=`AAPL',
            query: '{[x] key[x]!([]data:flip each value x)}select `time$time,avgs price by sym from select avg price by (5 * 60000000000) xbar time,sym  from trade where(time.date=.z.D), sym=`AAPL',
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
        let rawDates = queryData.result[0].data.y[0]

        for (let i = 0; i < rawDates.length; i++) {
            dates.push(new Date(rawDates[i]))
        }

        let seriesData = []
        for (let i = 0; i < queryData.result[0].data.y[0].length; i++) {
            let x = new Date('2020-01-09T' + queryData.result[0].data.y[0][i]);
            seriesData.push([
                x,
                queryData.result[0].data.y[1][i]
            ])
        }
        
        console.log('seriesData Moving Average')
        console.log(seriesData)

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
        //this.getData()
        this.interval = setInterval(() => this.getData(), 10000000)
    }


    render() {
        // if (!Object.keys(this.state.data).length) { return <div>Loading graph...</div> }
        // const data = this.state.series
        // const data = [107.4]

        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>
        );
    }
}

//const domContainer = document.querySelector('#app');
// ReactDOM.render(React.createElement(ApexChart), domContainer);
export default MovingAverage
