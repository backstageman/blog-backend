import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Login from './page/login/index.js'
import Error from './page/error/index.js'
import Home from './page/home/index.js'
import Layout from './component/layout/index.js'
import CreateAritcle from './page/article/createarticle'
import ArticleList from './page/articleList/articleList'

class AppRouter extends React.Component {

  render() {
    let LayoutRouter =
      (
        <Layout>
          <Switch>
            <Route path='/article/list' component={ArticleList} />
            <Route path='/article/create' component={CreateAritcle} />
            <Route path='/article/edit/:id' component={CreateAritcle} />
            {/* <Redirect to="/article/manage" /> */}
            <Route path='/' component={Home} />
            <Route component={Error} />
          </Switch>
        </Layout>
      )

    return (
      <ConfigProvider locale={zhCN}>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" render={() => LayoutRouter} />
          </Switch>
        </Router>
      </ConfigProvider>
    )
  }
}

export default AppRouter;
