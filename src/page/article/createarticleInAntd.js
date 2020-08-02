import React from 'react'
import { Form, Input, Button, Row, Col, Select, Switch, message } from 'antd';
import PicturesWall from '../../component/upload/index'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import './index.css'
import { getAllArticleTypes } from '../../api/articleType'
import { createArticle, getArticle } from '../../api/article'
import ArticleServices from '../../service/article-services'
import marked from 'marked'

const { TextArea } = Input;
const { Option } = Select;

// 配置marked，解析markdown
// `highlight` example uses `highlight.js`
marked.setOptions({
  renderer: new marked.Renderer(),
  /*   highlight: function (code, language) {
      const hljs = require('highlight.js');
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      return hljs.highlight(validLanguage, code).value;
    }, */
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

class CreateArticle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      introduction: '',
      content: '',
      coverImg: '',
      illustration: '',
      articleType: '',
      isPublish: true,
      introductionHtml: '',
      contentHtml: '',
      articleTypes: [],
      // 上传封面图片，子组件传给父组件的数据
      coverImgObj: {},
      // 内容插图的图片数组
      illustrationArrs: [],
      isUpdate: false
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
    // this.props.match.params获取动态路由参数
    // console.log('hello', this.props.match.params.id);
    // 获得当前url
    // console.log(this.props.location.pathname);
    if (this.props.location.pathname.indexOf('edit') !== -1) {
      // 从url中解析出来请求参数
      const id = this.props.match.params.id
      // 发送请求修改文章
      getArticle({ id }).then(res => {
        console.log('faqi', res);
        // console.log(this.props.history);
        // 跳转到文章编辑页面
        // this.props.history.push('/article/add/' + text.id)
        // let url = '/article/add/' + text.id
        // return <Redirect to={url} />
        // 将数据存入到locastorage中
        // 数据回显，写入到表格中
        if (res.data) {
          this.articleDataEcho(res.data)
        } else {
          message.error('发生了错误，请刷新页面')
        }
      }).catch(err => {
        // 为什么这里不catch就会报错？
        // console.log( err);
      })
    }
  }

  // 子组件设置父组件的封面图片对象
  setCoverImgFromSon(coverImgObj) {
    // console.log(coverImgObj);
    this.setState({
      coverImgObj: coverImgObj
    })
  }

  // 子组件设置父组件的文章插图数组
  setillustrationArrsFromSon(illustrationArrs) {
    // console.log(illustrationArrs);
    this.setState({
      illustrationArrs: illustrationArrs
    })
  }

  // 数据回显，在表格中展示
  articleDataEcho(article) {
    const { title, introduction, content, coverImgid, coverImgUrl,
      illustrationsid, illustrationsUrl, isPublish, articleTypeid
    } = article
    this.setState({
      title,
      introduction,
      content
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    let { title, introduction, content, articleType } = this.state
    // console.log(typeof title)
    // console.log(typeof articleType)
    // console.log(articleType)
    // console.log(title.trim().length === 0)
    if (title.trim().length === 0) {
      return message.error('文章标题不能为空')
    } else if (introduction.trim().length === 0) {
      return message.error('文章简介不能为空')
    } else if (content.trim().length === 0) {
      return message.error('文章内容不能为空')
    } else if (articleType.toString().trim().length === 0) {
      return message.error('请选择文章分类')
    } else {
      // 创建文章对象，添加数据，发送请求
      // console.log(this.state);
      const article = ArticleServices.createArticle(this.state)
      // console.log(article);
      createArticle(article).then(res => {
        if (res.code === 0) {
          message.success(res.msg)
          // 清空表格内所有数据，清空表格校验结果，待完成
          // 跳转到文章列表页面
        } else {
          message.error('文章添加失败，请检查文章内容。')
        }
      }).catch(e => {
        console.log(e);
      })
      // message.success('文章校验通过')
    }
  }

  handleSelectChange(value) {
    this.setState({
      articleType: value
    })
  }

  handleIsPublishChange(value) {
    this.setState({
      isPublish: value
    })
  }

  handleTitleChange(e) {
    let title = e.target.value
    this.setState({
      title
    })
  }

  handleIntroductionChange(e) {
    let introduction = e.target.value
    let introductionHtml = marked(introduction)
    this.setState({
      introduction,
      introductionHtml
    })
  }

  handleContentChange(e) {
    let content = e.target.value
    let contentHtml = marked(content)
    this.setState({
      content,
      contentHtml
    })
  }

  // 设置简介预览和内容预览
  setPreview(obj) {
    if (obj.hasOwnProperty('introduction')) {
      let introductionHtml = marked(obj.introduction)
      this.setState({
        introductionHtml
      })
    } else {
      let contentHtml = marked(obj.content)
      this.setState({
        contentHtml
      })
    }
  }

  // 一下都是表单的事件
  onFormFinish(values) {
    console.log('Success:', values);
  }

  onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  onFieldsChange(changedFields, allFields) {
    // console.log('changedFields', changedFields);
    // console.log('allFields', allFields);
  }

  onValuesChange(changedValues, allValues) {
    console.log('changedValues', changedValues);
    // console.log('allValues', allValues);
    console.log(changedValues.hasOwnProperty('content'));
    if (changedValues.hasOwnProperty('content') || changedValues.hasOwnProperty('introduction')) {
      this.setPreview(changedValues)
    }
  }

  etValueProps(value) {
    console.log('value', value);
  }

  render() {
    const { articleTypes, introductionHtml, contentHtml } = this.state
    return (
      <div className="article-container">
        <Form
          // initialValues={{ isPublish: this.state.isPublish }}
          onFinish={(values) => { this.onFormFinish(values) }}
          onFinishFailed={(errorInfo) => { this.onFinishFailed(errorInfo) }}
          onFieldsChange={(changedFields, allFields) => { this.onFieldsChange(changedFields, allFields) }}
          onValuesChange={(changedValues, allValues) => { this.onValuesChange(changedValues, allValues) }}
        >
          <Row>
            <Col span={24}>
              <Form.Item
                label="文章标题"
                name="title"
                rules={[{ required: true, message: '请输入文章标题!' }]}
              >
                <Input
                  // name="title"
                  // value={this.state.title}
                  placeholder='请输入文章标题'
                // onChange={e => { this.handleTitleChange(e) }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label="文章简介"
                name="introduction"
                rules={[{ required: true, message: '请输入文章简介!' }]}
              >
                <TextArea
                  placeholder="请输入文章简介"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                // name="introduction"
                // value={introduction}
                // onChange={e => { this.handleIntroductionChange(e) }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="简介预览"
              >
                <div className="preview"
                  dangerouslySetInnerHTML={{ __html: introductionHtml }}
                ></div>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label="文章内容"
                name="content"
                rules={[{ required: true, message: '请输入文章内容!' }]}
              >
                <TextArea
                  placeholder="请输入文章内容"
                  // name="content"
                  // value={content}
                  autoSize={{ minRows: 20, maxRows: 30 }}
                // onChange={e => this.handleContentChange(e)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="内容预览"
              >
                <div className="preview content"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                  disabled
                ></div>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label="上传文章封面"
                name="coverImg"
              >
                <PicturesWall
                  isCover={true}
                  imgLimitLength={1}
                  setCoverImgFromSon={(coverImgObj) => { this.setCoverImgFromSon(coverImgObj) }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="上传文章插图"
                name="illustration"
              >
                <PicturesWall
                  isCover={false}
                  imgLimitLength={9}
                  setillustrationArrsFromSon={(illustrationArrs) => { this.setillustrationArrsFromSon(illustrationArrs) }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label="选择文章类别"
                name="articleType"
                rules={[{ required: true, message: '请选择文章类别!' }]}
              >
                <Select
                  // defaultValue="1"
                  // name="articleType"
                  placeholder="请选择文章类别"
                // onChange={(value) => this.handleSelectChange(value)}
                >
                  {
                    articleTypes.map(item => {
                      return (
                        <Select.Option value={item.id} key={item.id}> {item.typeName}</Select.Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="是否发布"
                name="isPublish"
                // rules={[{ required: true }]}
                // valuePropName={this.state.isPublish}
                // valuePropName={true}
                getValueProps={(value) => this.etValueProps(value)}
                // valuePropName={this.state.isPublish}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={this.state.isPublish ? true : false}
                // onChange={(e, value) => this.handleIsPublishChange(e, value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={8}>
              {/* <Button type="primary" block onClick={(e) => { this.handleSubmit(e) }}>提交文章</Button> */}
              <Button type="primary" htmlType="submit" block>提交文章</Button>
            </Col>
          </Row>
        </Form >
      </div >
    )
  }
}

export default CreateArticle