import React from 'react'
import { Table, Pagination, Button, Tooltip, message, Modal, Alert } from 'antd';
import moment from 'moment'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { delArticle } from '../../api/article'
import { actionCreators } from '../../page/articleList/store'

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
                  onClick={() => { this.showModal(text) }} />
              </Tooltip>
            </span>
          )
        },
      ],
      articleList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true
      },
      currentRowObj: {},
      visible: false
    }
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
        this.props.changeArticleList()
      } else {
        message.error(res.msg || '删除失败，请稍后再试')
      }
    })
  }

  handleUpdateArticle(text) {
    // 跳转到文章修改页面
    if (text && text.id) {
      // console.log(text);
      return window.location = '/article/edit/' + text.id
    } else {
      return message.error('发生了错误，请刷新页面')
    }
  }
  
  handleChange(current, pageSize) {
    let newQueryObj = {}
    // console.log(current, pageSize);
    // 遍历查询条件
    if (JSON.stringify(this.props.queryObj) !== '{}') {
      // console.log(this.props.queryObj.toJS());
      // console.log(this.props.queryObj);
      Object.assign(newQueryObj, this.props.queryObj.toJS())
    }
    newQueryObj.current = current
    newQueryObj.pageSize = pageSize
    this.props.changeArticleList(newQueryObj);
  }

  render() {
    const { columns } = this.state
    const { articleList, current, pageSize, total } = this.props
    return (
      <>
        <Table
          bordered
          columns={columns}
          dataSource={articleList.toJS()}
          pagination={false}
          rowKey={record => record.id}
        // scroll={{ x: 1500, y: 300 }}
        />
        <Pagination
          current={current}
          total={total}
          pageSize={pageSize}
          defaultCurrent={1}
          showSizeChanger
          showQuickJumper
          showTotal={total => `总计：${total} 条`}
          onChange={(page, pageSize) => this.handleChange(page, pageSize)}
          onShowSizeChange={(current, pageSize) => this.handleChange(current, pageSize)}
          style={{ marginTop: 25, textAlign: "right" }}
          responsive={true}
        />
        <Modal
          title="是否确认删除？"
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

const mapStateToProps = (state) => ({
  articleList: state.getIn(['articleList', 'articleList']),
  current: state.getIn(['articleList', 'current']),
  pageSize: state.getIn(['articleList', 'pageSize']),
  total: state.getIn(['articleList', 'total']),
  queryObj: state.getIn(['articleList', 'queryObj']),
})

const mapDispatchToProps = (dispatch) => ({
  changeArticleList(queryObj) {
    dispatch(actionCreators.getArticleList(queryObj))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyTable)