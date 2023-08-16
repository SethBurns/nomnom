import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("ingredients").del();

    // Inserts seed entries
    await knex("ingredients").insert([
      { name: "Celery", unit: "gram", protein: "1g" },
      { name: "Onion", unit: "gram", protein: "2g" },
      { name: "Green pepper", unit: "gram", protein: "3g" },
      { name: "Carrot", unit: "gram", protein: "4g" },
    ]);
};
