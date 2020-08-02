import React from 'react';
import { Form, Input, Button, message } from 'antd';
import 'antd/dist/antd.css';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../../static/css/login.css'
import { login } from '../../api/user'
import { setToken } from '../../utils/auth'


class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: 'admin',
      password: 'admin'
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUsernameInput = this.handleUsernameInput.bind(this)
    this.handlePasswordInput = this.handlePasswordInput.bind(this)
  }

  componentDidMount() {
    // 自动聚焦
    this.autoFocus()
  }

  // 用户名或密码为空自动聚焦
  autoFocus() {
    const username = this.refs.usernameInput.value
    const password = this.refs.passwordInput.value
    if (!password || password.trim().length === 0) {
      this.refs.passwordInput.focus()
    }
    if (!username || username.trim().length === 0) {
      this.refs.usernameInput.focus()
    }
  }

  handleSubmit() {
    const { username, password } = this.state
    if (!username || username.trim().length === 0) {
      return message.error('用户名不能为空')
    }

    if (!password || password.trim().length === 0) {
      return message.error('密码不能为空')
    }
    // message.success('校验通过')
    // 发起请求
    login({ username, password }).then(res => {
      // console.log(res)
      const { data } = res
      setToken(data.token)
      if (res.msg === '登录成功') {
        // 设置token
        setToken(data.token)
        // message.success('登录成功，3秒后跳转到首页。')
        // 重定向到首页
        this.props.history.push('/')
      } else {
        message.error(res.msg)
      }
    }).catch(err => {
      console.log(err)
    })
  }
  handleUsernameInput(e) {
    this.setState(
      { username: e.target.value }
    )
  }
  handlePasswordInput(e) {
    this.setState(
      { password: e.target.value }
    )
  }

  handleKeyUp(){
    this.handleSubmit()
  }

  render() {
    return (
      <div className="login-container">
        <Form
          name="normal_login"
          className="login-form"
        >
          <div className="title-contianer">
            <h3 className="title">博客后台管理系统</h3>
          </div>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名！',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
              ref="usernameInput"
              onInput={this.handleUsernameInput}
              onKeyUp={(e)=>this.handleKeyUp(e)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
              ref="passwordInput"
              onInput={this.handlePasswordInput}
              onKeyUp={(e)=>this.handleKeyUp(e)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" 
            onClick={this.handleSubmit} 
            className="login-form-button"
            onKeyUp={(e)=>this.handleKeyUp(e)}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default LoginPage 