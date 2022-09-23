import React, { Component } from "react";
import jwt from "jwt-decode";
import axios from "axios";
import Select from 'react-select'
import { questions, choices, numberOfQuestions, arms } from "./constants.js";

class App extends Component {
  constructor() {
    super();
    this.state = {
      answers: [],
      message: "",
      authToken: "",
      questions: "",
      id: "",
      actual: "",
    };
    this.onRadioChange = this.onRadioChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  configureJWTExpiry(token) {
    const decodedToken = this.parseJwt(token);
    const expirationTime = decodedToken.exp * 1000;
    if (Date.now() >= expirationTime) {
      this.login();
    } else {
      const interval = setInterval(() => {
        this.refreshToken();
      }, expirationTime - Date.now() - 30);
    }
  }

  componentDidMount() {
    // get the headers and see if we have an auth token
    const token = this.getCookie("authToken");
    const msg = this.getCookie("message");
    if (msg) {
      alert(msg);
    }
    this.setCookie("message", "");

    this.setState({ authToken: token, message: msg }, () => {
      // Set up to automatically refresh the token
      if (this.state.authToken == token && this.state.authToken != "") {
        this.configureJWTExpiry(token);
        this.ValidationComponent();
      };
    }); 
  }

  setCookie = (cname, cvalue) => {
    const d = new Date();
    d.setTime(d.getTime() + 16 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };

  onRadioChange = (e) => {
    this.setState((answers) => {
      answers = this.state.answers;
      var questionName = e.target.name;
      var breakIndex = questionName.indexOf(".");
      var index = parseInt(questionName.substring(0, breakIndex));
      answers[index - 1] = parseInt(e.target.value);
      return {
        answers,
      };
    });
  };


  handleInputChange = (newValue) => {
    console.log(newValue);
    this.setState({ actual: newValue.value });
    return newValue.value;
  };

  onSubmit = async (e) => {
    e.preventDefault();
    console.log(this.state);

    const response = await axios.post("http://localhost:8000/get_response", {
      answers: this.state.answers,
    });
  };

  onValidationSubmit = async (e) => {
    e.preventDefault();
    console.log(this.state);

    if (confirm("Submit Resources: " + this.state.actual)) {
      const response = await axios.post("http://localhost:8000/updateForm", {
        id: this.state.id,
        token: this.state.authToken,
        actual: this.state.actual,
      });
      if (response.data.message) {
        alert(response.data.message);
      }
      if (response.data.message == "Submitted") {
        location.reload();
      }
    }
  };

  refreshToken = async () => {
    var link = "http://127.0.0.1:8000/refreshToken";

    let res;
    try {
      console.log(this.state.authToken);
      res = await axios.post(link, {
        token: this.state.authToken,
      });
    } catch (err) {
      console.error(err.response);
      this.setState({ authToken: "" });
    }

    if (res.data.authToken) {
      this.setState({ authToken: res.data.authToken });
      this.setCookie("authToken", res.data.authToken);
    }
    console.log(this.state.authToken);
  };

  redirect = (url) => {
    window.location.href = url;
  };

  parseJwt = (token1) => {
    const token = jwt(token1);
    return token;
  };

  login = async () => {
    const headersGiven = new Headers();
    headersGiven.set("Accept", "application/json");
    headersGiven.set("Content-Type", "application/json");

    var link = "http://127.0.0.1:8000/login";

    const res = await axios.get(link);
    const respHeaders = res.headers;

    console.log(respHeaders);
    console.log(res.data);

    if (res.data.requestType == "CAS") {
      window.location.replace(res.data.redirect_url);
    }
  };

  logout = async () => {
    const headersGiven = new Headers();
    headersGiven.set("Accept", "application/json");
    headersGiven.set("Content-Type", "application/json");

    var link = "http://127.0.0.1:8000/logout";

    const res = await axios.get(link);
    const respHeaders = res.headers;

    console.log(respHeaders);
    console.log(res.data);

    this.setState({ authToken: "" });
    this.setCookie("authToken", "");
    window.location.replace(res.data.redirect_url);
  };

  authentication = async (e) => {
    const headersGiven = new Headers();
    headersGiven.set("Accept", "application/json");
    headersGiven.set("Content-Type", "application/json");

    var link = `http://127.0.0.1:8000/${e.target.innerHTML.toLowerCase()}`;
    console.log(link);

    const res = await axios.get(link);
    const respHeaders = res.headers;

    console.log(respHeaders);
    console.log(res.data);

    if (res.data.requestType == "CAS") {
      window.location.replace(res.data.redirect_url);
    }
  };

  returnButton = (e) => {
    if (!this.state.authToken != "") {
      return <button onClick={this.login}>Login</button>;
    } else {
      return <button onClick={this.logout}>Logout</button>;
    }
  };

  QAComponent = (question, choices) => {
    return (
      <div>
        <strong>{question}</strong>
        <br></br>
        {choices.map((q, i) => (
          <label>
            <input
              type="radio"
              value={String(i)}
              name={question}
              onChange={this.onRadioChange}
            />
            <span>{q}</span>
          </label>
        ))}
      </div>
    );
  };

  ValidationComponent = async () => {
    const response = await axios.post("http://localhost:8000/getNext", {
        token: this.state.authToken,
      });

    var reply = await response.data;
    if ('data' in reply) {
      this.setState({questions: "", id: ""});
    } else {
      console.log(reply.questions);
      this.setState({questions: reply.questions, id: reply.id, actual: arms[0]});
    }
  };

  valPage = () => {

    if (this.state.questions) {
      var answers = this.state.questions.split('');
      console.log(answers);
      console.log(arms);
      const options = arms.map((a, i) => (
                        {value: a, label: a}
                      ))
      return(
        <form onSubmit={this.onValidationSubmit}>
          {answers.map((a, i) => (
            <div>
            {questions[i] + ": " + choices[parseInt(a)]}
            <br></br>
            </div>
          )) }
          <Select defaultValue={options[0]} onChange={this.handleInputChange} options = {options}></Select>
          <div>{this.state.actual}</div>
          <button
            type="submit"
          >Submit</button>
        </form>
      )
    } else {
      return(<div>Nothing more to Validate</div>)
    }

    
  };

  homePage = () => {
    return (
      <form onSubmit={this.onSubmit}>
        {questions.map((q, i) => (
          <div>
            {this.QAComponent(`${i + 1}. ${q}`, choices)}
            <br></br>
          </div>
        ))}

        <button
          type="submit"
          disabled={Object.keys(this.state.answers).length != numberOfQuestions}
        >
          Submit
        </button>
      </form>
    );
  };

  renderSwitch = () => {
    switch (this.state.authToken) {
      case "":
        return this.homePage();
      default:
        return this.valPage();
    }
  }

  render() {
    return (
      <div className="App">
        {this.returnButton()}
        {this.renderSwitch()}
      </div>
    );
  }
}

export default App;
