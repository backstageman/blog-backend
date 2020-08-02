import React from 'react'
import { Input, Button, Row, Col, Select, Switch, message } from 'antd';
import PicturesWall from '../../component/upload/index'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import './index.css'
import { getAllArticleTypes } from '../../api/articleType'
import { createArticle, getArticle, updateArticle } from '../../api/article'
import ArticleServices from '../../service/article-services'
import marked from 'marked'

const { TextArea } = Input;
// const { Option } = Select;

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
      contentHtml: '',
      introductionHtml: '',
      articleTypes: [],
      // 上传封面图片，子组件传给父组件的数据
      coverImgObj: {},
      // 内容插图的图片数组
      illustrationArrs: [],
      // 数据回显的时候用来设定select的默认选择项目
      articleTypeName: '',
      // 子组件的封面文件列表
      coverFileList: [],
      // 子组件的内容插图文件列表
      illustrationFileList: [],
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
      // 修改状态，表示是修改页面
      this.setState({
        isUpdate: true
      })
      // 从url中解析出来请求参数
      const id = this.props.match.params.id
      // 发送请求修改文章
      getArticle({ id }).then(res => {
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
        // console.log(err);
      })
    }
  }

  // 数据回显，在表格中展示
  articleDataEcho(article) {
    const { title, introduction, content, coverImgid, coverImgUrl,
      illustrationsid, illustrationsUrl, isPublish, articleTypeid
    } = article
    // console.log(article);
    // console.log(this.state.articleType);
    // console.log(this.state.articleTypes);
    let contentHtml = marked(content)
    let introductionHtml = marked(introduction)
    let coverFileList = []
    let illustrationFileList = []
    if (coverImgid && coverImgUrl) {
      coverFileList.push(this.composeFileList(coverImgid, coverImgUrl))
    }
    if (illustrationsid && illustrationsUrl) {
      illustrationFileList.push(this.composeFileList(illustrationsid, illustrationsUrl))
    }
    let articleTypeName = ''
    this.state.articleTypes.map((value, index) => {
      if (value.id === +articleTypeid) {
        articleTypeName = value.typeName
      }
      return true
    })
    // console.log(articleTypeName);
    let isPublishEscape = isPublish === 'true' ? true : false
    this.setState({
      title,
      introduction,
      introductionHtml,
      content,
      contentHtml,
      isPublish: isPublishEscape,
      articleType: articleTypeid,
      articleTypeName,
      coverFileList,
      illustrationFileList
    })
  }

  // 将父组件中的数据传给子组件
  // getCoverFileListFromFather() {
  //   let coverFileList = []
  //   console.log(1);
  //   if (this.state.isUpdate) {
  //     return coverFileList = this.state.coverFileList
  //   } else {
  //     return coverFileList
  //   }
  // }

  // 将父组件中的数据传给子组件
  // getIllustrationFileListFromFather() {
  //   let illustrationFileList = []
  //   if (this.state.isUpdate) {
  //     return illustrationFileList = this.state.illustrationFileList
  //   } else {
  //     return illustrationFileList
  //   }
  // }

  // 将图片组成fileList
  composeFileList(picid, picUrl) {
    let picObj = {}
    picObj['uid'] = picid
    picObj['url'] = picUrl
    picObj['status'] = 'done'
    picObj['name'] = picUrl.split('/img/')[1]
    return picObj
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
      if (!this.state.isUpdate) {
        // 提交文章
        createArticle(article).then(res => {
          if (res.code === 0) {
            message.success(res.msg)
            // 清空表格内所有数据，清空表格校验结果，待完成
            // 跳转到文章列表页面
          } else {
            message.error('文章添加失败，请检查文章内容。')
          }
        }).catch(e => {
          message.error(e)
        })
        message.success('文章校验通过')
      } else {
        // 获取文章id
        const id = this.props.match.params.id
        article.id = id
        // 修改文章
        updateArticle(article).then(res => {
          console.log(res);
          if (res.code === 0) {
            message.success('修改文章成功!')
            // 路由跳转
            this.props.history.push('/article/list')
          }
        }).catch(e => {
          message('文章修改失败，请稍后再试。')
        })
      }
    }
  }

  // 处理回显以及select选择
  handleSelectChange(value) {
    // console.log(value);
    let articleTypeName = ''
    this.state.articleTypes.map((obj, index) => {
      if (obj.id === +value) {
        articleTypeName = obj.typeName
      }
      return true
    })
    this.setState({
      articleType: value,
      articleTypeName
    })
  }

  handleIsPublishChange(value) {
    // console.log('ispublish',value);
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

  render() {
    const { title, introduction, content, articleTypes, articleType, articleTypeName, isUpdate, articleTypeid, introductionHtml, contentHtml } = this.state
    return (
      <div className="article-container">
        <Row>
          <Col span={24}>
            <span className="predesc">文章标题：</span>
            <Input
              allowClear
              name="title"
              value={title}
              placeholder='请输入文章标题'
              onChange={e => { this.handleTitleChange(e) }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <span>文章简介：</span>
            <TextArea
              placeholder="请输入文章简介"
              autoSize={{ minRows: 3, maxRows: 5 }}
              name="introduction"
              value={introduction}
              onChange={e => { this.handleIntroductionChange(e) }}
            />
          </Col>
          <Col span={12}>
            <span>简介预览：</span>
            <div className="preview"
              dangerouslySetInnerHTML={{ __html: introductionHtml }}
            ></div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <span>文章内容：</span>
            <TextArea
              placeholder="请输入文章内容"
              name="content"
              value={content}
              autoSize={{ minRows: 20, maxRows: 30 }}
              onChange={e => this.handleContentChange(e)}
            />
          </Col>
          <Col span={12}>
            <span>内容预览：</span>
            <div className="preview content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
              disabled
            ></div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <span>上传文章封面：</span>
            <PicturesWall
              isCover={true}
              imgLimitLength={1}
              // FileList={this.state.isUpdate ? [] : this.state.coverFileList}
              getCoverFileListFromFather={this.getCoverFileListFromFather}
              setCoverImgFromSon={(coverImgObj) => { this.setCoverImgFromSon(coverImgObj) }} />
          </Col>
          <Col span={12}>
            <span>上传文章插图：</span>
            <PicturesWall
              isCover={false}
              imgLimitLength={9}
              FileList={this.state.isUpdate ? [] : this.state.illustrationFileList}
              setillustrationArrsFromSon={(illustrationArrs) => { this.setillustrationArrsFromSon(illustrationArrs) }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <span>选择文章类别：</span>
            <Select
              name="articleType"
              placeholder="请选择文章类别"
              value={isUpdate ? articleTypeName : '请选择文章类别'}
              onChange={(value) => this.handleSelectChange(value)}
            >
              {
                articleTypes.map(item => {
                  return (
                    <Select.Option value={item.id} key={item.id}>{item.typeName}</Select.Option>
                  )
                })
              }
            </Select>
          </Col>
          <Col span={12}>
            <span>是否发布：</span>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              checked={this.state.isPublish}
              onChange={(e, value) => this.handleIsPublishChange(e, value)}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8} offset={8}>
            <Button type="primary" block onClick={(e) => { this.handleSubmit(e) }}>
              {
                this.state.isUpdate ? '提交修改' : '提交文章'
              }
            </Button>
          </Col>
        </Row>
      </div >
    )
  }
}

export default CreateArticle