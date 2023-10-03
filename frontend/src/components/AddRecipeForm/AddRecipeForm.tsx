import { useState } from 'react';
import { Ingredient, postNewRecipe } from '../apiCalls';

interface Props {
  ingredients: Array<Ingredient>;
}

interface NewIngredient {
  id: number | null;
  quantity: number | null;
}

export default function AddRecipeForm({ ingredients }: Props) {
  const [newIngredients, setNewIngredients] = useState<NewIngredient[]>([
    { id: null, quantity: null },
  ]);
  const [newInstructions, setNewInstructions] = useState<(string | null)[]>([
    null,
  ]);
  const [newRecipeName, setNewRecipeName] = useState<string>('');

  const submitRecipe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postNewRecipe({
      name: newRecipeName,
      ingredients: newIngredients,
      instructions: newInstructions,
    });
  };
  const addIngredientInput = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setNewIngredients([...newIngredients, { id: null, quantity: null }]);
  };
  const addInstructionInput = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setNewInstructions([...newInstructions, null]);
  };
  const handleUpdateIngredientID = (
    e: React.SyntheticEvent<HTMLSelectElement, Event>,
    index: number
  ) => {
    const before = newIngredients.slice(0, index);
    const target = newIngredients[index];
    const after = newIngredients.slice(index + 1);
    target.id = Number(e.currentTarget.value);
    setNewIngredients([...before, target, ...after]);
  };
  const handleUpdateIngredientQuantity = (
    e: React.SyntheticEvent<HTMLInputElement, Event>,
    index: number
  ) => {
    const before = newIngredients.slice(0, index);
    const target = newIngredients[index];
    const after = newIngredients.slice(index + 1);
    target.quantity = Number(e.currentTarget.value);
    setNewIngredients([...before, target, ...after]);
  };
  const handleUpdateInstruction = (
    e: React.SyntheticEvent<HTMLInputElement, Event>,
    index: number
  ) => {
    const before = newInstructions.slice(0, index);
    const after = newInstructions.slice(index + 1);
    setNewInstructions([...before, e.currentTarget.value, ...after]);
  };

  return (
    <div className="h-full w-full">
      <h1 className="text-center">Add Recipe</h1>
      <form
        onSubmit={(e) => submitRecipe(e)}
        className="flex flex-col justify-center items-center gap-4"
      >
        <input
          className="border border-black rounded text-center"
          value={newRecipeName}
          onChange={(e) => setNewRecipeName(e.target.value)}
          type="text"
          placeholder="Recipe Name"
        />
        <div className="flex justify-around w-full h-full">
          <section className="h-[80%] w-[40%] flex flex-col justify-evenly border border-black">
            <div className="flex justify-evenly">
              <h2>Add Ingredients</h2>
              <button
                onClick={(e) => addIngredientInput(e)}
                className="border border-black rounded w-8 h-8 hover:bg-black hover:text-white"
              >
                +
              </button>
            </div>
            {newIngredients.map((ingredient, index) => {
              return (
                <div key={index} className="flex justify-evenly">
                  <select
                    defaultValue=""
                    className="border border-black rounded"
                    onChange={(e) => handleUpdateIngredientID(e, index)}
                  >
                    {[
                      <option key={'first'} disabled value="">
                        Select Ingredient
                      </option>,
                      ...ingredients.map((ingredient) => {
                        return (
                          <option key={ingredient.id} value={ingredient.id}>
                            {ingredient.name}
                          </option>
                        );
                      }),
                    ]}
                  </select>
                  <input
                    className="border border-black rounded"
                    type="number"
                    value={ingredient.quantity ?? ''}
                    onChange={(e) => handleUpdateIngredientQuantity(e, index)}
                  />
                </div>
              );
            })}
          </section>
          <section className="h-[80%] w-[40%] flex flex-col justify-evenly border border-black">
            <div className="flex justify-evenly">
              <h2>Add Instructions</h2>
              <button
                onClick={(e) => addInstructionInput(e)}
                className="border border-black rounded w-8 h-8 hover:bg-black hover:text-white"
              >
                +
              </button>
            </div>
            {newInstructions.map((instruction, index) => {
              return (
                <input
                  key={index}
                  className="border border-black rounded"
                  type="text"
                  value={instruction ?? ''}
                  onChange={(e) => handleUpdateInstruction(e, index)}
                />
              );
            })}
          </section>
        </div>
        <button
          type="submit"
          className="border border-black w-1/3 rounded hover:bg-green-700"
        >
          Add Your New Recipe
        </button>
      </form>
    </div>
  );
}
