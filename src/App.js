import React, { Component } from 'react'
import LogoLeft from './logo-left.png'
import LogoRight from './logo-right.png'
import Data1 from './Data1'
import BarChart from './BarChart'
import PriceChart from './PriceChart'
import PriceChart1 from './PriceChart1'
import MovingAverage from './MovingAverage'
import Volatility from './Volatility'
import PriceChartFinal from './PriceChartFinal'
//import SumBox from './SumBox'

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
              <img src={LogoLeft} alt="duck" class="duck-logo-left" />
              <h1 className="duck-title">Quack Capital</h1>
              <img src={LogoRight} alt="duck" class="duck-logo-right" />

            </div>
          </div>
          <div className="inner-container1">
            <h2 > Price Charts </h2>
            {/* <div class="thin">
              <BarChart />
            </div> */}
            {/* <div class="thin"> */}
            <div>
              <MovingAverage />
              <Volatility />
              <PriceChartFinal />
            </div>
              <Data1 />                    
          </div>
      </div>
      )

  }
}
export default App

