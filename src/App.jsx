import React, { Component } from "react";
import jwt from "jwt-decode";
import axios from "axios";
import Select from "react-select";
import { questions, questions2, choices, numberOfQuestions, numberOfQuestions2, arms } from "./constants.js";
import "./App.css";
import { Navbar, NavItem, Nav } from "react-bootstrap";
axios.defaults.baseURL = "https://www.mental-health-sd.com";
// axios.defaults.baseURL = 'http://localhost:8000';
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
      prediction: "",
      total: 0,
      preventive: false,
      fetching: false,
      checked: false,
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
      }, expirationTime - Date.now() - 30000);
    }
  }

  componentDidMount() {
    // get the headers and see if we have an auth token
    const token = this.getCookie("authToken");
    const msg = this.getCookie("message");
    const total = this.getCookie("total");
    if (msg) {
      alert(msg);
    }

    if (total) {
      this.setState({ total: total });
    }

    this.setCookie("message", "");

    this.setState({ authToken: token, message: msg }, () => {
      // Set up to automatically refresh the token
      if (this.state.authToken == token && this.state.authToken != "") {
        this.configureJWTExpiry(token);
        this.ValidationComponent();
      }
    });
  }

  setCookie = (cname, cvalue) => {
    const d = new Date();
    d.setTime(d.getTime() + 16 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie =
      cname + "=" + cvalue + ";" + expires + ";domain=.mental-health-sd.com";
    // document.cookie = cname + "=" + cvalue + ";" + expires;
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
    this.setState({ actual: newValue.value });
    return newValue.value;
  };

  onSubmit = async (e) => {
    e.preventDefault();

    this.setState({ fetching: true });

    const response = await axios.post("/get_response", {
      answers: this.state.answers,
    });

    this.setState({ fetching: false, prediction: response.data.message });
  };

  onValidationSubmit = async (e) => {
    e.preventDefault();

    if (confirm("Submit Resources: " + this.state.actual)) {
      const response = await axios.post("/updateForm", {
        id: this.state.id,
        token: this.state.authToken,
        actual: this.state.actual,
      });
      if (response.data.message) {
        alert(response.data.message);
      }
      if (response.data.message == "Submitted") {
        localStorage.setItem(
          "counter",
          parseInt(localStorage.getItem("counter")) + 1
        );
        location.reload();
      }
    }
  };

  refreshToken = async () => {
    var link = "/refreshToken";

    let res;
    try {
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

    var link = "/login";
    this.setState({ authToken: "" });
    this.setCookie("authToken", "");
    const res = await axios.get(link);
    const respHeaders = res.headers;

    if (res.data.requestType == "CAS") {
      localStorage.setItem("counter", 1);
      window.location.replace(res.data.redirect_url);
    }
  };

  logout = async () => {
    const headersGiven = new Headers();
    headersGiven.set("Accept", "application/json");
    headersGiven.set("Content-Type", "application/json");

    var link = "/logout";

    const res = await axios.post(link, {
      token: this.state.authToken,
    });
    const respHeaders = res.headers;

    this.setState({ authToken: "" });
    this.setCookie("authToken", "");
    window.location.replace(res.data.redirect_url);
  };

  returnButton = () => {
    if (!this.state.authToken != "") {
      return (
        <button onClick={this.login} className="nav-button">
          Admin Login
        </button>
      );
    } else {
      return (
        <button onClick={this.logout} className="nav-button">
          Logout
        </button>
      );
    }
  };

  toggleForm = () => {
    this.setState({ preventive: !this.state.preventive });
  }

  navBar = () => {
    return (
      <nav className="navbar sticky-top navbar-expand-lg navbar-custom">
        <a className="navbar-brand" href="/">
          Get the Right Help
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        ></button>
        <ul className="navbar-nav">
          <li className="nav-item active">{this.returnButton()}</li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item active">
            {
              <a
                href="https://mentalhealth.gatech.edu/about/scheduling-appointment"
                style={{ color: "black" }}
              >
                <button type="button" className="nav-button">
                  See CARE
                </button>
              </a>
            }
          </li>
        </ul>
      </nav>
    );
  };

  QAComponent = (question, choices) => {
    return (
      <div>
        <label className="questions">{question}</label>
        <br></br>
        {choices.map((q, i) => (
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              onChange={this.onRadioChange}
              type="radio"
              name={question}
              id="inline"
              value={String(i)}
              style={{ height: 48, width: 48 }}
            ></input>
            <label className="form-check-label" htmlFor="inline">
              {q}
            </label>
          </div>
        ))}
      </div>
    );
  };

  ValidationComponent = async () => {
    const response = await axios.post("/getNext", {
      token: this.state.authToken,
    });

    var reply = await response.data;
    if ("data" in reply) {
      this.setState({ questions: "", id: "" });
    } else {
      this.setState({
        questions: reply.questions,
        id: reply.id,
        actual: arms[0],
      });
    }
  };

  colorGiver = (e) => {
    switch (e) {
      case 4:
        return "green";
      case 3:
        return "yellowgreen";
      case 2:
        return "orange";
      case 1:
        return "darkgoldenrod";
      case 0:
        return "red";
      default:
        return "blue";
    }
  };

  valPage = () => {
    if (this.state.questions) {
      var answers = this.state.questions.split("");
      const options = arms.map((a, i) => ({ value: a, label: a }));
      return (
        <div className="homePageForm">
          <h3>
            Case {localStorage.getItem("counter")} / {this.state.total}
          </h3>
          <br></br>
          <h3>Case Number {this.state.id}</h3>
          <br></br>
          <form onSubmit={this.onValidationSubmit}>
            {answers.map((a, i) => (
              <div>
                {this.state.preventive ? questions2[i] : questions[i]}
                <br></br>
                <p style={{ color: this.colorGiver(parseInt(a)) }}>
                  {choices[parseInt(a)]}
                </p>
              </div>
            ))}
            <hr></hr>
            <label>Your Recommendation: </label>
            <Select
              className="SelectList"
              defaultValue={options[0]}
              onChange={this.handleInputChange}
              options={options}
            ></Select>
            <br></br>
            <button type="submit">Submit</button>
            <br></br>
            <br></br>
          </form>
        </div>
      );
    } else {
      return <div className="homePageForm">Nothing more to Validate</div>;
    }
  };

  homePageHelper = () => {
    if (this.state.prediction) {
      alert(
        "Based on your last form submission this resources might be helpful" +
          ": " +
          this.state.prediction
      );
      return (
        <div>
          <br></br>
          Based on your last form submission this resources might be helpful:{" "}
          {this.state.prediction}
          <br></br>
          <br></br>
          {/* <a href="https://mentalhealth.gatech.edu/about/scheduling-appointment">
            Click here if you still would like to see CARE.
          </a> */}
          <a
            href="https://mentalhealth.gatech.edu/about/scheduling-appointment"
            style={{ color: "white" }}
          >
            <button
              type="button"
              className="nav-button"
              style={{ width: "100%" }}
            >
              See CARE
            </button>
          </a>
        </div>
      );
    } else {
      return;
    }
  };

  acceptConditions = () => {
    this.setState({ checked: !this.state.checked });
  };

  homePage = () => {
    return (
      <div className="homePageForm">
        <h5>
          GT offers several programs and services to help meet your needs. This
          questionnaire will help you determine which services may best assist
          you.
        </h5>
        <br></br>
        <h4>
          This form should not be used as a diagnostic tool. Its purpose is to
          give personalized resources based on your responses. No identifying
          information is collected on the form.
        </h4>
        <br></br>
        <a
          href="https://mentalhealth.gatech.edu/about/scheduling-appointment"
          style={{ color: "white" }}
        >
          <button
            type="button"
            className="nav-button"
            style={{ width: "100%" }}
          >
            See CARE
          </button>
        </a>

        <br></br>
        <br></br>
        <h5>Please answer the following questions:</h5>
        <br></br>
        <form onSubmit={this.onSubmit}>
          {(this.state.preventive ? questions2 : questions).map((q, i) => (
            <div>
              {this.QAComponent(`${i + 1}. ${q}`, choices)}
              <br></br>
            </div>
          ))}

          <div>
            <input
              type="checkbox"
              name="checkAddress"
              onClick={this.acceptConditions}
            />
            &nbsp;I acknowledge that the above information will be used to
            provide recommendations and any decisions made based on these
            recommendations will be taken at my own discretion.
          </div>

          <button
            type="submit"
            disabled={
              Object.keys(this.state.answers).length != (this.state.preventive ? numberOfQuestions2 : numberOfQuestions) ||
              this.state.fetching ||
              !this.state.checked
            }
          >
            Submit
          </button>
          <div
            className="loading-spinner"
            style={{ display: this.state.fetching ? "block" : "none" }}
          ></div>
        </form>
        {this.homePageHelper()}
      </div>
    );
  };

  renderSwitch = () => {
    switch (this.state.authToken) {
      case "":
        return this.homePage();
      default:
        return this.valPage();
    }
  };

  render() {
    return (
      <div className="App">
        {this.navBar()}
        {this.renderSwitch()}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <nav className="navbar fixed-bottom navbar-GTblue"></nav>
      </div>
    );
  }
}

export default App;
