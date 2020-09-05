import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  PieChartOutlined,
  CopyOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class MainLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      openKeys: ['1', '3', '4', '6', '8']
    }
  }

  onCollapse(collapsed) {
    this.setState({ collapsed });
  };

  onOpenChange(openKeys) {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
            onOpenChange={() => this.onOpenChange}
          >
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              <NavLink to="/">首页</NavLink>
            </Menu.Item>
            <SubMenu key="sub1" icon={<CopyOutlined />} title="文章管理">
              <Menu.Item key="3">
                <NavLink to="/article/list">文章列表</NavLink>
              </Menu.Item>
              <Menu.Item key="4">
                <NavLink to="/article/create">添加文章</NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<UnorderedListOutlined />} title="待开发功能">
              <Menu.Item key="6">
                <NavLink to="/system/bug">系统bug</NavLink>
              </Menu.Item>
              <Menu.Item key="8">
                <NavLink to="/system/new">新功能</NavLink>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>System Code By Mask SuperMan</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default MainLayout