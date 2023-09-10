import { Ingredient } from '../apiCalls';
import { useState } from 'react';

interface Props {
  ingredients: Array<Ingredient>;
  setIngredients: (ingredients: Array<Ingredient>) => void;
}

export function Ingredients({ ingredients, setIngredients }: Props) {
  const [mass, setMass] = useState(100);

  function sortIngredients(criteria: keyof Ingredient) {
    const sortedIngredients = [...ingredients].sort((a, b) => {
      const aAttribute = a[criteria];
      const bAttribute = b[criteria];
      if (typeof aAttribute === 'number' && typeof bAttribute === 'number') {
        return aAttribute - bAttribute;
      }
      return (aAttribute as string).localeCompare(bAttribute as string);
    });
    setIngredients(sortedIngredients);
  }

  const renderedIngredients = ingredients.map((ingredient) => {
    
    return (
      <tr key={ingredient.id}>
        <td className="border border-slate-700 px-1">{ingredient.name}</td>
        <td className="border border-slate-700 px-1">
          {(parseFloat(ingredient.protein_in_grams)/(parseFloat(ingredient.mass_in_grams))*mass).toFixed(1)}g
        </td>
        <td className="border border-slate-700 px-1">
          {((parseFloat(ingredient.carbs_in_grams))/(parseFloat(ingredient.mass_in_grams))*mass).toFixed(1)}g
        </td>
        <td className="border border-slate-700 px-1">
          {((parseFloat(ingredient.fat_in_grams))/(parseFloat(ingredient.mass_in_grams))*mass).toFixed(1)}g
        </td>
        <td className="border border-slate-700 px-1">
          {((parseFloat(ingredient.fiber_in_grams))/(parseFloat(ingredient.mass_in_grams))*mass).toFixed(1)}g
        </td>
        <td className="border border-slate-700 px-1">
          {((parseFloat(ingredient.calories))/(parseFloat(ingredient.mass_in_grams))*mass).toFixed(1)} cal
        </td>
        <td className="border border-slate-700 px-1">
          {mass.toFixed(0)}g
        </td>
        <td className="border border-slate-700 px-1">
          <img
            className="w-10 h-10"
            src={ingredient.img_url}
            alt={ingredient.name}
          />
        </td>
      </tr>
    );
  });

  return (
    <table className="table border border-collapse items-center">
      <tbody>
        <tr>
          <th
            className="bg-purple-300 border border-slate-700 px-1 cursor-pointer hover:bg-purple-500"
            onClick={(e) => {
              sortIngredients('name');
            }}
          >
            Name
          </th>
          <th
            className="bg-purple-300 border border-slate-700 px-1 cursor-pointer hover:bg-purple-500"
            onClick={(e) => {
              sortIngredients('protein_in_grams');
            }}
          >
            Protein
          </th>
          <th
            className="bg-purple-300 border border-slate-700 px-1 cursor-pointer hover:bg-purple-500"
            onClick={(e) => {
              sortIngredients('carbs_in_grams');
            }}
          >
            Carbs
          </th>
          <th
            className="bg-purple-300 border border-slate-700 px-1 cursor-pointer hover:bg-purple-500"
            onClick={(e) => {
              sortIngredients('fat_in_grams');
            }}
          >
            Fat
          </th>
          <th
            className="bg-purple-300 border border-slate-700 px-1 cursor-pointer hover:bg-purple-500"
            onClick={(e) => {
              sortIngredients('fiber_in_grams');
            }}
          >
            Fiber
          </th>
          <th
            className="bg-purple-300 border border-slate-700 px-1 cursor-pointer hover:bg-purple-500"
            onClick={(e) => {
              sortIngredients('calories');
            }}
          >
            Calories
          </th>
          <th className="bg-purple-300 border border-slate-700 px-1 cursor-pointer">
            <div>
              <p>Mass</p>
              <input
                className="w-14 text-center"
                type="number"
                value={mass}
                onChange={(e) => setMass(parseInt(e.target.value))}
              />
            </div>
          </th>
          <th className="bg-purple-300 border border-slate-700 px-1">Image</th>
        </tr>
        {renderedIngredients}
      </tbody>
    </table>
  );
}
