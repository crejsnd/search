import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Loader } from '../components/Loader'
import { PostsList } from '../components/PostsList'
import { useMessage } from '../hooks/message.hook'
import M from 'materialize-css'

export const PostPage = () => {
    const message = useMessage()
    const [posts, setPosts] = useState([])
    const { loading, request } = useHttp()
    const { token } = useContext(AuthContext)

    const fetchPosts = useCallback(async () => {
        try {
            const fetched = await request('/api/post', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setPosts(fetched)
        } catch (err) { }
    }, [token, request])


    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    if (loading) {
        return <Loader />
    }


    M.Modal.init(document.querySelector('.modal'))

    const createHandler = async () => {
        const $title = document.querySelector('#title')
        const $text = document.querySelector('#text')
        const newPost = {
            title: $title.value,
            text: $text.value
        }
        try {
            const data = await request('/api/post', 'POST',
                newPost,
                {
                    Authorization: `Bearer ${token}`
                })
            message(data.message)
            setTimeout(() => window.location = '/posts', 2300)

        } catch (err) { }

    }


    return (

        <>

            <div className="fixed-action-btn">
                <p className="btn-floating btn-large red modal-trigger" data-target="createForm">
                    <i className="small material-icons">+</i>
                </p>
            </div>

            <div id="createForm" className="modal">
                <div className="modal-content">
                    <h4>Create new post</h4>

                    <div className="input-field">
                        <input id="title" className="validate" type="text" required />
                        <label htmlFor="title">Post Title</label>
                    </div>



                    <div className="input-field">
                        <textarea id="text" className="materialize-textarea"
                            required ></textarea>
                        <label htmlFor="text">Content Post</label>
                    </div>



                </div>
                <div className="modal-footer">
                    <button className="btn waves-effect waves-light" id="createPost" type="submit" onClick={createHandler} >Create</button>
                </div>
            </div>


            {!loading && <PostsList posts={posts} />}
        </>
    )






}