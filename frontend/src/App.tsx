import React, { useCallback, useEffect, useState } from 'react';
import './App.css';

const fields = [
  ['calories', 'Calories', 'kcal'],
  ['protein_in_grams', 'Protein', 'g'],
  ['carbs_in_grams', 'Carbs', 'g'],
  ['fat_in_grams', 'Fat', 'g'],
  ['fiber_in_grams', 'Fiber', 'g'],
  ['vitamin_a_mcg', 'Vitamin A', 'mcg RAE'],
  ['vitamin_c_mg', 'Vitamin C', 'mg'],
  ['vitamin_d_mcg', 'Vitamin D', 'mcg'],
  ['vitamin_e_mg', 'Vitamin E', 'mg'],
  ['vitamin_k_mcg', 'Vitamin K', 'mcg'],
  ['thiamin_mg', 'Thiamin (B1)', 'mg'],
  ['riboflavin_mg', 'Riboflavin (B2)', 'mg'],
  ['niacin_mg', 'Niacin (B3)', 'mg'],
  ['pantothenic_acid_mg', 'Pantothenic acid (B5)', 'mg'],
  ['vitamin_b6_mg', 'Vitamin B6', 'mg'],
  ['vitamin_b12_mcg', 'Vitamin B12', 'mcg'],
  ['folate_mcg', 'Folate', 'mcg'],
  ['choline_mg', 'Choline', 'mg'],
  ['calcium_mg', 'Calcium', 'mg'],
  ['copper_mg', 'Copper', 'mg'],
  ['iron_mg', 'Iron', 'mg'],
  ['magnesium_mg', 'Magnesium', 'mg'],
  ['manganese_mg', 'Manganese', 'mg'],
  ['phosphorus_mg', 'Phosphorus', 'mg'],
  ['potassium_mg', 'Potassium', 'mg'],
  ['selenium_mcg', 'Selenium', 'mcg'],
  ['sodium_mg', 'Sodium', 'mg'],
  ['zinc_mg', 'Zinc', 'mg'],
] as const;
const macroFields = fields.slice(0, 5);
const microFields = fields.slice(5);
type Nutrients = Record<string, number | null>;
type Food = { id: number; name: string; mass_in_grams: number; img_url: string | null; micros: string } & Nutrients;
type Recipe = { id: number; name: string; servings: number; instructions: string[];
  ingredients: (Food & { quantity_in_grams: number })[]; nutrients_per_serving: Nutrients };
type Entry = { id: number; meal: string; name: string; quantity: number; unit: string; nutrients: Nutrients };
type Day = { date: string; entries: Entry[]; totals: Nutrients };
type View = 'diary' | 'foods' | 'recipes';
const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const dateToday = () => {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
};
const format = (value: number | null | undefined) =>
  value == null ? '—' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);
