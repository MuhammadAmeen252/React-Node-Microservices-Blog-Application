import React, {useState} from "react";
import axios from "axios";

export default () => {
    const [title, setTitle] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        //send request to posts service
        await axios.post('http://posts.com/posts/create',{
            title: title,
        });

    }
    return <div className="">
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="form-control" type="text"></input>
            </div>
            <button className="btn btn-primary"> Submit </button>
        </form>
    </div>
}