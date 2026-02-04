
import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';

const Dashboard = () => {
    type Pokemon = {
        name: string;
        sprites: { front_default: string };
        height: number;
        weight: number;
        base_experience: number;
    }


    const  [pokemonData, setPokemonData] = useState<Pokemon | null>(null);

    useEffect(() => {
        getRandomPokemon();
    }, []);

    //axios call that gets random pokemon data from pokeapi 
    const getRandomPokemon = async () => {
        const randomId = Math.floor(Math.random() * 1024) + 1; // PokeAPI has 898 Pokemon
        const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        setPokemonData(pokemon.data);
        
    }

  return (
    <>
        <h2>Welcome to the Evil Scientist Corp. Dashboard</h2>
        <button onClick={getRandomPokemon} className='btn btn-secondary'>Get Random Pokemon</button>
        {pokemonData && (
            <div>
                <h3>{pokemonData.name}</h3>
                <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
                <p>Height: {pokemonData.height}</p>
                <p>Weight: {pokemonData.weight}</p>
                <p>Base Experience: {pokemonData.base_experience}</p>

            </div>
        )}

    </>
  )
}

export default Dashboard