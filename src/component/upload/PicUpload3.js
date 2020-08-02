import React from 'react'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getToken } from '../../utils/auth'

const props = {
  name: 'photos',
  action: 'http://localhost:9000/article/public/upload',
  headers: {
    'Authorization': 'Bearer ' + getToken()
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 图片上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

class PicUpload extends React.Component {
  render() {
    return (
      <Upload  {...props}>
        <Button>
          <UploadOutlined /> 点击上传文件
        </Button>
      </Upload >
    )
  }
}

export default PicUpload