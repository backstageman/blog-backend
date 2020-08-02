import React from 'react'
import { Table, Pagination, Button, Tooltip, message, Modal, Alert } from 'antd';
import { getArticle, delArticle } from '../../api/article'
import moment from 'moment'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';

class MyTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          title: 'id',
          dataIndex: 'id',
        },
        {
          title: '标题',
          dataIndex: 'title',
        },
        {
          title: '简介',
          dataIndex: 'introduction',
        },
        {
          title: '内容',
          dataIndex: 'content',
        },
        {
          title: '封面图',
          dataIndex: 'coverImgUrl',
          align: 'center',
          render: text => {
            // console.log(text);
            return (text === '' ? '无' :
              <a href={text}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={text}
                  alt="封面图片"
                  style={{ width: 200 }}
                />
              </a>
            )
          }
        },
        {
          title: '作者',
          dataIndex: 'createUser',
        },
        {
          title: '所属分类',
          dataIndex: 'typeName',
        },
        {
          title: '发布时间',
          dataIndex: 'createTime',
          render: (text, record) => {
            // console.log( moment(record.createTime).format('YYYY/MM/DD hh:mm'));
            return moment(record.createTime).format('YYYY/MM/DD hh:mm')
          }
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          render: (text, record) => {
            // console.log( moment(record.createTime).format('YYYY/MM/DD hh:mm'));
            return moment(record.updateTime).format('YYYY/MM/DD hh:mm')
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          // fixed: 'right',
          render: (text, record) => (
            <span>
              <Tooltip title="预览功能即将开放">
                <Button type="primary" shape="circle" icon={<EyeOutlined />} disabled />
              </Tooltip>
              <Tooltip title="编辑">
                <Button type="primary" shape="circle" icon={<EditOutlined />}
                  style={{ marginRight: 10, marginLeft: 10 }}
                  onClick={() => { this.handleUpdateArticle(text) }}
                />
              </Tooltip>
              <Tooltip title="删除">
                <Button type="danger"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  // onClick={() => { this.handleDeleteArticle(text) }} />
                  onClick={() => { this.showModal(text) }} />
              </Tooltip>
            </span>
          )
        },
      ],
      articleList: [],
      pagination: {
        current: 1,
        pageSize: 6,
        showSizeChanger: true
      },
      currentRowObj: {},
      visible: false
    }
  }

  componentDidMount() {
    this.getArticleListFromDB()
  }

  getArticleListFromDB() {
    getArticle().then(res => {
      // let articleList = []
      // 为响应数据中添加key属性
      // if (res.data.list) {
      //   res.data.list.map((item, index) => {
      //     articleList.push(Object.assign({}, item, { key: item.id }))
      //     // return true 是因为map 函数必须返回
      //     return true
      //   })
      // }
      let { total, page, pageSize } = res.data
      this.setState({
        articleList: res.data.list,
        pagination: {
          total, page, pageSize
        }
      })
    })
  }

  showModal(text) {
    this.setState({
      visible: true,
      currentRowObj: text
    });
  }

  handleConfirmDelete() {
    const text = this.state.currentRowObj
    this.handleDeleteArticle(text)
    this.setState({
      visible: false,
    });
  }

  handleCancelDelete() {
    this.setState({
      visible: false,
    });
  }

  handleDeleteArticle(text) {
    // console.log(text);
    if (!text) {
      return message.error('发生了错误，请刷新页面')
    }
    // 发送请求删除文章
    delArticle(text.id).then(res => {
      // console.log(res);
      if (res.code === 0) {
        message.success('删除成功')
        this.getArticleListFromDB()
      } else {
        message.error(res.msg || '删除失败，请稍后再试')
      }
    })
  }

  handleUpdateArticle(text) {
    // console.log(text.id);
    if (!text) {
      return message.error('发生了错误，请刷新页面')
    }
    // 发送请求修改文章
    getArticle({ id: text.id }).then(res => {
      if (res.code === 0) {
        // console.log(this.props.history);
        // 跳转到文章编辑页面
        // this.props.history.push('/article/add/' + text.id)
        // let url = '/article/add/' + text.id
        // return <Redirect to={url} />
        // 将数据存入到locastorage中
        // 跳转到文章修改页面
        window.location = '/article/edit/' + text.id
      }
    }).catch(err => {
      // 为什么这里不catch就会报错？
      // console.log( err);
    })
  }

  handlePaginationChange(page, pageSize) {
    // console.log(page);
    // console.log(pageSize);
    getArticle({ page, pageSize }).then(res => {
      let { total, page, pageSize } = res.data
      this.setState({
        articleList: res.data.list,
        pagination: {
          total, page, pageSize
        }
      })
    })
  }

  handleShowSizeChange(current, pageSize) {
    getArticle({ pageSize }).then(res => {
      let { total, page, pageSize } = res.data
      this.setState({
        articleList: res.data.list,
        pagination: {
          total, page, pageSize
        }
      })
    })
  }

  render() {
    return (
      <>
        <Table
          bordered
          columns={this.state.columns}
          dataSource={this.state.articleList}
          pagination={false}
          rowKey={record => record.id}
        // scroll={{ x: 1500, y: 300 }}
        />
        <Pagination
          total={this.state.pagination.total}
          pageSize={this.state.pagination.pageSize}
          defaultCurrent={1}
          showSizeChanger
          showQuickJumper
          showTotal={total => `总计：${total} 条`}
          onChange={(page, pageSize) => this.handlePaginationChange(page, pageSize)}
          onShowSizeChange={(current, pageSize) => this.handleShowSizeChange(current, pageSize)}
          style={{ marginTop: 25, textAlign: "right" }}
          responsive={true}
        />
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={() => this.handleConfirmDelete()}
          onCancel={() => this.handleCancelDelete()}
        >
          <Alert message="此操作将永久删除文章，是否继续？" type="warning" showIcon />
        </Modal>
      </>
    )
  }
}

export default MyTable