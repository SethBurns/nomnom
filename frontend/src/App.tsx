import React, { useState, useEffect } from 'react';
import { Ingredients } from './components/Ingredients/Ingredients';
import { AddIngredientForm } from './components/AddIngredientForm/AddIngredientForm'; 
import { Ingredient, fetchAllIngredients } from './components/apiCalls';


function App() {
  const [ingredients, setIngredients] = useState(Array<Ingredient>);
  const [page, setPage] = useState('home')

  useEffect(() => {
    fetchAllIngredients().then((data) => setIngredients(data));
  }, []);

  return (
    <div className="flex flex-col items-center w-screen">
      <header className='flex flex-col'>
        <h1 className='text-4xl my-4'>nOmNoM</h1>
        <nav>
          {/* nav links will go here */}
        </nav>
      </header>
      <main className='flex w-screen justify-center'>
        <Ingredients ingredients={ingredients} setIngredients={setIngredients}/>
        <AddIngredientForm ingredients={ingredients} setIngredients={setIngredients}/>
      </main>
    </div>
  );
}

export default App;
