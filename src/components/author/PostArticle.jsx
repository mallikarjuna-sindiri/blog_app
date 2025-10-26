import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { AUTHOR_API } from '../../config/api'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../../constants/categories'

function PostArticle() {

  const { register, handleSubmit, formState: { errors } } = useForm()
  const { currentUser } = useContext(userAuthorContextObj)
  const navigate = useNavigate()

  async function postArticle(articleObj) {
    try {
      console.log('Submitting article:', articleObj)

      //create article object as per article schema
      const authorData = {
        nameOfAuthor: currentUser.firstName,
        email: currentUser.email,
        profileImageUrl: currentUser.profileImageUrl
      }
      articleObj.authorData = authorData;

      //article id(timestamp)
      articleObj.articleId = Date.now();

      //add date of creation & date of modification - FIX: month should be +1
      let currentDate = new Date();
      articleObj.dateOfCreation = currentDate.getDate() + "-"
        + (currentDate.getMonth() + 1) + "-"
        + currentDate.getFullYear() + " "
        + currentDate.toLocaleTimeString("en-US", { hour12: true })

      articleObj.dateOfModification = currentDate.getDate() + "-"
        + (currentDate.getMonth() + 1) + "-"
        + currentDate.getFullYear() + " "
        + currentDate.toLocaleTimeString("en-US", { hour12: true })
      
      //add comments array
      articleObj.comments = [];
      //add article active state
      articleObj.isArticleActive = true;
      
      console.log('Final article object:', articleObj)
      
      //make HTTP POST req to create new article in backend - FIX: use port 4000
  let res = await axios.post(`${AUTHOR_API}/article`, articleObj)
      
      if (res.status === 201) {
        //navigate to articles component
        navigate(`/author-profile/${currentUser.email}/articles`)
      } else {
        console.error('Failed to create article:', res.data)
        alert('Failed to create article. Please try again.')
      }
    } catch (error) {
      console.error('Error creating article:', error)
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`)
      } else {
        alert('Failed to create article. Please check your connection and try again.')
      }
    }
  }

  return (
    <div className="container ">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8 col-md-8 col-sm-10">
          <div className="card shadow" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
            <div className="card-title text-center border-bottom" style={{ borderBottomColor: "var(--border-color) !important" }}>
              <h2 className="p-3" style={{ color: "goldenrod" }}>
                Write an Article
              </h2>
            </div>
            <div className="card-body" style={{ backgroundColor: "var(--secondary-bg)" }}>
              {/* {err.length!==0&&<p className='text-danger fs-5'>{err}</p>} */}
              <form onSubmit={handleSubmit(postArticle)}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label" style={{ color: "var(--text-primary)" }}>
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    {...register("title")}
                    style={{ backgroundColor: "var(--primary-bg)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                  />
                  {/* title validation err msg */}

                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="form-label" style={{ color: "var(--text-primary)" }}>
                    Select a category
                  </label>
                  <select
                    {...register("category")}
                    id="category"
                    className="form-select"
                    defaultValue=""
                    style={{ backgroundColor: "var(--primary-bg)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                  >
                    <option value="" disabled>--categories--</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="content" className="form-label" style={{ color: "var(--text-primary)" }}>
                    Content
                  </label>
                  <textarea
                    {...register("content")}
                    className="form-control"
                    id="content"
                    rows="10"
                    style={{ backgroundColor: "var(--primary-bg)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                  ></textarea>
                  {/* title validation err msg */}

                </div>

                <div className="text-end">
                  <button type="submit" className="add-article-btn">
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostArticle