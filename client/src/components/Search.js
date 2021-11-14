import React, {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import {useHistory} from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'


export const Search = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const {request} = useHttp()
    const [items, setItems] = useState([])
    useEffect(()=>{
        window.M.updateTextFields()
    }, [])
    const searchInFiles = async event => {
      event.preventDefault()
      let data = new FormData(event.target)
      const response = await request('/api/search-file', 'POST', Object.fromEntries(data), {
         Authorization: `Bearer ${auth.token}`
      })
      setItems(response);
    }

    return(<div className="row">
          <div className="file-search">
            <form onSubmit={searchInFiles}>
              <input name="name" placeholder="Имя" />
              <input name="surname" placeholder="Фамилия" />
              <input name="birth" placeholder="Дата рождения" />
              <input name="gender" placeholder="Пол" />
              <input name="adres" placeholder="Адрес" />
              <input name="country" placeholder="Страна" />
              <input name="city" placeholder="Город" />
              <input name="index" placeholder="Индекс" />
              <button>Искать</button>
            </form>
            <p>Search result</p>
            {items.map((item) => (
                <li className="search-result" key={item}>{item}</li>
            ))}
        </div>
    </div>)
}
