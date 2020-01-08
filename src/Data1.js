import React, { Component } from 'react'



const TableHeader = (props) => {
  const header = props.headers.map((h,i) => { return <th key={i}>{h}</th> })
  return <thead><tr>{header}</tr></thead>
}

// Parse query contents into table
const BasicTable = (props) => {
  const rows = Object.keys(props.data).map((k,i) => {
    let row = props.data[k]
    return (
      <tr key={i}>
        <td>{row.sym}</td>
        <td>{(row.price).toFixed(2)}</td> { /* max price */ }
        <td>{(row.price1).toFixed(2)}</td> { /* min price */ }
        <td>{(row.t)}</td>
        <td>{(row.size)}</td>
      </tr>
    )
  })

  return <tbody>{rows}</tbody>
  }


// Class for data handling
class Data1 extends Component {
  constructor() {
    super();
    this.state = {
      data:{},
    }
}

  // Fetch data from KDB instance
  async getData() {
    // Define url, kdb params and http params
    const url = 'https://localhost:8090/executeQuery'
    const kdbParams = {
      query: 'update t:?[price>price1;-1;?[price=price1;0;1]] from select last price except last price, last price, sum size by sym from trade',
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

  // Render content
  render() {

    // Stall if data is not yet loaded
    if (!Object.entries(this.state.data).length) { return <div>Loading table...</div> }

    const data = this.state.data
    const headers = ['SYM', 'PrevPx', 'CurPx', 'Trend', 'TotVol']

    return(
      <table>
        <TableHeader headers={headers} />
        <BasicTable data={data} />
      </table>
    )
  }

}

export default Data1;
