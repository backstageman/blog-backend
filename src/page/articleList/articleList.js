import React, { Component } from 'react'
import { connect } from 'react-redux'
import MyTable from '../../component/table'
import { Select, Input, DatePicker, Button, Row, Col } from 'antd';
import ArticleServices from '../../service/article-services'
import { actionCreators } from './store'
import { actionCreators as ArticleActionCreators } from '../article/store'
import './index.css'

const { RangePicker } = DatePicker;
const { Option } = Select;

class ArticleList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            introduction: '',
            content: '',
            articleTypeid: '',
            createTimeStart: '',
            createTimeEnd: '',
            updateTimeStart: '',
            updateTimeEnd: ''
        }
    }

    componentDidMount() {
        // 获取文章列表
        this.props.changeArticleList()
        // 获取文章分类列表
        this.props.getArticleTypes()
    }

    // 下拉框值改变的时候
    handleSelectChange(value) {
        if (value) {
            this.setState({
                articleTypeid: value
            })
        } else {
            this.setState({
                articleTypeid: ''
            })
        }

    }

    handleInputChage(e) {
        const inputName = e.target.name
        const inputValue = e.target.value || ''
        const obj = {}
        obj[inputName] = inputValue
        this.setState(obj)
    }

    handleCreateDtChange(dates) {
        // moment.js获取时间的毫秒值的方式
        // console.log(dates[0].format('x'));
        if (!dates) {
            this.setState({
                createTimeStart: '',
                createTimeEnd: ''
            })
            return;
        }
        let createTimeStart = dates[0].format('x')
        let createTimeEnd = dates[1].format('x')
        this.setState({
            createTimeStart,
            createTimeEnd
        })
    }

    handleUpdateDtChange(dates) {
        if (dates) {
            let updateTimeStart = dates[0].format('x')
            let updateTimeEnd = dates[1].format('x')
            this.setState({
                updateTimeStart,
                updateTimeEnd
            })
        } else {
            this.setState({
                updateTimeStart: '',
                updateTimeEnd: ''
            })
        }
    }

    // 按条件搜索文章
    handleSearchClick() {
        let queryObj = ArticleServices.articleQueryObj(this.state)
        // 需要将查询条件存储到store中，因为最终点击分页按钮会使用到查询条件
        this.props.changeQueryParams(queryObj)
        // console.log(queryObj);
        this.props.changeArticleList(queryObj)

    }

    render() {
        const { articleTypes, articleList } = this.props
        return (
            <div className="articlelist-container">
                <div className="search-container">
                    <Row>
                        <Col span={8}>
                            <Input placeholder="文章标题"
                                name="title"
                                addonBefore="文章标题"
                                style={{ paddingRight: 15 }}
                                allowClear={true}
                                onChange={(e) => { this.handleInputChage(e) }}
                            />
                        </Col>
                        <Col span={8}>
                            <Input placeholder="文章简介关键字"
                                addonBefore="文章简介"
                                name="introduction"
                                style={{ paddingRight: 15 }}
                                allowClear={true}
                                onChange={(e) => { this.handleInputChage(e) }}
                            />
                        </Col>
                        <Col span={8}>
                            <Input placeholder="文章内容关键字"
                                addonBefore="文章内容"
                                name="content"
                                style={{ paddingRight: 15 }}
                                allowClear={true}
                                onChange={(e) => { this.handleInputChage(e) }}
                            />
                        </Col>
                    </Row>
                    <Row style={{ margin: '10px 0 10px 0' }}>
                        <Col span={8} style={{ paddingRight: 15 }}>
                            <Select
                                defaultValue="请选择文章分类"
                                style={{ width: '100%' }}
                                name="articleType"
                                placeholder="请选择文章类别"
                                allowClear={true}
                                onChange={(value) => this.handleSelectChange(value)}>
                                {
                                    articleTypes.map(item => {
                                        return (
                                            <Option value={item.get('id')} key={item.get('id')}> {item.get('typeName')}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={8} style={{ paddingRight: 15 }}>
                            <RangePicker
                                placeholder={["文章发布日期", "文章发布日期"]}
                                style={{ width: '100%' }}
                                name="createTime"
                                onChange={(dates, dateStrings) => { this.handleCreateDtChange(dates, dateStrings) }}
                            />
                        </Col>
                        <Col span={8} style={{ paddingRight: 15 }}>
                            <RangePicker
                                placeholder={["文章更新日期", "文章更新日期"]}
                                style={{ width: '100%' }}
                                name="updateTime"
                                onChange={(dates, dateStrings) => { this.handleUpdateDtChange(dates, dateStrings) }}
                            />
                        </Col>

                    </Row>
                    <Row>
                        <Col span={8} offset={16} style={{ textAlign: 'right', paddingRight: 15 }}>
                            <Button
                                type="primary"
                                style={{ marginRight: 15 }}
                                onClick={() => this.handleSearchClick()}>
                                搜索
                            </Button>
                        </Col>
                    </Row>
                </div>
                <MyTable
                    articleList={articleList}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    articleList: state.getIn(['articleList', 'articleList']),
    articleTypes: state.getIn(['article', 'articleTypes'])
})

const mapDispatchToProps = (dispatch) => ({
    changeArticleList(queryObj) {
        dispatch(actionCreators.getArticleList(queryObj))
    },
    getArticleTypes() {
        dispatch(ArticleActionCreators.getArticleTypes())
    },
    changeQueryParams(queryParams){
        dispatch(actionCreators.saveQueryParams(queryParams))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList)