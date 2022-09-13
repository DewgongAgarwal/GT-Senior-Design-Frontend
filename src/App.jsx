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
    const numberOfQuestions = 7;
    return (
      <div className="App">
        <form onSubmit={this.onSubmit}>
          {this.QAComponent("1. Constant sadness/depressed mood")}<br></br>
          {this.QAComponent("2. Difficulty falling asleep")}<br></br>
          {this.QAComponent("3. Early morning awakening")}<br></br>
          {this.QAComponent("4. Waking during the middle of the night")}<br></br>
          {this.QAComponent("5. Increased sleep")}<br></br>
          {this.QAComponent("6. Decreased enjoyment in formerly pleasurable activities")}<br></br>
          {this.QAComponent("7. Feelings of guilt")}<br></br>
          <button type="submit" disabled = {Object.keys(this.state.answers).length != numberOfQuestions}>Submit</button>
        </form>
      </div>
    );
  }
}



export default App;