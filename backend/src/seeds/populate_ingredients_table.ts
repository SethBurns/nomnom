import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("ingredients").del();

    // Inserts seed entries
    await knex("ingredients").insert([
      { name: "Celery", protein_in_grams: 1, carbs_in_grams: 1, fat_in_grams: 0, mass_in_grams: 10 },
      { name: "Onion", protein_in_grams: 2, carbs_in_grams: 1, fat_in_grams: 0, mass_in_grams: 10 },
      { name: "Green pepper", protein_in_grams: 3, carbs_in_grams: 1, fat_in_grams: 0, mass_in_grams: 10 },
      { name: "Carrot", protein_in_grams: 4, carbs_in_grams: 1, fat_in_grams: 0, mass_in_grams: 10 },
    ]);
};
