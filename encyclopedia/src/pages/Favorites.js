import {useState, useEffect} from 'react'; 
import {Row, Col} from 'react-bootstrap'; 
import {useNavigate} from 'react-router-dom'; 

function Favorites(){
    let navigate = useNavigate() ;
    let [favorites, setFavorites] = useState(''); 
    useEffect(()=>{
    let newF = sessionStorage.getItem("favorites"); 
          if(newF!=''){
            newF = JSON.parse(newF);
            setFavorites(newF); 
      }
      
    },[])
    return(
      <div>
                     <Row>
              {favorites===''?null:
              favorites.map((f, i)=>{
                return(
                  
                <Col md={3} style={{width:'25%',heigth:'25%'}}>
                  <img style={{width:'30%', height:'60%'}} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${f.id}.gif`}
                  onClick={()=>{
                    navigate('../detail'); 
                    }}>
                  </img>
                  <p style={{textAlign:'center', margin:'auto'}}>{f.name}</p>
                </Col>
                )
              }) 
              }
              </Row>
      </div>
    )
  }

export default Favorites; 