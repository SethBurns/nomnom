import { useEffect, useState } from 'react'
import { fetchAllIngredients } from '../apiCalls'
import './Ingredients.css'


export function Ingredients() {

  const [ingredients, setIngredients] = useState([])
  
  useEffect(() => {
    fetchAllIngredients().then(data => setIngredients(data))
  }, [])

  return (
    <section>
      {ingredients}
    </section>
  )
}