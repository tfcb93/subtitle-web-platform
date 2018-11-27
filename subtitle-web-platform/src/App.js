import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    response: '',
    post: '',
    responseToPost: ''
  }


  componentDidMount(){
    this.callApi().then(
      res => this.setState({ response: res.express }
      ).catch(
        err => console.log(err)
      )
    )
  }

  callApi = async () => {
    const response = await fetch('/api/hello')
    const body = await response.json()

    if (response.status !== 200) throw Error(body.message)
    
    return body
  }

  handleSubmit = async (e,file) => {
    e.preventDefault()
    const file_input = document.getElementById("file_input")
    let data = new FormData()
    data.append('file', file_input.files[0])
     const response = await fetch('/api/submit-file', {
       method: 'POST',
       headers: {
         //'Content-Type': 'multipart/form-data',
       },
       body: data,
     })
 
     const body = await response.json()
 
     this.setState({
       responseToPost: body
     })

     console.log(this.state.responseToPost)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <h3>Submeter legenda</h3>
          <form onSubmit={this.handleSubmit}>
            <input id="file_input"  type="file" name="file"/>
            <button type="submit">but</button>
          </form>
      </div>
    );
  }
}

export default App;

/**
 * <form action="/api/submit-file" method="post" encType="multipart/form-data">
            <input type="file" name="file"/>
            <button type="submit">Submit</button>
          </form>
 */