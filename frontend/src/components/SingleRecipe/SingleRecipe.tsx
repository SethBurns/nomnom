import { useParams } from "react-router-dom";
import { Recipe } from "../Recipes/Recipes";
import { fetchSingleRecipe } from "../apiCalls";
import { useEffect, useState } from "react";

export function SingleRecipe() {
  const [recipe, setRecipe] = useState<Recipe>();
  const [servings, setServings] = useState<number>(1);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchSingleRecipe(Number(id)).then((data) => setRecipe(data));
  }, [id]);

  if (!recipe) {
    return <h1 className="animate-pulse">Loading...</h1>;
  }

  return (
    <div>
      <h1>{recipe.name}</h1>
      <h2>Ingredients:</h2>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.name} - {parseFloat(ingredient.quantity_in_grams)}g
          </li>
        ))}
      </ul>
      <h2>Instructions:</h2>
      <ol>
        {recipe.instructions.map((instruction) => (
          <li key={instruction}>{instruction}</li>
        ))}
      </ol>
      <h2>Macros (per serving):</h2>
      <input
        type="number"
        value={servings}
        onChange={(e) => {
          if (e.target.value !== "0") setServings(parseInt(e.target.value));
        }}
      />
      <ul>
        <li>
          Calories - {reduceMacros(recipe.ingredients, "calories", servings)}g
        </li>
        <li>
          Protein -{" "}
          {reduceMacros(recipe.ingredients, "protein_in_grams", servings)}g
        </li>
        <li>
          Carbs - {reduceMacros(recipe.ingredients, "carbs_in_grams", servings)}
          g
        </li>
        <li>
          Fat - {reduceMacros(recipe.ingredients, "fat_in_grams", servings)}g
        </li>
        <li>
          Fiber - {reduceMacros(recipe.ingredients, "fiber_in_grams", servings)}
          g
        </li>
      </ul>
    </div>
  );
}

function reduceMacros(
  ingredients: Recipe["ingredients"],
  macroProperty:
    | "calories"
    | "protein_in_grams"
    | "carbs_in_grams"
    | "fat_in_grams"
    | "fiber_in_grams",
  servings: number
) {
  return (
    ingredients.reduce((calories, ingredient) => {
      return (
        calories +
        parseFloat(ingredient[macroProperty]) *
          (parseFloat(ingredient.quantity_in_grams) /
            parseFloat(ingredient.mass_in_grams))
      );
    }, 0) / servings
  ).toFixed(1);
}