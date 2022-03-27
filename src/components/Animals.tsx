import axios from "axios"
import { useEffect, useState } from "react"
import Moment from "react-moment"
import { Link } from "react-router-dom"
import { Animal } from "../models/Animal"
import { IAnimal } from "../models/IAnimal"
import './Animal.css';


export const Animals = () => {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [printAlert, setPrintAlert] = useState (false);

    useEffect(() =>{
        axios.get<IAnimal[]>("https://animals.azurewebsites.net/api/animals")
        .then(response => {
            let animalsFromAPI = response.data.map((animal: IAnimal) => {
                return new Animal(animal.id, animal.name, animal.shortDescription, animal.imageUrl, animal.isFed, animal.lastFed)
            });
            setAnimals(animalsFromAPI);
        });
    }, []);

    function printAnimals(milliseconds:number){
        setTimeout(() => {
            setPrintAlert(true)
        }, milliseconds)
        
    }

    let lis = animals.map((animal)=>{
        let animalLink = `/animal/${animal.id}`
        let isAnimalFed = localStorage.getItem(animal.name);
        
        if(isAnimalFed != null){
            let showFeedDate = new Date(parseInt(isAnimalFed));
            let feedTimestamp = parseInt(isAnimalFed);

            if(new Date().getTime() - feedTimestamp > 4*60*60*1000){
                return <ul key={animal.id}>
                <Link to={animalLink} className="link">
                    <img src={animal.image}></img>
                    <li><h3>{animal.name}</h3></li>
                    <li>{animal.description}</li>
                    <li className="bold">Senast matad: <Moment format="YYYY-MM-DD HH:mm">{showFeedDate}</Moment></li>
                    <p className="alert">Mata mig tack!</p>
                </Link>
            </ul>
            }

            let timePassed = new Date().getTime() - feedTimestamp
            let timeLeft = 4*60*60*1000 - timePassed
            printAnimals(timeLeft)

            let printFeedAlert = (<p className="alert">Mata mig tack!</p>)
            if(printAlert === false){
                printFeedAlert = <></>
            }

            return <ul key={animal.id}>
            <Link to={animalLink} className="link">
                <img src={animal.image}></img>
                <li><h3>{animal.name}</h3></li>
                <li>{animal.description}</li>
                <li className="bold">Senast matad: <Moment format="YYYY-MM-DD HH:mm">{new Date(parseInt(isAnimalFed))}</Moment></li>
                {printFeedAlert}
            </Link>
            </ul>
        }

        else if (isAnimalFed === null){
            localStorage.setItem(animal.name,JSON.stringify(new Date(animal.lastFed).getTime()));
            return <></>
        }
    });

    return (<div>{lis}</div>)
}