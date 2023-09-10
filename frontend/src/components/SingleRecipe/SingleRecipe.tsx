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

  return (
    <div>
      <h1>{recipe?.name}</h1>
    </div>
  );
}