async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch('/api' + url, {
    ...options, headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    const error = new Error(result.error || 'Something went wrong. Please try again.') as Error & { status: number };
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? undefined as T : response.json();
}

function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [protectedJournal, setProtectedJournal] = useState(false);
  const [view, setView] = useState<View>('diary');
  const [date, setDate] = useState(dateToday);
  const [foods, setFoods] = useState<Food[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [day, setDay] = useState<Day | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ authenticated: boolean; protected: boolean }>('/auth').then(result => {
      setProtectedJournal(result.protected); setAuthenticated(result.authenticated);
    })
      .catch(e => { setError((e as Error).message); setAuthenticated(false); });
  }, []);
  const refresh = useCallback(async () => {
    if (!authenticated) return;
    setError('');
    try {
      const [foodData, recipeData, dayData] = await Promise.all([
        api<Food[]>('/ingredients'), api<Recipe[]>('/recipes'), api<Day>('/log?date=' + date),
      ]);
      setFoods(foodData); setRecipes(recipeData); setDay(dayData);
    } catch (e) {
      if ((e as Error & { status?: number }).status === 401) setAuthenticated(false);
      else setError((e as Error).message);
    }
    finally { setLoading(false); }
  }, [date, authenticated]);
  useEffect(() => { refresh(); }, [refresh]);
  const act = async (action: () => Promise<unknown>, message: string): Promise<boolean> => {
    setError(''); setNotice('');
    try { await action(); await refresh(); setNotice(message); return true; }
    catch (e) {
      if ((e as Error & { status?: number }).status === 401) setAuthenticated(false);
      else setError((e as Error).message);
      return false;
    }
  };
  const changeDate = (days: number) => {
    const [year, month, dateNumber] = date.split('-').map(Number);
    const next = new Date(year, month - 1, dateNumber + days, 12);
    setDate([next.getFullYear(), String(next.getMonth() + 1).padStart(2, '0'), String(next.getDate()).padStart(2, '0')].join('-'));
  };

  if (authenticated === null) return <div className="login-screen"><p>Opening NomNom…</p></div>;
  if (!authenticated) return <Login onSuccess={() => setAuthenticated(true)} />;
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" onClick={() => setView('diary')} role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setView('diary')}>nOmNoM<span className="brand-mark">●</span></div>
        <nav aria-label="Main navigation">
          {(['diary', 'foods', 'recipes'] as View[]).map(item =>
            <button key={item} className={view === item ? 'nav-active' : ''} onClick={() => setView(item)}>
              {item === 'diary' ? 'Daily diary' : item === 'foods' ? 'My foods' : 'Recipes'}
            </button>)}
        </nav>
        {protectedJournal && <button className="logout" onClick={async () => {
          await api('/logout', { method: 'POST' }); setAuthenticated(false); setDay(null);
        }}>Sign out</button>}
      </header>
      <main className="main-content">
        {error && <div className="alert error" role="alert">{error}</div>}
        {notice && <div className="alert success" role="status">{notice}</div>}
        {loading && !day ? <p>Loading your journal…</p> : <>
          {view === 'diary' && <Diary date={date} day={day} foods={foods} recipes={recipes}
            setDate={setDate} changeDate={changeDate} act={act} onAddFood={() => setView('foods')} />}
          {view === 'foods' && <Foods foods={foods} act={act} />}
          {view === 'recipes' && <Recipes recipes={recipes} foods={foods} act={act} onAddFood={() => setView('foods')} />}
        </>}
      </main>
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      await api('/auth', { method: 'POST', body: JSON.stringify({ password }) });
      setPassword(''); onSuccess();
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };
  return <div className="login-screen"><form className="login-card" onSubmit={submit}>
    <div className="brand">nOmNoM<span className="brand-mark">●</span></div>
    <h1>Your food journal</h1><p>Sign in to see your diary.</p>
    <label>Password<input type="password" autoComplete="current-password" required value={password}
      onChange={e => setPassword(e.target.value)} /></label>
    {error && <p className="inline-error" role="alert">{error}</p>}
    <button className="primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
  </form></div>;
}

