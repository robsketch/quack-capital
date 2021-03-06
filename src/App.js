import React, { Component } from 'react'
import LogoLeft from './logo-left.png'
import LogoRight from './logo-right.png'
import Data1 from './Data1'
import MovingAverage from './MovingAverage'
import Volatility from './Volatility'
import PriceChartFinal from './PriceChartFinal'
import Team from './Team'
import RealTimePrice from './RealTimePrice'

class App extends Component {
  state = {
    characters: [],
  }

  playAudio() {
    var audio = document.getElementById("audioClick");
    audio.play();
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
        <audio id="audioClick" src="duck.wav" ></audio>
        <div className="top-bar">
          <div className="inner-container2">
            <img src={LogoLeft} alt="duck" class="duck-logo-left" onClick={this.playAudio} />
            <h1 className="duck-title">Quack Capital</h1>
            <img src={LogoRight} alt="duck" class="duck-logo-right" />
            <h1 className="duck-title"> </h1>
          </div>
        </div>
        <div className="inner-container2">
          <h2 className="charts-title" >  </h2>


          <div className="inner-container-top"><RealTimePrice /><PriceChartFinal /></div>{/*<div className="inner-container1"><Volatility /></div>*/}
            {/* <div class="thin">
              <BarChart />
            </div> */}
          {/* <div class="thin"> */}
          <div className="test">
            <div className="inner-container1"><MovingAverage /></div><div className="inner-container1"><Volatility /></div>

            {/* <PriceChartFinal /> */}
          </div>
          <Data1 />
          <div>
            <Team />
          </div>
        </div>
      </div>
    )

  }
}
export default App