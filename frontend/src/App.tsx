import React from 'react';
import './App.css';
import { Ingredients } from './components/Ingredients/Ingredients';
import { AddIngredientForm } from './components/AddIngredientForm/AddIngredientForm';


function App() {
  return (
    <div className="App">
      <header>
        <h1>nOmNoM</h1>
        <nav>
          {/* nav links will go here */}
        </nav>
      </header>
      <main>
        <Ingredients />
        <AddIngredientForm />
      </main>
    </div>
  );
}

export default App;
