import React, { Component } from 'react'
import MyTable from '../../component/table'
import { Select, Input, DatePicker, Button, Row, Col } from 'antd';
import { getArticle } from '../../api/article'
import { getAllArticleTypes } from '../../api/articleType'
import ArticleServices from '../../service/article-services'
import './index.css'

const { RangePicker } = DatePicker;
const { Option } = Select;

class ArticleList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            articleTypes: [],
            title: '',
            introduction: '',
            content: '',
            articleType: '',
            createTimeStart: '',
            createTimeEnd: '',
            updateTimeStart: '',
            updateTimeEnd: '',
            articleList: [],
            queryResult: {}
        }
    }

    componentDidMount() {
        // 发送请求获取后台文章列表分类数据
        getAllArticleTypes().then(res => {
            // console.log(res);
            if (res.data || res.data.length !== 0) {
                this.setState({
                    articleTypes: res.data
                })
            }
        })
        // 获取文章列表
        // getArticle().then(res => {
        //     console.log(res);
        //     if (res.data.list) {
        //         this.setState({
        //             articleList: res.data.list
        //         })
        //     }
        // })
    }

    // 下拉框值改变的时候
    handleSelectChange(value) {
        this.setState({
            articleType: value
        })
    }

    handleInputChage(e) {
        const inputName = e.target.name
        const inputValue = e.target.value
        const obj = {}
        obj[inputName] = inputValue
        this.setState(obj)
    }

    handleCreateDtChange(dates) {
        // moment.js获取时间的毫秒值的方式
        // console.log(dates[0].format('x'));
        if (!dates) return
        let createTimeStart = dates[0].format('x')
        let createTimeEnd = dates[1].format('x')
        this.setState({
            createTimeStart,
            createTimeEnd
        })
    }

    handleUpdateDtChange(dates) {
        if (!dates) return
        let updateTimeStart = dates[0].format('x')
        let updateTimeEnd = dates[1].format('x')
        this.setState({
            updateTimeStart,
            updateTimeEnd
        })
    }

    // 按条件搜索文章
    handleSearchClick() {
        // console.log(this.state);
        let queryObj = ArticleServices.articleQueryObj(this.state)
        // console.log(queryObj);
        getArticle(queryObj).then(res => {
            // console.log(res);
            if (res.code === 0) {
                this.setState({ queryResult: res })
            }
        })
    }

    render() {
        return (
            <div className="articlelist-container">
                <div className="search-container">
                    <Row>
                        <Col span={8}>
                            <Input placeholder="文章标题"
                                name="title"
                                addonBefore="文章标题"
                                style={{ paddingRight: 15 }}
                                onChange={(e) => { this.handleInputChage(e) }}
                            />
                        </Col>
                        <Col span={8}>
                            <Input placeholder="文章简介关键字"
                                addonBefore="文章简介"
                                name="introduction"
                                style={{ paddingRight: 15 }}
                                onChange={(e) => { this.handleInputChage(e) }}
                            />
                        </Col>
                        <Col span={8}>
                            <Input placeholder="文章内容关键字"
                                addonBefore="文章内容"
                                name="content"
                                style={{ paddingRight: 15 }}
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
                                onChange={(value) => this.handleSelectChange(value)}>
                                {
                                    this.state.articleTypes.map(item => {
                                        return (
                                            <Option value={item.id} key={item.id}> {item.typeName}</Option>
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
                                onClick={() => this.handleSearchClick()}
                            >搜索</Button>
                        </Col>
                    </Row>
                </div>
                <MyTable
                    articleList={this.state.articleList}
                />
            </div>
        )
    }
}

export default ArticleList