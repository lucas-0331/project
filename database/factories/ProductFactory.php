<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $client_ids = Client::pluck('id')->toArray();
        $client_id = $this->faker->randomElement($client_ids);
        return [
            'product_name' => fake()->word(),
            'product_value' => fake()->numberBetween(3,90),
            'product_description' => fake()->text(),
            'client_id' => $client_id,
        ];
    }
}