type Action = (request: () => Promise<unknown>, message: string) => Promise<boolean>;
function Diary({ date, day, foods, recipes, setDate, changeDate, act, onAddFood }: {
  date: string; day: Day | null; foods: Food[]; recipes: Recipe[]; setDate: (date: string) => void;
  changeDate: (days: number) => void; act: Action; onAddFood: () => void;
}) {
  const [kind, setKind] = useState<'food' | 'recipe'>('food');
  const [item, setItem] = useState('');
  const [meal, setMeal] = useState('Breakfast');
  const [quantity, setQuantity] = useState('');
  const choices = kind === 'food' ? foods : recipes;
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = await act(() => api('/log', { method: 'POST', body: JSON.stringify({
      date, meal, quantity: Number(quantity),
      ...(kind === 'food' ? { ingredient_id: Number(item) } : { recipe_id: Number(item) }),
    }) }), 'Added to your diary.');
    if (saved) setQuantity('');
  };
  return <>
    <div className="page-heading diary-heading">
      <div><p className="eyebrow">Your food journal</p><h1>Daily diary</h1></div>
      <div className="date-control">
        <button aria-label="Previous day" onClick={() => changeDate(-1)}>‹</button>
        <input aria-label="Diary date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button aria-label="Next day" onClick={() => changeDate(1)}>›</button>
      </div>
    </div>
    <section className="summary-card">
      <div className="summary-intro"><span className="eyebrow">Today's known totals</span>
        <strong>{format(day?.totals.calories)} <small>kcal</small></strong>
        <p>Totals reflect the nutrition data entered for each food. A dash means that nutrient has no data yet.</p>
      </div>
      <div className="macro-grid">{macroFields.slice(1).map(([key, label, unit]) =>
        <div className="macro" key={key}><span>{label}</span><strong>{format(day?.totals[key])}</strong><small>{unit}</small></div>)}</div>
    </section>
    <div className="diary-grid">
      <section className="panel">
        <div className="section-heading"><div><p className="eyebrow">What you ate</p><h2>Entries</h2></div>
          <span className="count">{day?.entries.length || 0} items</span></div>
        {!day?.entries.length ? <div className="empty">Nothing logged for this day yet. Add your first food below.</div> :
          meals.map(group => {
            const entries = day.entries.filter(entry => entry.meal === group);
            return entries.length ? <div className="meal-group" key={group}><h3>{group}</h3>
              {entries.map(entry => <div className="entry" key={entry.id}>
                <div><strong>{entry.name}</strong><span>{format(entry.quantity)} {entry.unit} · {format(entry.nutrients.calories)} kcal</span></div>
                <button aria-label={'Remove ' + entry.name} title="Remove entry" onClick={() =>
                  act(() => api('/log/' + entry.id, { method: 'DELETE' }), 'Entry removed.')}>×</button>
              </div>)}</div> : null;
          })}
        <form className="add-entry" onSubmit={add}>
          <h3>Log something</h3>
          <div className="form-row"><label>Meal<select value={meal} onChange={e => setMeal(e.target.value)}>
            {meals.map(value => <option key={value}>{value}</option>)}</select></label>
            <label>Type<select value={kind} onChange={e => { setKind(e.target.value as 'food' | 'recipe'); setItem(''); }}>
              <option value="food">Food</option><option value="recipe">Recipe</option></select></label></div>
          <div className="form-row"><label className="grow">Item<select required value={item} onChange={e => setItem(e.target.value)}>
            <option value="">Choose {kind}</option>
            {choices.map(choice => <option key={choice.id} value={choice.id}>{choice.name}</option>)}
          </select></label>
            <label className="portion">Portion ({kind === 'food' ? 'grams' : 'servings'})
              <input required type="number" min="0.1" step="any" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="100" />
            </label></div>
          <button className="primary" disabled={!choices.length}>Add to diary</button>
          {!choices.length && <p className="hint">No {kind === 'food' ? 'foods' : 'recipes'} saved yet. {kind === 'food' &&
            <button className="text-button" type="button" onClick={onAddFood}>Add a food</button>}</p>}
        </form>
      </section>
      <section className="panel micronutrients">
        <div className="section-heading"><div><p className="eyebrow">Beyond macros</p><h2>Micronutrients</h2></div></div>
        <p className="muted">Known amounts for this day. Nutrients without data are shown as a dash.</p>
        <div className="nutrient-list">{microFields.map(([key, label, unit]) =>
          <div key={key}><span>{label}</span><strong>{format(day?.totals[key])} <small>{unit}</small></strong></div>)}</div>
      </section>
    </div>
  </>;
}

