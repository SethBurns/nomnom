import { Ingredient } from '../apiCalls';

interface Props {
  ingredients: Array<Ingredient>;
  setIngredients: Function;
}

export function Ingredients({ ingredients, setIngredients }: Props) {

  function sortIngredients(criteria: keyof Ingredient) {
    const sortedIngredients = [...ingredients].sort((a, b) => {
      const aAttribute = a[criteria]
      const bAttribute = b[criteria]
      if(typeof aAttribute === "number" && typeof bAttribute === "number") {
        return aAttribute - bAttribute
      }
      return (aAttribute as string).localeCompare(bAttribute as string)
    });
    setIngredients(sortedIngredients)
  }

  const renderedIngredients = ingredients.map((ingredient) => {
    return (
      <tr key={ingredient.id}>
        <td className="border border-slate-700 px-1">{ingredient.name}</td>
        <td className="border border-slate-700 px-1">
          {parseFloat(ingredient.protein_in_grams).toFixed(1)}g
        </td>
        <td className="border border-slate-700 px-1">
          {parseFloat(ingredient.carbs_in_grams).toFixed(1)}g
        </td>
        <td className="border border-slate-700 px-1">
          {parseFloat(ingredient.fat_in_grams).toFixed(1)}g
        </td>
        <td className="border border-slate-700 px-1">
          {parseFloat(ingredient.mass_in_grams).toFixed(1)}g
        </td>
      </tr>
    );
  });

  return (
    <table className="table border border-collapse items-center">
      <tbody>
        <tr>
          <th
            className="bg-purple-300 border border-slate-700 px-1"
            onClick={(e) => {
              sortIngredients('name');
            }}
          >
            Name
          </th>
          <th
            className="bg-purple-300 border border-slate-700 px-1"
            onClick={(e) => {
              sortIngredients('protein_in_grams');
            }}
          >
            Protein
          </th>
          <th
            className="bg-purple-300 border border-slate-700 px-1"
            onClick={(e) => {
              sortIngredients('carbs_in_grams');
            }}
          >
            Carbs
          </th>
          <th
            className="bg-purple-300 border border-slate-700 px-1"
            onClick={(e) => {
              sortIngredients('fat_in_grams');
            }}
          >
            Fat
          </th>
          <th
            className="bg-purple-300 border border-slate-700 px-1"
            onClick={(e) => {
              sortIngredients('mass_in_grams');
            }}
          >
            Mass
          </th>
        </tr>
        {renderedIngredients}
      </tbody>
    </table>
  );
}
