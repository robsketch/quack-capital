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
                        tyoe: 'x',
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
                            min: new Date('12 Jan 2020').getTime(), //get current date
                            max: new Date('13 Jan 2020').getTime()
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


        };
        // this.getData();
        this.getData(); // fetch rdb data
        // this.getData; // fetch hdb data
    }



    async getData() {
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select last price,time by sym, time:5 xbar time.minute from trade where (time.date=.z.D)',
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

        console.log('RDB Query Result')
        console.log(queryData)


        //var testData = []
        for (let i = 0; i < queryData2.result.length; i++) {
            queryData.result[i].data.y[0] = queryData2.result[i].data.y[0].concat(queryData.result[i].data.y[0])
            queryData.result[i].data.y[1] = queryData2.result[i].data.y[1].concat(queryData.result[i].data.y[1])
            // testData[1].push(queryData.result[i].data.y[1].concat(queryData2.result[i].data.y[1]))
        }
        console.log('ConcatTest')
        console.log(queryData)

        // var testData2 = []

        // for (let i = 0; i < queryData.result.length; i++) {
        //     testData2.push(queryData.result[i].data.y[1].concat(queryData2.result[i].data.y[1]))
        //     // testData[1].push(queryData.result[i].data.y[1].concat(queryData2.result[i].data.y[1]))
        // }

        
        // console.log('concat')
        // console.log(testData2)

        // var finalData = [testData,testData2]
        // console.log('concat2')
        // console.log(finalData)


        // Getting the dates in order


        // Fetch data from server
        // const response = await fetch(url, httpParams)
        // const queryData = await response.json()

        // console.log('QUERY DATA')
        // console.log(queryData)

        var dates = []
        let rawDates = queryData.result[0].data.y[0]

         console.log('rawDates')
         console.log(rawDates)

        for (let i = 0; i < 288; i++) {
            dates.push(new Date('2020-01-09T' + rawDates[i])) // remove jan 9th
        }
        for (let i = 288; i < 576; i++) {
            dates.push(new Date('2020-01-10T' + rawDates[i])) // remove jan 9th
        }
        for (let i = 576; i < 864; i++) {
            dates.push(new Date('2020-01-11T' + rawDates[i])) // remove jan 9th
        }
        for (let i = 864; i < rawDates.length; i++) {
            dates.push(new Date('2020-01-12T' + rawDates[i])) // remove jan 9th
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
        // console.log('SERIES DATA')
        // console.log(seriesData)

        this.setState({
            series: seriesData,
            seriesLine: seriesData,
        }
        )
    }

    // async getDataNew(rdb) {
    //     // Define url, kdb params and http params
    //     const url = 'https://localhost:8090/executeQuery'
    
    //     // The query is slightly different based on whether you are currently queryinig the rdb or hdb.
    //     if (rdb) {
    //         this.query = '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select last price,time by sym, time:5 xbar time.minute from trade where (time.date=.z.D)'
            
    //     } else {
    //         this.query = '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select last price,time by sym, time:5 xbar time.minute from trade where (time.date>.z.D-3)'
    //     }
    
    //     const kdbParams = {
    //         query: this.query,
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
    
    //     // Fetch data from server
    //     const response = await fetch(url, httpParams)
    //     const queryData = await response.json()
    
    //     console.log('QUERY DATA')
    //     console.log(queryData)
    
    //     var dates = []
    //     let rawDates = queryData.result[0].data.y[0]
    
    //     console.log('rawDates')
    //     console.log(rawDates)
    
    //     for (let i = 0; i < rawDates.length; i++) {
    //         // TODO: Fix this date so that it is not hard coded. Get the current date.
    //         dates.push(new Date('2020-01-09T' + rawDates[i])) // remove jan 9th
    //     }
    
    //     let seriesData = []
    //     for (let i = 0; i < queryData.result.length; i++) {
    //         var dataTest = []
    //         dataTest.push(zip(dates, queryData.result[i].data.y[1]))
    //         seriesData.push({
    //             name: queryData.result[i].sym,
    //             type: 'line',
    //             data: dataTest[0]
    //         })
    //     }
    //     console.log('SERIES DATA')
    //     console.log(seriesData)
    
    //     this.setState({
    //         series: seriesData,
    //         seriesLine: seriesData
    //     })
    // }


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




















// function getData(rdb) {
//     if (rdb) {
//         query = 
//     }
// }