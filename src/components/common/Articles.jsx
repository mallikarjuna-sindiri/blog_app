import { useState, useEffect } from 'react'
import axios from 'axios'
import { AUTHOR_API } from '../../config/api'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '@clerk/clerk-react'


function Articles() {

  const [articles, setArticles] = useState([])
  const [error, setError] = useState('')
  const navigate=useNavigate()
  const {getToken}=useAuth();

  //get all articles
  async function getArticles() {
    //get jwt token
    const token=await getToken()
    //make authenticated req
  let res = await axios.get(`${AUTHOR_API}/articles`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    if (res.data.message === 'articles') {
      setArticles(res.data.payload)
      setError('')
    } else {
      setError(res.data.message)
    }
  }
  console.log(error)

  //goto specific article
  function gotoArticleById(articleObj){
      navigate(`../${articleObj.articleId}`,{ state:articleObj})
  }


  useEffect(() => {
    getArticles()
  }, [])

  console.log(articles)

  return (
    <div className='container'>
      <div>
      {error.length!==0&&<p className='display-4 text-center mt-5 text-danger'>{error}</p>}
        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 '>
          {
            articles.map((articleObj) => <div className='col' key={articleObj.articleId}>
              <div className="card h-100" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
                <div className="card-body">
                {/* author image  */}
                  <div className="author-details text-end">
                    <img src={articleObj.authorData.profileImageUrl}
                      width='40px'
                      className='rounded-circle'
                      alt="" />
                    {/* author name */}
                    <p>
                      <small className='text-secondary' style={{ color: "var(--text-secondary) !important" }}>
                        {articleObj.authorData.nameOfAuthor}
                      </small>
                    </p>
                  </div>
                  {/* article title */}
                  <h5 className='card-title' style={{ color: "var(--text-primary)" }}>{articleObj.title}</h5>
                  {/* article content upadto 80 chars */}
                  <p className='card-text' style={{ color: "var(--text-secondary)" }}>
                    {articleObj.content.substring(0, 80) + "...."}
                  </p>
                  {/* read more button */}
                  <button className='custom-btn btn-4' onClick={()=>gotoArticleById(articleObj)}>
                    Read more
                  </button>
                </div>
                <div className="card-footer" style={{ backgroundColor: "var(--secondary-bg)", borderTop: "1px solid var(--border-color)" }}>
                {/* article's date of modification */}
                  <small className="text-body-secondary" style={{ color: "var(--text-secondary) !important" }}>
                    Last updated on {articleObj.dateOfModification}
                  </small>
                </div>
              </div>
            </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Articles