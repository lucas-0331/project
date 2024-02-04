<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_name' => fake()->company(),
            'legal_name' => fake()->companySuffix(),
            'tax_id' => fake()->companySuffix(),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'company_email' => fake()->companyEmail(),
            'sector' => fake()->word(),
        ];
    }
}
