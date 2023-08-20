import { useEffect, useState } from 'react';
import { Ingredient, fetchAllIngredients } from '../apiCalls';
import './Ingredients.css';

export function Ingredients() {
  const [ingredients, setIngredients] = useState(Array<Ingredient>);

  useEffect(() => {
    fetchAllIngredients().then((data) => setIngredients(data));
  }, []);

  const renderedIngredients = ingredients.map((ingredient) => {
    return (
      <tr key={ingredient.id}>
        <td>{ingredient.name}</td>
        <td>{ingredient.protein_in_grams}g</td>
        <td>{ingredient.carbs_in_grams}g</td>
        <td>{ingredient.fat_in_grams}g</td>
        <td>{ingredient.mass_in_grams}g</td>
      </tr>
    );
  });

  return (
    <table className='ingredient-table'>
      <tbody>
        <tr>
          <th>Name</th>
          <th>Protein</th>
          <th>Carbs</th>
          <th>Fat</th>
          <th>Mass</th>
        </tr>
        {renderedIngredients}
      </tbody>
    </table>
  );
}
