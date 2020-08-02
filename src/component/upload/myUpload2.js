import React from 'react'
import { getToken } from '../../utils/auth'
import axios from 'axios'

class uploadComponent extends React.Component {
  constructor(props) {
    super(props);
    // this.fileInput = React.createRef();
    // console.log(getToken());
  }

  upload = () => {
    let fileInput = document.getElementById('file')
    const formData = new FormData();
    // formData.append('photos', this.fileInput.current.files[0]);  //相当于 input:file 中的name属性
    // formData.append('photos',fileInput.value);  //相当于 input:file 中的name属性
    // console.log('formData',formData);
    // console.log('files', this.fileInput.current.files[0]);
    axios('http://localhost:9000/article/public/upload', {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then(response => console.log(response))
  };

  render() {
    return (
      <div>
        <input type="file" name='photos' id='file' />
        <input type="button" value="上传" onClick={this.upload} />
      </div>
    )
  }

}

export default uploadComponent