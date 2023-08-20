export interface Ingredient {
  id: number;
  name: string;
  protein_in_grams: string;
  carbs_in_grams: string;
  fat_in_grams: string;
  mass_in_grams: string;
}

export async function fetchAllIngredients() {
  const response = await fetch('http://localhost:3000/ingredients')
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const data = await response.json()
  return data
}

export async function fetchSingleIngredient(id: number) {
  const response = await fetch(`http://localhost:3000/ingredients/${id}`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export async function postNewIngredient(body: Omit<Ingredient, 'id'>) {
  const response = await fetch(`http://localhost:3000/ingredients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}