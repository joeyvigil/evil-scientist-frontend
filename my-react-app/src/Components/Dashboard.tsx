
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import DataDisplay from './DataDisplay';

const Dashboard = () => {

    const [users, setUsers] = useState<any[]>([]);


    const  [pokemonData, setPokemonData] = useState<any | null>(null);

    useEffect(() => {
        getRandomPokemon();
        getAllUsers();
    }, []);

    //axios call that gets random pokemon data from pokeapi 
    const getRandomPokemon = async () => {
        const randomId = Math.floor(Math.random() * 1024) + 1; // PokeAPI has 898 Pokemon
        const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        setPokemonData(pokemon.data);
        
    }

    const getAllUsers = async () => {
        const users = await axios.get('http://127.0.0.1:8000/sql/');
        console.log(users.data);
        setUsers(users.data);
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

        <h3>Users:</h3>
        {/* display all users */}
        <Row >
        {users && users.map((user: any) => (
            <Col key={user.id} xs={12} sm={6} md={4} lg={3}>
                <DataDisplay user={user}/>
            </Col>
        )) }
        </Row>
        


    </>
  )
}

export default Dashboard