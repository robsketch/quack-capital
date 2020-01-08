import React from 'react'
// import Chart from 'react-apexcharts'
import ReactApexChart from 'react-apexcharts'



class PriceChart1 extends React.Component {
  constructor() {
    super();
    this.state = {

      series: [{
        name: '',
        type: 'line',
        data: [],
      }],
      options: {
        chart: {
          type: 'line',
          height: 350,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },
        title: {
          text: 'Stock Price Movement',
          align: 'left'
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return (val / 1000000).toFixed(0)
            }
          }
        }
      }
    }
  }

  async getData() {
    // Define url, kdb params and http params
    const url = 'https://localhost:8090/executeQuery'
    const kdbParams = {
      query: 'select avgs price by sym from trade where (i<1000),(sym=`AAPL)',
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
    console.log(queryData)
    this.setState({
      series: [{
        name: 'AAPL',
        type: 'line',
        data: queryData.result[0].price
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
        <ReactApexChart options={this.state.options} series={data} type="line" height={350} />
      </div>
    );
  }
}

//const domContainer = document.querySelector('#app');
// ReactDOM.render(React.createElement(ApexChart), domContainer);
export default PriceChart1
