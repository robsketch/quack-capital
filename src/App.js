import React, { Component } from 'react'
import Logo from './logo.png'
import Data1 from './Data1'
import PriceChart2 from './PriceChart2'
import Volatility from './Volatility'
import VolumeChart from './VolumeChart'

class App extends Component {
    state = {
        characters: [],
    }
  

removeCharacter = index => {
    const { characters } = this.state
  
    this.setState({
      characters: characters.filter((character, i) => {
        return i !== index
      }),
    })
  }

handleSubmit = character => {
    this.setState({ characters: [...this.state.characters, character] })
  }



render() {
    // const { characters } = this.state
    //console.log(new Date("2020.01.09D15:10:13.563597000"))
  
    return (
      <div className="container">
          <div className="top-bar">
            <div className="inner-container1">
              <img src={Logo} alt="duck" class="duck-logo" />
              <h1 className="duck-title">Quack Capital</h1>
            </div>
          </div>
          <div className="inner-container1">
            <h2 > Price Charts </h2>
            {/* <div class="thin">
              <BarChart />
            </div> */}
            {/* <div class="thin"> */}
            <div>
              <PriceChart2 />
              <Volatility />
              <VolumeChart />
            </div>
              <Data1 />                    
          </div>
      </div>
      )

  }
}
export default App