function Foods({ foods, act }: { foods: Food[]; act: Action }) {
  const [name, setName] = useState('');
  const [mass, setMass] = useState('100');
  const [values, setValues] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [usdaQuery, setUsdaQuery] = useState('');
  const [usdaCategory, setUsdaCategory] = useState<'reference' | 'branded'>('reference');
  const [usdaResults, setUsdaResults] = useState<{ id: number; name: string; type: string; brand: string | null }[]>([]);
  const [searching, setSearching] = useState(false);
  const [usdaError, setUsdaError] = useState('');
  const searchUsda = async (e: React.FormEvent) => {
    e.preventDefault(); setSearching(true); setUsdaError('');
    try { setUsdaResults(await api('/usda/search?q=' + encodeURIComponent(usdaQuery) + '&category=' + usdaCategory)); }
    catch (e) { setUsdaError((e as Error).message); }
    finally { setSearching(false); }
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: Record<string, unknown> = { name, mass_in_grams: Number(mass), micros: {} };
    fields.forEach(([key], index) => {
      if (values[key] !== undefined && values[key] !== '')
        if (index < 5) body[key] = Number(values[key]);
        else (body.micros as Record<string, number>)[key] = Number(values[key]);
    });
    if (await act(() => api('/ingredients', { method: 'POST', body: JSON.stringify(body) }), 'Food saved. You can now log it.')) {
      setName(''); setMass('100'); setValues({});
    }
  };
  return <>
    <div className="page-heading"><div><p className="eyebrow">Build your food library</p><h1>My foods</h1></div></div>
    <div className="two-column">
      <section className="panel"><h2>Find a food</h2>
        <p className="muted">Search USDA FoodData Central. Detailed foods usually have more vitamins and minerals; branded foods reflect what manufacturers provide on labels. Check the exact preparation or product before logging it.</p>
        <form className="form-row" onSubmit={searchUsda}>
          <label className="grow">Search foods<input required minLength={2} value={usdaQuery}
            onChange={e => setUsdaQuery(e.target.value)} placeholder="e.g. banana, whole milk" /></label>
          <label>Food data<select value={usdaCategory} onChange={e => { setUsdaCategory(e.target.value as 'reference' | 'branded'); setUsdaResults([]); }}>
            <option value="reference">Detailed foods</option><option value="branded">Branded products</option>
          </select></label>
          <button className="primary" disabled={searching}>{searching ? 'Searching…' : 'Search'}</button>
        </form>
        {usdaError && <p className="inline-error" role="alert">{usdaError}</p>}
        {usdaResults.length > 0 && <div className="usda-results">{usdaResults.map(result =>
          <div className="usda-result" key={result.id}><div><strong>{result.name}</strong>
            <span>{result.brand ? result.brand + ' · ' : ''}{result.type}</span></div>
            <button className="secondary" onClick={async () => {
              if (await act(() => api('/usda/import', { method: 'POST', body: JSON.stringify({ id: result.id }) }),
                'USDA food saved to your library.')) setUsdaResults([]);
            }}>Save</button></div>)}</div>}
        <p className="hint">Source: USDA FoodData Central. Missing nutrients stay unknown; they are never counted as zero.</p>
        <div className="divider">or enter a food yourself</div>
        <h2>Add a food</h2>
        <p className="muted">Use a nutrition label or trusted food data. Enter amounts for the reference weight; leave unknown values blank.</p>
        <form onSubmit={submit} className="stack-form">
          <div className="form-row"><label className="grow">Food name<input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Whole milk" /></label>
            <label>Reference weight (g)<input required type="number" min="0.1" step="any" value={mass} onChange={e => setMass(e.target.value)} /></label></div>
          <h3>Macros</h3><div className="field-grid">{macroFields.map(([key, label, unit]) =>
            <label key={key}>{label} ({unit})<input type="number" min="0" step="any" value={values[key] || ''}
              onChange={e => setValues({ ...values, [key]: e.target.value })} placeholder="Unknown" /></label>)}</div>
          <h3>Vitamins & minerals</h3><div className="field-grid">{microFields.map(([key, label, unit]) =>
            <label key={key}>{label} ({unit})<input type="number" min="0" step="any" value={values[key] || ''}
              onChange={e => setValues({ ...values, [key]: e.target.value })} placeholder="Unknown" /></label>)}</div>
          <button className="primary">Save food</button>
        </form>
      </section>
      <section className="panel"><div className="section-heading"><h2>Saved foods</h2><span className="count">{foods.length}</span></div>
        <input aria-label="Search saved foods" placeholder="Search foods" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="library-list">{foods.filter(food => food.name.toLowerCase().includes(search.toLowerCase())).map(food =>
          <div key={food.id} className="library-item"><strong>{food.name}</strong>
            <span>{format(food.calories)} kcal · {format(food.protein_in_grams)} g protein per {format(food.mass_in_grams)} g</span></div>)}
          {!foods.length && <div className="empty">Foods you add will appear here.</div>}</div>
      </section>
    </div>
  </>;
}

