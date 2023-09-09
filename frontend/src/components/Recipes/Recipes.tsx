import { Ingredient } from "../apiCalls";
export interface Recipe {
  recipe_id: number;
  name: string;
  ingredients: Array<Ingredient>;
  instructions: string[];
}

interface Props {
  recipes: Array<Recipe>;
  setRecipes: (recipes: Array<Recipe>) => void;
};

export function Recipes({recipes, setRecipes}: Props) {
  return (
    <div>
      <h1>Recipes</h1>
      
    </div>
  );
}