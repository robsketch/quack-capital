import React from 'react'
import ReactApexChart from 'react-apexcharts'

function zip(a, b) {
    var arr = [];
    for (var key in a) arr.push([a[key], b[key]]);
    return arr;
}

class RealTimePrice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: "{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from RTPx where sym in `AAPL",
            availableSyms: [],
            checkedSyms: ["AAPL"],
            series: [{
                data: []
            }],
            options: {
                title: {
                    text: 'Real-Time Stock Price over Time by Sym for Today',
                    align: 'left',
                    style: {
                        fontSize: '23px',
                        color: '#011638'
                    },

                },
                legend:{
                    onItemClick: {
                        toggleDataSeries: false
                    },
                    onItemHover: {
                        highlightDataSeries: false
                    }
                },
                chart: {

                    id: 'chart3',
                    type: 'line',
                    height: 1230,
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    },
                    zoom: {
                        type: 'x',
                        autoScaleYaxis: false,
                        enabled: false
                    }
                },
                colors: ['#1A8FE3', '#484041', '#E07A5F', '#3D405B', '#81B29A', '#011638', '#E6C229', '#F17105', '#D11149', '#6610F2'],

                stroke: {
                    width: 4
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
                    type: 'datetime',
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
                            // min: new Date('12 Jan 2020').getTime(), //get current date
                            // max: new Date('15 Jan 2020').getTime()
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
                        enabled: true,
                        theme: {
                            monochrome: {
                                enabled: true,
                                color: '#255aee',
                                shadeTo: 'light',
                                shadeIntensity: 0.65
                            }
                        }

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
        this.getData(); // fetch rdb data
        this.getSyms();
    }

    handleSymTick = (event) => {
        let checkedSyms = Object.assign([], this.state.checkedSyms)
        if (event.target.checked) {
            checkedSyms.push(event.target.name)
        } else {
            if (this.state.checkedSyms.length > 1) {
                const index = checkedSyms.indexOf(event.target.name)
                checkedSyms.splice(index, 1)
            }
        }
        
        this.setState({checkedSyms})
    }

    buttonSym(sym) {
        return (
            <>
                <input id={sym} type="checkbox" name={sym} onChange={this.handleSymTick} checked={this.state.checkedSyms.includes(sym)} />
                <label htmlFor={sym}> {sym} </label>
            </>
        )
    }

    async getSyms() {
        // This function is run once on the creation of the react component and polls the rdb for 
        // the syms available.
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            query: 'asc distinct exec sym from RTPx',
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
        var queryData = await response.json()
        this.state.availableSyms = queryData.result

        
    }

    makeQuery() {
        let listOfSyms = "`" + this.state.checkedSyms.join("`");

        let newQuery = "{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from RTPx where sym in " + listOfSyms;
        this.setState({query: newQuery})
    }

    async getData() {
        var symChoice = '`AAPL`AIG'
        // Define url, kdb params and http params
        const url = 'https://localhost:8090/executeQuery'
        const kdbParams = {
            //query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from select last price,time by sym, time:1 xbar time.minute from trade where (time.date=.z.D),(time within(.z.T-3600000;.z.T))',
            //query: '{[x] key[x]!([]data:flip each value x)}select `time$time,price by sym from RTPx where sym in ' + symChoice,
            query: this.state.query,
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

        this.makeQuery()
        const response = await fetch(url, httpParams)
        var queryData = await response.json()
        //const queryData = queryData.concat(lastPoll)
        // console.log('RTPx')
        // console.log(queryData)

        var dates = []
        let rawDates = queryData.result[0].data.y[0]

        // console.log('rawDates')
        // console.log(rawDates)

        // console.log('rea-time price data')
        // console.log(queryData)

        for (let i = 0; i < rawDates.length; i++) {
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
        this.setState({ series: seriesData })
    }

    componentDidMount() {
        this.interval = setInterval(() => this.getData(), 1000)
    }

    render() {
        console.log(this.state.checkedSyms)
        return (
            <>
                {/* {this.state.availableSyms.map(x => this.buttonSym(x))} */}
                

                <div id="wrapper">
                    <div id="chart-line2">

                        <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={530} />
                        <div className="buttonBar">
                            {this.state.availableSyms.map(x => this.buttonSym(x))}
                        </div>
                    </div>
                </div>
            </>


        );
    }
}

export default RealTimePrice