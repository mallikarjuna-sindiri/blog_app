import { useState, useEffect } from 'react'
import axios from 'axios'
import { USER_API } from '../../config/api'
import { CATEGORIES } from '../../constants/categories'
import {useNavigate} from 'react-router-dom'


function Articles() {

  const [articles, setArticles] = useState([])
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    author: '',
    sortBy: 'date',
    order: 'desc',
    page: 1,
    limit: 9
  })
  const [meta, setMeta] = useState({ total: 0, totalPages: 0 })
  const navigate=useNavigate()

  //get articles with search/filter
  async function getArticles() {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v)
      })
      const url = `${USER_API}/articles?${params.toString()}`
      const res = await axios.get(url)
      if (res.data.message === 'articles') {
        setArticles(res.data.items || [])
        setMeta({ total: res.data.total || 0, totalPages: res.data.totalPages || 0 })
        setError('')
      } else {
        setError(res.data.message || 'Failed to fetch articles')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch articles')
    }
  }

  //goto specific article
  function gotoArticleById(articleObj){
      navigate(`../${articleObj.articleId}`,{ state:articleObj})
  }


  useEffect(() => {
    const t = setTimeout(() => {
      getArticles()
    }, 300)
    return () => clearTimeout(t)
  }, [filters])

  console.log(articles)

  return (
    <div className='container'>
      <div>
      {/* Filters */}
      <div className='mb-3'>
        <div className='row g-2'>
          <div className='col-12 col-md-4'>
            <input
              type='search'
              className='form-control'
              placeholder='Search title/category/author'
              value={filters.search}
              onChange={(e)=>setFilters(f=>({...f, search:e.target.value, page:1}))}
              style={{ backgroundColor: "var(--primary-bg)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            />
          </div>
          <div className='col-6 col-md-3'>
            <select
              className='form-select'
              value={filters.category}
              onChange={(e)=>setFilters(f=>({...f, category:e.target.value, page:1}))}
              style={{ backgroundColor: "var(--primary-bg)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            >
              <option value=''>All categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className='col-6 col-md-2'>
            <input
              type='text'
              className='form-control'
              placeholder='Author'
              value={filters.author}
              onChange={(e)=>setFilters(f=>({...f, author:e.target.value, page:1}))}
              style={{ backgroundColor: "var(--primary-bg)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            />
          </div>
          <div className='col-6 col-md-2'>
            <select
              className='form-select'
              value={filters.order}
              onChange={(e)=>setFilters(f=>({...f, order:e.target.value, page:1}))}
              style={{ backgroundColor: "var(--primary-bg)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            >
              <option value='desc'>Newest</option>
              <option value='asc'>Oldest</option>
            </select>
          </div>
        </div>
      </div>
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
        {/* Pagination */}
        <div className='d-flex justify-content-center align-items-center my-3 gap-2'>
          <button className='btn btn-outline-secondary'
            onClick={()=>setFilters(f=>({...f, page: Math.max(1, f.page - 1)}))}
            disabled={filters.page<=1}
          >Prev</button>
          <span style={{ color: "var(--text-secondary)" }}>Page {filters.page} / {meta.totalPages || 1}</span>
          <button className='btn btn-outline-secondary'
            onClick={()=>setFilters(f=>({...f, page: meta.totalPages && f.page < meta.totalPages ? f.page + 1 : f.page}))}
            disabled={!meta.totalPages || filters.page>=meta.totalPages}
          >Next</button>
        </div>
      </div>
    </div>
  )
}

export default Articles