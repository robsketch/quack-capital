import React, { Component } from 'react'
import Table from './Table'
import Form from './Form'
import Logo from './logo.png'

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
    const { characters } = this.state
  
    return (
        <div className="container">
          <div class="top-bar">
            <div class="inner-container">
              <img src={Logo} alt="duck" class="duck-logo" />
              <h1 class="duck-title">Quack Capital</h1>
            </div>
          </div>
          <div class="inner-container">
            <Table characterData={characters} removeCharacter={this.removeCharacter} />
            <Form handleSubmit={this.handleSubmit} />
          </div>
        </div>
      )

  }
}
export default App