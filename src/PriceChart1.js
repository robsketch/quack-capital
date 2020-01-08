import React from 'react'
//import Chart from 'react-apexcharts'
import ReactApexChart from 'react-apexcharts'


class PriceChart1 extends React.Component {
    constructor() {
      super();
      this.state = {
        data:{},
      };
    }
    async getData() {
      // Define url, kdb params and http params
      const url = 'https://localhost:8090/executeQuery'
      const kdbParams = {
        query: 'select[5] time, price by sym from trade where time.date=.z.d, sym = `AMD',
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
      const response = await fetch(url,httpParams)
      const queryData = await response.json()
  
      this.setState({ data: queryData.result })
    }
  
    // Ensure data is loaded
    componentDidMount() {
      this.interval = setInterval( () => this.getData(), 1000)
    }
  

    render() {
      if (!Object.entries(this.state.data).length) { return <div>Loading graph...</div> }
      const data = this.state.data
 
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
