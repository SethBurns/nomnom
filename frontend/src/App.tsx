import React, {useState, useEffect} from 'react';
import { Ingredients } from './components/Ingredients/Ingredients';
import { AddIngredientForm } from './components/AddIngredientForm/AddIngredientForm';
import {
  Ingredient,
  fetchAllIngredients,
  fetchAllRecipes,
} from './components/apiCalls';
import { Route, Routes, NavLink } from 'react-router-dom';
import { Recipes, Recipe } from './components/Recipes/Recipes';
import { SingleRecipe } from './components/SingleRecipe/SingleRecipe';
import AddRecipeForm from './components/AddRecipeForm/AddRecipeForm';

function App() {
  const [ingredients, setIngredients] = useState<Array<Ingredient>>([]);
  const [recipes, setRecipes] = useState<Array<Recipe>>([]);

  useEffect(() => {
    fetchAllIngredients().then((data) => setIngredients(data));
    fetchAllRecipes().then((data) => setRecipes(data));
  }, []);

  return (
    <div className="flex flex-col items-center w-screen">
      <header className="flex flex-col items-center">
        <h1 className="text-4xl my-4">nOmNoM</h1>
        <nav className="flex w-screen justify-evenly border-b border-black">
          <NavLink
            to="/addIngredient"
            className="cursor-pointer border-2 border-black p-2 m-2 rounded hover:bg-green-400"
          >
            Add Ingredient
          </NavLink>
          <NavLink
            to="/recipes"
            className="cursor-pointer border-2 border-black p-2 m-2 rounded hover:bg-orange-400"
          >
            Recipes
          </NavLink>
          <NavLink
            to="/addRecipe"
            className="cursor-pointer border-2 border-black p-2 m-2 rounded hover:bg-blue-400"
          >
            Add Recipe
          </NavLink>
          <NavLink
            to="/"
            className="cursor-pointer border-2 border-black p-2 m-2 rounded  hover:bg-purple-400"
          >
            Ingredients
          </NavLink>
        </nav>
      </header>
      <main className="flex w-screen justify-evenly">
        <Routes>
          <Route
            path="/"
            element={
              <Ingredients
                ingredients={ingredients}
                setIngredients={setIngredients}
              />
            }
          ></Route>
          <Route
            path="/addIngredient"
            element={
              <AddIngredientForm
                ingredients={ingredients}
                setIngredients={setIngredients}
              />
            }
          ></Route>
          <Route
            path="/addRecipe"
            element={<AddRecipeForm ingredients={ingredients} />}
          ></Route>
          <Route
            path="/recipes"
            element={<Recipes recipes={recipes} setRecipes={setRecipes} />}
          ></Route>
          <Route path="/recipes/:id" element={<SingleRecipe />}></Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
