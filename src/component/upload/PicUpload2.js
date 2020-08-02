import React, { Component } from 'react'
import axios from 'axios'
import { getToken } from '../../utils/auth'

class PicUpload extends Component {
  constructor(props) {
    super(props)
  }

  handleOnChange(e) {
    e.preventDefault();
    let file = e.target.files[0]
    // console.log(e.target.files[0]);
    let data = new FormData()
    data.append('photos',file)
    console.log(data);
    console.log('photos',data.get('photos'));
    
    // let reader = new FileReader()
    // reader.readAsDataURL(file)
    // reader.onload = ()=>{
    //   // console.log(reader.result);
    // }
    axios('http://localhost:9000/article/public/upload', {
      method: 'POST',
      body: data,
      headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then(response => console.log(response))
  }

  render() {
    return (
      <label>
        <input type="file"
          name="photos"
          // multiple={this.props.isCover}
          // id="file"
          onChange={(e)=>this.handleOnChange(e)}
        />
      </label>
    )
  }
}

export default PicUpload