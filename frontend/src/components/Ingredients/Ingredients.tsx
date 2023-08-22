
import { Ingredient } from '../apiCalls';

interface Props {
  ingredients: Array<Ingredient>,
  setIngredients: Function,
}

export function Ingredients({ingredients, setIngredients}: Props) {
  
  function sortIngredients(criteria: string | number) {
    const sortedIngredients = ingredients.sort((a, b) => {
      return a[criteria] - b[criteria]
    })

    setIngredients(sortedIngredients)
  }

  const renderedIngredients = ingredients.map((ingredient) => {
    return (
      <tr key={ingredient.id}>
        <td className='border border-slate-700 px-1'>{ingredient.name}</td>
        <td className='border border-slate-700 px-1'>{parseFloat(ingredient.protein_in_grams).toFixed(1)}g</td>
        <td className='border border-slate-700 px-1'>{parseFloat(ingredient.carbs_in_grams).toFixed(1)}g</td>
        <td className='border border-slate-700 px-1'>{parseFloat(ingredient.fat_in_grams).toFixed(1)}g</td>
        <td className='border border-slate-700 px-1'>{parseFloat(ingredient.mass_in_grams).toFixed(1)}g</td>
      </tr>
    );
  });

  return (
    <table className='table border border-collapse items-center'>
      <tbody>
        <tr>
          <th className='border border-slate-700 px-1'>Name</th>
          <th className='border border-slate-700 px-1'>Protein</th>
          <th className='border border-slate-700 px-1'>Carbs</th>
          <th className='border border-slate-700 px-1'>Fat</th>
          <th className='border border-slate-700 px-1'>Mass</th>
        </tr>
        {renderedIngredients}
      </tbody>
    </table>
  );
}
