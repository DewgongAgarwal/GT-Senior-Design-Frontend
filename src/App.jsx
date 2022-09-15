import React, { Component } from 'react';

class App extends Component {  
  constructor() {
    super();
    this.state = {
      answers: []
    };
    this.onRadioChange = this.onRadioChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onRadioChange = (e) => {
    this.setState(answers => {
      answers = this.state.answers;
      var questionName = e.target.name;
      var breakIndex = questionName.indexOf('.');
      var index = parseInt(questionName.substring(0, breakIndex));
      answers[index - 1] = parseInt(e.target.value);
      return {
        answers
      };
    });
  }
  onSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);

    fetch("http://127.0.0.1:8000/get_response", {
      method: "POST",
      headers: {Accept: "application/json",
      "Content-Type": "application/json"},
      body: JSON.stringify({"answers":this.state.answers}),
    }).then(response => response.json());
  }

  QAComponent = (question) => {
    return (<div>
      <strong>{question}</strong><br></br>
      <label>
        <input
          type="radio"
          value="0"
          name={question}
          onChange={this.onRadioChange}
        />
        <span>Never</span>
      </label>
      <label>
        <input
          type="radio"
          value="1"
          name={question}
          onChange={this.onRadioChange}
        />
        <span>Rarely</span>
      </label>
      <label>
        <input
          type="radio"
          value="2"
          name={question}
          onChange={this.onRadioChange}
        />
        <span>Occassionally</span>
      </label>
      <label>
        <input
          type="radio"
          value="3"
          name={question}
          onChange={this.onRadioChange}
        />
        <span>Frequently</span>
      </label>
      <label>
        <input
          type="radio"
          value= "4"
          name={question}
          onChange={this.onRadioChange}
        />
        <span>Usually</span>
      </label>
    </div>);
    
  }

  render() {
    const questions = ["Constant sadness/depressed mood", 
                 "Difficulty falling asleep",
                 "Early morning awakening",
                 "Waking during the middle of the night",
                 "Increased sleep",
                 "Decreased enjoyment in formerly pleasurable activities",
                 "Feelings of guilt"
                ];
    const numberOfQuestions = questions.length;
    return (
      <div className="App">
        <form onSubmit={this.onSubmit}>
          {questions.map((q, i) => <div>
            {this.QAComponent(`${i + 1}. ${q}`)}<br></br>
          </div>)}
          
          <button type="submit" disabled = {Object.keys(this.state.answers).length != numberOfQuestions}>Submit</button>
        </form>
      </div>
    );
  }
}



export default App;