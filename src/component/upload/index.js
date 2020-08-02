import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getToken } from '../../utils/auth'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: [
      ],
    }
  }
  
  componentDidMount(){
    // 更新功能如何一进来就获取父组件中的所有封面文件和插图文件
    // this.props.getCoverFileListFromFather()
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    // console.log(file.url);
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    });
  };

  //上传中、完成、失败每次都会调用这个函数
  handleChange = ({ file, fileList }) => {
    // console.log(file);
    // console.log(Object.toString().matchAll(event));
    // if (file.status !== 'uploading') {
    // message.info('文章正在上传')
    // }
    if (file.status === 'error') {
      if (file.response.msg) {
        message.error(file.response.msg)
      } else {
        message.error(`文件上传失败`);
      }
    } else if (file.status === 'done') {
      if (file.response.msg) {
        message.success(file.response.msg)
      } else {
        message.success(`文件上传成功`);
      }
      // console.log(file);
      // console.log(fileList);
      // 更新fileList中的数据
      if (this.props.isCover) {
        // 将封面图片对象传给父组件
        this.props.setCoverImgFromSon(file.response.data)
      } else {
        this.props.setillustrationArrsFromSon(fileList)
      }
    }
    // message.success('上传文件成功')
    // console.log(fileList);
    this.setState({ fileList });
  }

  // 上传处理函数
  beforeUpload(file) {
    // console.log(file);
    // console.log(Object.prototype.toString.call(this.state.fileList)  );
  }

  // 移除文件的响应函数
  handleRemove() {
    message.success('电子书删除成功')
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={`http://localhost:9090/public/upload`}
          listType="picture-card"
          accept='.img,.jpg,.jpeg,.png,.gif'
          headers={{ Authorization: `Bearer ${getToken()}` }}
          onPreview={this.handlePreview}
          onChange={(file, fileList, event) => this.handleChange(file, fileList, event)}
          onRemove={() => this.handleRemove()}
          beforeUpload={file => this.beforeUpload(file)}
          fileList={fileList}
          name={'photos'}
          data={{ isCover: this.props.isCover }}
        >
          {
            fileList.length >= this.props.imgLimitLength ? null : uploadButton
          }
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div >
    );
  }
}

export default PicturesWall