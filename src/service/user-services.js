import { removeToken } from '../utils/auth'

class User {
  static logout() {
    removeToken()
    // 重定向到登录页面
    window.location.href = "/login"
  }
}

export default User