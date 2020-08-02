import React, { PureComponent } from 'react'
/* eslint-disable */
import { Upload, Modal, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BASE_API from '../../utils/constant'

class PicturesWall extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    imgList: [],
  };

  handleChange = ({ file, fileList }) => {
    console.log(JSON.stringify(file)); // file 是当前正在上传的 单个 img
    console.log(JSON.stringify(fileList)); // fileList 是已上传的全部 img 列表
    this.setState({
      imgList: fileList,
    });
  };


  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };


  // 参考链接：https://www.jianshu.com/p/f356f050b3c9
  handleBeforeUpload = file => {
    //限制图片 格式、size、分辨率
    const isJPG = file.type === 'image/jpeg';
    const isJPEG = file.type === 'image/jpeg';
    const isGIF = file.type === 'image/gif';
    const isPNG = file.type === 'image/png';
    if (!(isJPG || isJPEG || isGIF || isPNG)) {
      Modal.error({
        title: '只能上传JPG 、JPEG 、GIF、 PNG格式的图片~',
      });
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Modal.error({
        title: '超过2M限制，不允许上传~',
      });
      return;
    }
    return (isJPG || isJPEG || isGIF || isPNG) && isLt2M && this.checkImageWH(file);
  };

  //返回一个 promise：检测通过则返回resolve；失败则返回reject，并阻止图片上传
  checkImageWH(file) {
    let self = this;
    return new Promise(function (resolve, reject) {
      let filereader = new FileReader();
      filereader.onload = e => {
        let src = e.target.result;
        const image = new Image();
        image.onload = function () {
          // 获取图片的宽高，并存放到file对象中
          console.log('file width :' + this.width);
          console.log('file height :' + this.height);
          file.width = this.width;
          file.height = this.height;
          resolve();
        };
        image.onerror = reject;
        image.src = src;
      };
      filereader.readAsDataURL(file);
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {// values 是form表单里的参数
      // 点击按钮后，将表单提交给后台
      dispatch({
        type: 'mymodel/submitFormData',
        payload: values,
      });
    });
  };

  render() {
    const { previewVisible, previewImage, imgList } = this.state; //  从 state 中拿数据
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Form.Item label="图片图片">
            {getFieldDecorator('myImg')(
              <Upload
                action={BASE_API + `/public/upload`}
                // action="//jsonplaceholder.typicode.com/posts/" // 这个是接口请求，实际开发中，要替换成你自己的业务接口
                data={file => ({ // data里存放的是接口的请求参数
                  param1: myParam1,
                  param2: myParam2,
                  photoCotent: file, // file 是当前正在上传的图片
                  photoWidth: file.height, // 通过  handleBeforeUpload 获取 图片的宽高
                  photoHeight: file.width,
                })}
                listType="picture-card"
                fileList={this.state.imgList}
                onPreview={this.handlePreview} // 点击图片缩略图，进行预览
                beforeUpload={this.handleBeforeUpload} // 上传之前，对图片的格式做校验，并获取图片的宽高
                onChange={this.handleChange} // 每次上传图片时，都会触发这个方法
              >
                {this.state.imgList.length >= 9 ? null : uploadButton}
              </Upload>
            )}
          </Form.Item>
        </Form>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;