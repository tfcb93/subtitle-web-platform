import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    response: '',
    sedding: false,
    gettingCsv: false,
    gettingJson: false,
    sent: false
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
    this.setState({
      sedding:true
    })
    e.preventDefault()
    const file_input = document.getElementById("file_input")
    window.localStorage.setItem("file_name",(file_input.files[0].name).replace('.srt',''))
    let data = new FormData()
    data.append('file', file_input.files[0])
      await fetch('/api/submit-file', {
       method: 'POST',
       headers: {
         //'Content-Type': 'multipart/form-data',
       },
       body: data,
     }).then(res =>
        this.setState({
          sedding:false,
          sent: true
        })
      )
  }

  handleDownloadJson(){
    console.log('json')
    fetch('/api/' + window.localStorage.getItem('file_name') + '.json',{
      method: 'GET'
    })
  }

  handleDownloadCsv(){
    console.log('csv')
    fetch('/api/csv',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          'file_name': window.localStorage.getItem('file_name')
      })
    })
  }

  render() {
    if(!this.state.sent){
      return (
        <div className="App">
          <h3>Submeter legenda</h3>
            <form onSubmit={this.handleSubmit}>
              <input id="file_input"  type="file" name="file"/>
              <button type="submit">but</button>
            </form>
        </div>
      )
    }else{
      return(
        <div className="App">
          <h3>Download dos dados</h3>
            <button onClick={this.handleDownloadJson}>JSON</button>
            <button onClick={this.handleDownloadCsv}>CSV</button>
        </div>
      )
    }
  }
}

export default App;

/**
 * <form action="/api/submit-file" method="post" encType="multipart/form-data">
            <input type="file" name="file"/>
            <button type="submit">Submit</button>
          </form>
 */