function Recipes({ recipes, foods, act, onAddFood }: { recipes: Recipe[]; foods: Food[]; act: Action; onAddFood: () => void }) {
  const [name, setName] = useState('');
  const [servings, setServings] = useState('1');
  const [instructions, setInstructions] = useState('');
  const [parts, setParts] = useState<{ id: string; grams: string }[]>([{ id: '', grams: '' }]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await act(() => api('/recipes', { method: 'POST', body: JSON.stringify({
      name, servings: Number(servings), instructions: instructions.split('\n').filter(Boolean),
      ingredients: parts.map(part => ({ id: Number(part.id), quantity_in_grams: Number(part.grams) })),
    }) }), 'Recipe saved. You can log it by the serving.')) {
      setName(''); setServings('1'); setInstructions(''); setParts([{ id: '', grams: '' }]);
    }
  };
  return <>
    <div className="page-heading"><div><p className="eyebrow">Cook once, log by the serving</p><h1>Recipes</h1></div></div>
    <div className="two-column">
      <section className="panel"><h2>Create a recipe</h2><p className="muted">Add the weight of each ingredient used in the whole recipe.</p>
        <form onSubmit={submit} className="stack-form">
          <div className="form-row"><label className="grow">Recipe name<input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Morning smoothie" /></label>
            <label>Servings made<input required type="number" min="0.1" step="any" value={servings} onChange={e => setServings(e.target.value)} /></label></div>
          <h3>Ingredients</h3>
          {parts.map((part, index) => <div className="form-row" key={index}>
            <label className="grow">Food<select required value={part.id} onChange={e => setParts(parts.map((p, i) => i === index ? { ...p, id: e.target.value } : p))}>
              <option value="">Choose food</option>{foods.map(food => <option key={food.id} value={food.id}>{food.name}</option>)}
            </select></label><label>Grams<input required type="number" min="0.1" step="any" value={part.grams}
              onChange={e => setParts(parts.map((p, i) => i === index ? { ...p, grams: e.target.value } : p))} /></label>
            {parts.length > 1 && <button type="button" className="remove-part" aria-label="Remove ingredient" onClick={() => setParts(parts.filter((_, i) => i !== index))}>×</button>}
          </div>)}
          <button type="button" className="secondary" onClick={() => setParts([...parts, { id: '', grams: '' }])}>+ Add ingredient</button>
          <label>Instructions (one step per line)<textarea rows={4} value={instructions} onChange={e => setInstructions(e.target.value)} /></label>
          <button className="primary" disabled={!foods.length}>Save recipe</button>
          {!foods.length && <p className="hint">First <button className="text-button" type="button" onClick={onAddFood}>add a food</button> to your library.</p>}
        </form>
      </section>
      <section className="panel"><div className="section-heading"><h2>Saved recipes</h2><span className="count">{recipes.length}</span></div>
        <div className="library-list">{recipes.map(recipe => <div className="recipe-item" key={recipe.id}>
          <button className="recipe-toggle" onClick={() => setExpanded(expanded === recipe.id ? null : recipe.id)}
            aria-expanded={expanded === recipe.id}><strong>{recipe.name}</strong><span>{format(recipe.nutrients_per_serving.calories)} kcal / serving · {recipe.servings} servings</span></button>
          {expanded === recipe.id && <div className="recipe-details"><h3>Whole recipe</h3>
            <ul>{recipe.ingredients.map(food => <li key={food.id}>{food.name} — {format(food.quantity_in_grams)} g</li>)}</ul>
            {recipe.instructions.length > 0 && <><h3>Instructions</h3><ol>{recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}</ol></>}
            <p>Per serving: {format(recipe.nutrients_per_serving.protein_in_grams)} g protein · {format(recipe.nutrients_per_serving.carbs_in_grams)} g carbs · {format(recipe.nutrients_per_serving.fat_in_grams)} g fat</p>
          </div>}
        </div>)}
        {!recipes.length && <div className="empty">Recipes you save will appear here.</div>}</div>
      </section>
    </div>
  </>;
}

export default App;
