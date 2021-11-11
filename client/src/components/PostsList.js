import React from 'react'

export const PostsList = ({ posts }) => {
  if (!posts.length) {
    return <p className="centr">no posts yet</p>
  }
  return (

    posts.map(post => {
      return (

        <div className="card z-depth-4" key={post._id}>
          <div className="card-content">
            <p align="center" className="card-title">{post.title}</p>
            <textarea className="materialize-textarea" value={post.text}></textarea>
            <small>{post.data}</small>
          </div>
          <div className="card-action">
            <button className="btn btn-small red">
              <i className="material-icons">delete</i>
            </button>
          </div>
        </div>)
    })

  )

}