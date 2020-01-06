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
        <td>{row.price}</td>
        <td>{row.size}</td>        
        <td>{row.side}</td> 
        <td>{row.time}</td>
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
      query: 'select [-5] sym, price, size, side, time from trade',
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
    const headers = Object.keys(data[0])

    return(
      <table>
        <TableHeader headers={headers} />
        <BasicTable data={data} />
      </table>
    )
  }

}

export default Data1;
