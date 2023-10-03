export interface Recipe {
  id: number;
  name: string;
  ingredients: Array<Ingredient>;
  instructions: string[];
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  protein: string;
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

interface NewRecipe {
  name: string;
  ingredients: { id: number | null; quantity: number | null }[];
  instructions: (string | null)[];
}



export async function fetchAllRecipes() {
  const response = await fetch('http://localhost:3000/recipes');
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data;
}

export async function fetchSingleRecipe(id: number) {
  const response = await fetch(`http://localhost:3000/recipes/${id}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

export async function postNewRecipe(body: NewRecipe) {
  const response = await fetch(`http://localhost:3000/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}
