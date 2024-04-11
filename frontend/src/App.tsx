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
  const [page, setPage] = useState('addIngredient');
  const [recipes, setRecipes] = useState<Array<Recipe>>([]);

  useEffect(() => {
    fetchAllIngredients().then((data) => setIngredients(data));
    fetchAllRecipes().then((data) => setRecipes(data));
  }, []);
  console.log('recipes:', recipes);
  return (
    <div className="flex flex-col items-center w-screen">
      <header className="bg-yellow-400 flex flex-col items-center">
        <h1 className="text-4xl my-4">nOmNoM</h1>
        <nav className="flex w-screen border-b border-black">
          <div className="flex flex-col md:flex-row w-1/2 justify-around">
            <NavLink className='flex justify-center' to="/addIngredient">
              <button
                className="cursor-pointer border-2 w-3/4 md:w-full bg-white transition-all duration-500 border-black p-2 m-2 rounded hover:bg-green-400"
                onClick={() => setPage('addIngredient')}
              >
                Add Ingredient
              </button>
            </NavLink>
            <NavLink className='flex justify-center' to="/recipes">
              <button
                className="cursor-pointer border-2 w-3/4 md:w-full bg-white transition-all duration-500 border-black p-2 m-2 rounded hover:bg-orange-400"
                onClick={() => setPage('recipes')}
              >
                Recipes
              </button>
            </NavLink>
          </div>
          <div className="flex flex-col md:flex-row w-1/2 justify-around">
            <NavLink className='flex justify-center' to="/addRecipe">
              <button
                className="cursor-pointer border-2 w-3/4 md:w-full bg-white transition-all duration-500 border-black p-2 m-2 rounded hover:bg-blue-400"
                onClick={() => setPage('addRecipe')}
              >
                Add Recipe
              </button>
            </NavLink>
            <NavLink className='flex justify-center' to="/">
              <button
                className="cursor-pointer border-2 w-3/4 md:w-full bg-white transition-all duration-500 border-black p-2 m-2 rounded  hover:bg-purple-400"
                onClick={() => setPage('ingredients')}
              >
                Ingredients
              </button>
            </NavLink>
          </div>
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
