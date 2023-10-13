import { Link } from "react-router-dom";
import { Ingredient } from "../apiCalls";

type RecipeIngredient = Ingredient & { quantity_in_grams: string };

export interface Recipe {
  id: number;
  name: string;
  ingredients: Array<RecipeIngredient>;
  instructions: string[];
}

interface Props {
  recipes: Array<Recipe>;
  setRecipes: (recipes: Array<Recipe>) => void;
}

export function Recipes({ recipes, setRecipes }: Props) {
  const recipesList = recipes?.map((recipe) => {
    return (
      <Link
        to={`/recipes/${recipe.id}`}
        key={recipe.id}
        className="flex flex-col text-center border border-black rounded m-2 p-2"
      >
        <h2 className="text-2xl">{recipe.name}</h2>
      </Link>
    );
  });

  return (
    <div>
      <h1>Recipes</h1>
      {recipesList}
    </div>
  );
}
