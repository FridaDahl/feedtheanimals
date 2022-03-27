import axios from "axios";
import { useState, useEffect } from "react";
import Moment from "react-moment";
import { Link, useParams } from "react-router-dom"
import { Animal } from "../models/Animal";
import { IAnimal } from "../models/IAnimal";
import './AnimalDescription.css';


export const AnimalDescription = () => {
    let params = useParams()
    const [animalId, setAnimalId] = useState(0);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [showFeedButton, setShowFeedButton] = useState(true);
    const [date, setDate] = useState(new Date());
    const [animal, setAnimal] = useState(new Animal(0,'','','',false,''))
    const [lastFed, setLastFed] = useState(new Date());

    useEffect(() => {
        if (params.id){
            setAnimalId(+params.id)
        }
    }, []);

    useEffect(() =>{
        axios.get<IAnimal[]>("https://animals.azurewebsites.net/api/animals")
        .then(response => {
            let animalsFromAPI = response.data.map((animal: IAnimal) => {
                return new Animal(animal.id, animal.name, animal.longDescription, animal.imageUrl, animal.isFed, animal.lastFed)
            });
            setAnimals(animalsFromAPI);
            });
    }, []);

    useEffect(() => {
        let findAnimal = animals.find(x => x.id === animalId);
        if(findAnimal != undefined){
            setAnimal(findAnimal); 
        }
    });

    function feedAnimal(){
        setShowFeedButton(!showFeedButton);
        setDate(new Date);
        console.log(animal?.name + " fick mat! " + date);
        saveToLocal();
        updateFeedState(3*60*60*1000);
        let lastFedP = date;
        setLastFed(lastFedP);
    }

    function saveToLocal(){
        localStorage.setItem(animal.name, JSON.stringify(date.getTime()));
    }

    function updateFeedState(milliseconds:number){
            setTimeout(() => {
                setShowFeedButton(showFeedButton);
                console.log(animal.name+ ' är hungrig igen');
            }, milliseconds)  
    };
    
    let button = (<button onClick={feedAnimal}>Mata {animal?.name}</button>)
    if(!showFeedButton) {
        button = (<></>)
    }

    let getFeedTime = localStorage.getItem(animal.name)
    
    if(getFeedTime != null) {
        let createInt = parseInt(getFeedTime)
        let showFeedTime = new Date(parseInt(getFeedTime));

        if (new Date().getTime() - createInt < 3*60*60*1000){
            return <div className="desDiv">
            <img src={animal?.image} className="desImg"></img>
            <h3>{animal?.name}</h3>
            <p className="desP">{animal?.description}</p>
            <p>{animal.name} är matad</p>
            <p>Senast matad: <Moment format="YYYY-MM-DD HH:mm">{showFeedTime}</Moment></p>
            <Link className="mainLink" to="/">Se alla djur</Link>
        </div>   
        }
        else if(new Date().getTime() - createInt > 3*60*60*1000 && new Date().getTime() - createInt < 4*60*60*1000 ){
            return <div className="desDiv">
            <img src={animal?.image} className="desImg"></img>
            <h3>{animal?.name}</h3>
            <p className="desP">{animal?.description}</p>
            <p>{animal.name} vill bli matad</p>
            <p>Senast matad: <Moment format="YYYY-MM-DD HH:mm">{showFeedTime}</Moment></p>
            {button}
            <Link className="mainLink" to="/">Se alla djur</Link>
            </div>
        }

        else if (new Date().getTime() - createInt > 4*60*60*1000){
            return <div className="desDiv">
            <img src={animal?.image} className="desImg"></img>
            <h3>{animal?.name}</h3>
            <p className="desP">{animal?.description}</p>
            <p>{animal.name} vill bli matad </p>
            <p>Senast matad: <Moment format="YYYY-MM-DD HH:mm">{showFeedTime}</Moment></p>
            <p>Jag har inte fått mat på 4h eller mer</p>
            <p className="alert">Mata mig tack!</p>
            {button}
            <Link className="mainLink" to="/">Se alla djur</Link>
            </div>
        }

    }
  
    return <div className="desDiv">
            <img src={animal?.image} className="desImg"></img>
            <h3>{animal?.name}</h3>
            <p className="desP">{animal?.description}</p>
            <p>Senast matad: <Moment format="YYYY-MM-DD HH:mm">{lastFed}</Moment></p>
            {button}
            <Link className="mainLink" to="/"><p>Se alla djur</p></Link>
        </div>
}

