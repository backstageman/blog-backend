import React from 'react'
import { Link } from 'react-router-dom'

class ErrorPage extends React.Component {
  render() {
    return (
      <div>
        <span>迷路了...</span>
        <Link to="/">点击这里返回首页</Link>
      </div>
    )
  }
}

export default ErrorPage