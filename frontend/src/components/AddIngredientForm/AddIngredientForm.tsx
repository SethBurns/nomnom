import './AddIngredientForm.css'

export function AddIngredientForm() {

  return (
    <form className='flex column items-center'>
      <label htmlFor='ingredientName'>Ingredient Name: </label>
      <input type='text' placeholder='ex. White Rice' name='ingredientName'></input>
      <label htmlFor='proteinGrams'>Protein Grams: </label>
      <input type='text' placeholder='ex. White Rice' name='proteinGrams'></input>
      <label htmlFor='carbGrams'>Carb Grams: </label>
      <input type='text' placeholder='ex. White Rice' name='carbGrams'></input>
      <label htmlFor='fatGrams'>Fat Grams: </label>
      <input type='text' placeholder='ex. White Rice' name='fatGrams'></input>
      <label htmlFor='massGrams'>Mass Grams: </label>
      <input type='text' placeholder='ex. White Rice' name='massGrams'></input>
    </form>
  )
}