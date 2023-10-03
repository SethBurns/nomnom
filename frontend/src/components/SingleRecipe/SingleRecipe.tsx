import { useParams } from 'react-router-dom';
import { Recipe } from '../Recipes/Recipes';
import { fetchSingleRecipe } from '../apiCalls';
import { useEffect, useState } from 'react';




export function SingleRecipe() {

  const [recipe, setRecipe] = useState<Recipe>();
  const { id } = useParams<{id: string}>();

  useEffect(() => {
    fetchSingleRecipe(Number(id)).then((data) => setRecipe(data));
  }, []);

  if (!recipe) {
    return <h1 className='animate-pulse'>Loading...</h1>;
  }
  return (
    <div>
      <h1>{recipe.name}</h1>
      <h2>Ingredients:</h2>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.name}</li>
        ))}
      </ul>
      <h2>Instructions:</h2>
      <ol>
        {recipe.instructions.map((instruction) => (
          <li key={instruction}>{instruction}</li>
        ))}
      </ol>
    </div>
  );
}
