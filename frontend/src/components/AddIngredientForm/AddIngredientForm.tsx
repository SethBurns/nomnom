import { FormEvent, useEffect, useState } from 'react';
import { Ingredient, postNewIngredient } from '../apiCalls';
import { toTitleCase } from '../util';
import noImage from '../../images/oliver-twist.png';

interface Props {
  ingredients: Array<Ingredient>;
  setIngredients: (ingredients: Array<Ingredient>) => void;
}

export function AddIngredientForm({ ingredients, setIngredients }: Props) {
  const [name, setName] = useState('');
  const [protein, setProtein] = useState('0');
  const [carbs, setCarbs] = useState('0');
  const [fat, setFat] = useState('0');
  const [mass, setMass] = useState('0');
  const [fiber, setFiber] = useState('0');
  const [calories, setCalories] = useState('0');
  const [imgUrl, setImgUrl] = useState('');
  const [postError, setPostError] = useState('');
  const [errorColor, setErrorColor] = useState('text-red-500');

  interface returnObject {
    id: number;
  }
  function renderIngredient(
    data: returnObject,
    ingredient: Omit<Ingredient, 'id'>
  ) {
    if (data.id) {
      setIngredients([...ingredients, { ...ingredient, id: data.id }]);
    }
  }

  useEffect(() => {
    if (postError) {
      setTimeout(() => {
        setPostError('');
      }, 7000);
    }
  }, [postError])

  function renderNoImage() {
    if (imgUrl === '') {
      return noImage;
    } else {
      return imgUrl;
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name === '' || mass === '0' || imgUrl === '') {
      setErrorColor('text-red-500');
      setPostError('Image URL, Mass, and Name are required fields.');
      return;
    }

    const ingredient = {
      name: name,
      protein_in_grams: protein,
      carbs_in_grams: carbs,
      fat_in_grams: fat,
      mass_in_grams: mass,
      fiber_in_grams: fiber,
      calories: calories,
      img_url: imgUrl,
    };
    postNewIngredient(ingredient)
      .then((data) => renderIngredient(data, ingredient))
      .catch((err) =>
        setPostError(`Something went wrong posting: ${err.message}`)
      );
    setErrorColor('text-green-500');
    setPostError('Your ingredient has been added!')
    setName('');
    setProtein('0');
    setCarbs('0');
    setFat('0');
    setMass('0');
    setFiber('0');
    setCalories('0');
    setImgUrl('');
  }

  return (
    <section className="flex justify-evenly w-full">
      <form
        className="flex flex-col flex-wrap w-1/2 p-px m-3 border-2 border-solid border-black items-center"
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
              setName(toTitleCase(e.target.value));
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
          <div className="border-y border-black">
            <label className="p-2 w-36 inline-block" htmlFor="fiberGrams">
              Fiber Grams:
            </label>
            <input
              value={fiber}
              onChange={(e) => {
                setFiber(e.target.value);
              }}
              className="w-52 text-center"
              type="number"
              placeholder="grams of fiber in mass"
              name="fiberGrams"
            ></input>
          </div>
          <div className="border-y border-black"></div>
          <label className="p-2 w-36 inline-block" htmlFor="calories">
            Calories:
          </label>
          <input
            value={calories}
            onChange={(e) => {
              setCalories(e.target.value);
            }}
            className="w-52 text-center"
            type="number"
            placeholder="calories in mass"
            name="calories"
          ></input>
        </div>
        <div className="border-y border-black">
          <label className="p-2 w-36 inline-block" htmlFor="imgUrl">
            Image URL:
          </label>
          <input
            value={imgUrl}
            onChange={(e) => {
              setImgUrl(e.target.value);
            }}
            className="w-52 text-center"
            type="text"
            placeholder="url of image"
            name="imgUrl"
          ></input>
        </div>
        <button type="submit" className="border border-black p-1 m-2 rounded">
          Submit
        </button>
        <p className={postError && `${errorColor} text-center animate-fadeInOut`}>{postError}</p>
      </form>
      <div className="flex flex-col flex-wrap w-1/3 p-px m-3 border-2 border-solid border-black">
            <h2 className="text-2xl text-center">Preview</h2>
            <ul className="flex flex-col text-left">
              <li className="p-2">Name: {name}</li>
              <li className="p-2">Protein: {protein}g</li>
              <li className="p-2">Carbs: {carbs}g</li>
              <li className="p-2">Fat: {fat}g</li>
              <li className="p-2">Mass: {mass}g</li>
              <li className="p-2">Fiber: {fiber}g</li>
              <li className="p-2">Calories: {calories} cals</li>
              <li className="p-2 flex">
                Image:
                <div className='flex justify-center w-full'>
                  <img
                    className="w-36 h-36 inline-block"
                    src={renderNoImage()}
                    alt={name}
                  />
                </div>
              </li>
            </ul>
          </div>
    </section>
  );
}
