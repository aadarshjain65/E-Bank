import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    userIdInput: '',
    pinInput: '',
    showError: false,
    errorMsg: '',
  }

  onChangeUserIdInput = event => {
    this.setState({userIdInput: event.target.value})
  }

  onChangePinInput = event => {
    this.setState({pinInput: event.target.value})
  }

  onSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onClickLogin = async event => {
    event.preventDefault()
    const {userIdInput, pinInput} = this.state
    const userDetails = {user_id: userIdInput, pin: pinInput}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  render() {
    const {userIdInput, pinInput, showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="card-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="image"
            />
          </div>
          <form className="form-container" onSubmit={this.onClickLogin}>
            <h1 className="welcome-text">Welcome Back!</h1>
            <div className="input-container">
              <label className="label" htmlFor="userId">
                User ID
              </label>
              <input
                className="input"
                value={userIdInput}
                placeholder="Enter User ID"
                id="userId"
                onChange={this.onChangeUserIdInput}
                type="text"
              />
            </div>
            <div className="input-container">
              <label className="label" htmlFor="pin">
                PIN
              </label>
              <input
                className="input"
                value={pinInput}
                placeholder="Enter PIN"
                id="pin"
                onChange={this.onChangePinInput}
                type="password"
              />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
            <div className="error-container">
              {showError === true && <p className="error-msg">{errorMsg}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
