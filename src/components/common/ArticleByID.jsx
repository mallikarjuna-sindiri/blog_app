
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { FaEdit } from 'react-icons/fa'
import { MdDelete, MdRestore } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import axios from 'axios'


function ArticleByID() {

  const { state } = useLocation()
  const { currentUser } = useContext(userAuthorContextObj)
  const [editArticleStatus, setEditArticleStatus] = useState(false)
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const [currentArticle,setCurrentArticle]=useState(state)
  const [commentStatus,setCommentStatus]=useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  //to enable edit of article
  function enableEdit() {
    setEditArticleStatus(true)
    setError('')
  }

  //to save modified article
  async function onSave(modifiedArticle) {
    try {
      setIsLoading(true)
      setError('')
      
      const articleAfterChanges = { ...state, ...modifiedArticle }
      const currentDate = new Date();
      
      //add date of modification - FIX: month should be +1
      articleAfterChanges.dateOfModification = currentDate.getDate() + "-" + 
        (currentDate.getMonth() + 1) + "-" + 
        currentDate.getFullYear() + " " +
        currentDate.toLocaleTimeString("en-US", { hour12: true })

      console.log('Saving article:', articleAfterChanges)

      //make http put req - NO AUTH REQUIRED
      let res = await axios.put(`http://localhost:4000/author-api/article/${articleAfterChanges.articleId}`,
        articleAfterChanges)

      if (res.data.message === 'article modified') {
        //change edit article status to false
        setEditArticleStatus(false);
        // Update the current article state
        setCurrentArticle(res.data.payload)
        // Navigate back to the same article with updated data
        // Use the current location to determine the correct route
        const currentPath = window.location.pathname;
        navigate(currentPath, { 
          state: res.data.payload,
          replace: true 
        })
      } else {
        setError('Failed to update article')
      }
    } catch (error) {
      console.error('Error updating article:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Failed to update article. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  //add comment by user
  async function addComment(commentObj){
    try {
      setError('')
      //add name of user to comment obj
      commentObj.nameOfUser=currentUser.firstName;
      console.log('Adding comment:', commentObj)
      
      //http put - FIX: use port 4000
      let res=await axios.put(`http://localhost:4000/user-api/comment/${currentArticle.articleId}`,commentObj);
      
      if(res.data.message==='comment added'){
        setCommentStatus(res.data.message)
        // Refresh the article to show new comment
        // You might want to update the currentArticle state here
      } else {
        setError('Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      setError('Failed to add comment. Please try again.')
    }
  }

  //delete article
  async function deleteArticle(){
    try {
      setError('')
      setIsLoading(true)
      
      const articleToDelete = { ...state, isArticleActive: false };
      console.log('Deleting article:', articleToDelete)
      
      // FIX: use port 4000
      let res = await axios.put(`http://localhost:4000/author-api/articles/${state.articleId}`, articleToDelete)
      
      if(res.data.message==='article deleted or restored'){
        setCurrentArticle(res.data.payload)
        // Update the state to reflect the change
        state.isArticleActive = false
      } else {
        setError('Failed to delete article')
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      setError('Failed to delete article. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  //restore article
  async function restoreArticle(){
    try {
      setError('')
      setIsLoading(true)
      
      const articleToRestore = { ...state, isArticleActive: true };
      console.log('Restoring article:', articleToRestore)
      
      // FIX: use port 4000
      let res = await axios.put(`http://localhost:4000/author-api/articles/${state.articleId}`, articleToRestore)
      
      if(res.data.message==='article deleted or restored'){
        setCurrentArticle(res.data.payload)
        // Update the state to reflect the change
        state.isArticleActive = true
      } else {
        setError('Failed to restore article')
      }
    } catch (error) {
      console.error('Error restoring article:', error)
      setError('Failed to restore article. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container'>
      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      {
        editArticleStatus === false ? <>
          {/* print full article */}
          <div className="d-flex justify-contnet-between">
            <div className="mb-5 author-block w-100 px-4 py-2 rounded-2 d-flex justify-content-between align-items-center">
              <div>
                <p className="display-3 me-4">{currentArticle.title}</p>
                {/* doc & dom */}
                <span className="py-3">
                  <small className="text-secondary me-4">
                    Created on : {currentArticle.dateOfCreation}
                  </small>
                  <small className="text-secondary me-4">
                    Modified on : {currentArticle.dateOfModification}
                  </small>
                </span>

              </div>
              {/* author details */}
              <div className="author-details text-center">
                <img 
                  src={currentArticle.authorData.profileImageUrl} 
                  width='60px' 
                  className='rounded-circle' 
                  alt="" 
                />
                <p>
                  {currentArticle.authorData.nameOfAuthor}
                </p>
              </div>

            </div>
            {/* edit & delete */}
            {
              currentUser.role === 'author' && (
                <div className="d-flex me-3">
                  {/* edit button */}
                  <button className="me-2 btn btn-light" onClick={enableEdit} disabled={isLoading}>
                    <FaEdit className='text-warning' />
                  </button>
                  {/* if article is active,display delete icon, otherwise display restore icon */}
                  {
                    currentArticle.isArticleActive === true ? (
                      <button className="me-2 btn btn-light" onClick={deleteArticle} disabled={isLoading}>
                        <MdDelete className='text-danger fs-4' />
                      </button>
                    ) : (
                      <button className="me-2 btn btn-light" onClick={restoreArticle} disabled={isLoading}>
                        <MdRestore className='text-info fs-4' />
                      </button>
                    )
                  }
                </div>
              )
            }
          </div>
          {/* content*/}
          <p className="lead mt-3 article-content" style={{ whiteSpace: "pre-line" }}>
            {currentArticle.content}
          </p>
          {/* user commnets */}
          <div>
            <div className="comments my-4">
              {
                currentArticle.comments.length === 0 ? <p className='display-3'>No comments yet..</p> :
                  currentArticle.comments.map(commentObj => {
                    return <div key={commentObj._id} >
                      <p className="user-name">
                        {commentObj?.nameOfUser}
                      </p>
                      <p className="comment">
                        {commentObj?.comment}
                      </p>
                    </div>
                  })
              }
            </div>
          </div>
          {/* comment form */}
          <h6>{commentStatus}</h6>
          {
            currentUser.role==='user'&&<form onSubmit={handleSubmit(addComment)} >
              <input type="text"  {...register("comment")} className="form-control mb-4" />
              <button className="btn btn-success">
                Add a comment
              </button>
            </form>
          }
        </> :
          <form onSubmit={handleSubmit(onSave)}>
            <div className="mb-4">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                defaultValue={currentArticle.title}
                {...register("title")}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="form-label">
                Select a category
              </label>
              <select
                {...register("category")}
                id="category"
                className="form-select"
                defaultValue={currentArticle.category}
              >
                <option value="programming">Programming</option>
                <option value="AI&ML">AI&ML</option>
                <option value="database">Database</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                {...register("content")}
                className="form-control"
                id="content"
                rows="10"
                defaultValue={currentArticle.content}
              ></textarea>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
      }

    </div>
  )
}

export default ArticleByID
