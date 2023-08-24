import React, { useState, useEffect } from 'react';
import { Ingredients } from './components/Ingredients/Ingredients';
import { AddIngredientForm } from './components/AddIngredientForm/AddIngredientForm';
import { Ingredient, fetchAllIngredients } from './components/apiCalls';
import { Route, Routes, NavLink } from 'react-router-dom';

function App() {
  const [ingredients, setIngredients] = useState(Array<Ingredient>);
  const [page, setPage] = useState('addIngredient');

  useEffect(() => {
    fetchAllIngredients().then((data) => setIngredients(data));
  }, []);

  return (
    <div className="flex flex-col items-center w-screen">
      <header className="flex flex-col items-center">
        <h1 className="text-4xl my-4">nOmNoM</h1>
        <nav className="flex w-screen justify-evenly border-b border-black">
          <NavLink to="/addIngredient">
            <button
              className="cursor-pointer border-2 border-black p-2 m-2 rounded hover:bg-green-400"
              onClick={() => setPage('addIngredient')}
            >
              Add Ingredient
            </button>
          </NavLink>
          <NavLink to="/">
            <button
              className="cursor-pointer border-2 border-black p-2 m-2 rounded  hover:bg-purple-400"
              onClick={() => setPage('ingredients')}
            >
              Ingredients
            </button>
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
