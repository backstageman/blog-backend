import React, {Component} from 'react'
import axios from 'axios'
import { getToken } from '../../utils/auth'

class FormUpload extends Component {
    submit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        axios('http://localhost:9000/article/public/upload', {
          method: 'POST',
          body: formData,
          headers: { 'Authorization': 'Bearer ' + getToken() }
        }).then(response => console.log(response))
    };

    render() {
        return (
            <div>
                <form onSubmit={this.submit}>
                    <input type="file" name='file'/>
                    <input type="submit" value="上传"/>
                </form>
            </div>
        )
    }
}

export default FormUpload;