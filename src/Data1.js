import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleUp, faArrowCircleDown, faMinusCircle } from '@fortawesome/free-solid-svg-icons'


const TableHeader = (props) => {
  const header = props.headers.map((h, i) => { return <th key={i}>{h}</th> })
  return <thead><tr>{header}</tr></thead>
}

const SumHeader = (props) => {

  var maxtraded;
  props.data.map(row => {
    if (row.rnk === 0) {
      maxtraded = row.sym
    };
  })
  return <h2>Daily Statistics - Today's highest traded sym is {maxtraded}</h2>
}


// Parse query contents into table
const BasicTable = (props) => {
  const rows = Object.keys(props.data).map((k, i) => {
    let row = props.data[k]
    var tick = row.t;
    var trend = '';
    if (tick === 0) {
      trend = <FontAwesomeIcon icon={faMinusCircle} />;
    } else if (tick === 1) {
      trend = <FontAwesomeIcon icon={faArrowCircleUp} color="green" />;
    } else {
      trend = <FontAwesomeIcon icon={faArrowCircleDown} color="red" />
    };

    return (
      <tr key={i}>
        <td>{row.sym}</td>
        <td>{(row.price1).toFixed(2)}</td> { /* min price */}
        <td>{trend}</td>
        <td>{(row.size)}</td>
        <td>{(row.Open).toFixed(2)}</td>
        <td>{(row.High).toFixed(2)}</td>
        <td>{(row.Low).toFixed(2)}</td>
      </tr>

    )
  })
  // if (!Object.entries(this.state.data).length) { return <div>Loading table...</div> }
  return <tbody>{rows}</tbody>
}


// Class for data handling
class Data1 extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
    }
  }

  // Fetch data from KDB instance
  async getData() {
    // Define url, kdb params and http params
    const url = 'https://localhost:8090/executeQuery'
    const kdbParams = {
      query: 'update rnk:rank neg size from update t:?[price>price1;-1;?[price=price1;0;1]] from (select Open:first price, High:max price, Low:min price, last price except last price, last price, sum size by sym from trade where time.date=.z.d)',
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

    this.setState({ data: queryData.result })
  }

  // Ensure data is loaded
  componentDidMount() {
    this.interval = setInterval(() => this.getData(), 1000)
  }

  // Render content
  render() {

    // Stall if data is not yet loaded
    if (!Object.entries(this.state.data).length) { return <div>Loading table...</div> }

    const data = this.state.data
    const headers = ['SYM', 'CurPx', 'Trend', 'TotVol', 'Open', 'High', 'Low']

    return (
      <div>
        <SumHeader data={data} />
        <table>
          <TableHeader headers={headers} />
          <BasicTable data={data} />
        </table>
      </div>
    )
  }
}

export default Data1;
