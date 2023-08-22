import { FormEvent, useState } from 'react';
import { Ingredient, postNewIngredient } from '../apiCalls';

interface Props {
  ingredients: Array<Ingredient>,
  setIngredients: Function
}

export function AddIngredientForm({ingredients, setIngredients}: Props) {

  const [name, setName] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mass, setMass] = useState('');
  const [postError, setPostError] = useState('');

  interface returnObject {
    id: number;
  }
  function renderIngredient(data: returnObject, ingredient: Omit<Ingredient, 'id'>) {
    if (data.id) {
      setIngredients([...ingredients, {...ingredient, id: data.id}])
    } 
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ingredient = {
      name: name,
      protein_in_grams: protein,
      carbs_in_grams: carbs,
      fat_in_grams: fat,
      mass_in_grams: mass,
    };
    postNewIngredient(ingredient)
      .then((data) => renderIngredient(data, ingredient))
      .catch((err) =>
        setPostError(`Something went wrong posting: ${err.message}`)
      );
  }

  return (
    <form
      className="flex flex-col flex-wrap w-1/3 p-px m-3 border-2 border-solid border-black items-center"
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <h2 className="text-2xl">Add A New Ingredient</h2>
      <div className="border-y border-black">
        <label className="p-2 w-36 inline-block" htmlFor="ingredientName">
          Ingredient Name:
        </label>
        <input
          value={name}
          onChange={(e) => {
            console.log('h');
            setName(e.target.value);
          }}
          className="w-52 text-center"
          type="text"
          placeholder="ex. White Rice"
          name="ingredientName"
        ></input>
      </div>
      <div className="border-y border-black">
        <label className="p-2 w-36 inline-block" htmlFor="proteinGrams">
          Protein Grams:
        </label>
        <input
          value={protein}
          onChange={(e) => {
            setProtein(e.target.value);
          }}
          className="w-52 text-center"
          type="number"
          placeholder="grams of protein in mass"
          name="proteinGrams"
        ></input>
      </div>
      <div className="border-y border-black">
        <label className="p-2 w-36 inline-block" htmlFor="carbGrams">
          Carb Grams:
        </label>
        <input
          value={carbs}
          onChange={(e) => {
            setCarbs(e.target.value);
          }}
          className="w-52 text-center"
          type="number"
          placeholder="grams of carbs in mass"
          name="carbGrams"
        ></input>
      </div>
      <div className="border-y border-black">
        <label className="p-2 w-36 inline-block" htmlFor="fatGrams">
          Fat Grams:
        </label>
        <input
          value={fat}
          onChange={(e) => {
            setFat(e.target.value);
          }}
          className="w-52 text-center"
          type="number"
          placeholder="grams of fat in mass"
          name="fatGrams"
        ></input>
      </div>
      <div className="border-y border-black">
        <label className="p-2 w-36 inline-block" htmlFor="massGrams">
          Mass Grams:
        </label>
        <input
          value={mass}
          onChange={(e) => {
            setMass(e.target.value);
          }}
          className="w-52 text-center"
          type="number"
          placeholder="weight of item in grams"
          name="massGrams"
        ></input>
      </div>
      <button type="submit" className="border border-black p-1 m-2 rounded">
        Submit
      </button>
    </form>
  );
}
