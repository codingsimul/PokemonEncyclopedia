import {useLocation} from 'react-router-dom'
import {useState, useEffect} from 'react'; 
import axios from 'axios'; 
import {Card, Row, Col} from 'react-bootstrap'; 
import '../App.css'; 
import styled from 'styled-components'; 

let DetailCompoment1 = styled.div`
padding: 10px; 
background:rgba(120,120,120,0.2); 
margin: 10px; 
`

let DetailCompoment2 = styled.div`
background: rgba(120,120,120, 0.4); 
width: 42%; 
height: 100%; 
margin: auto; 
display: flex; 
padding: 15px; 
border: 1px solid rgba(0,0,0,0.2); 
boxShadow: 0px 0px 100px 10px; 
`

function Detail(){
    const location = useLocation(); 
    const params = new URLSearchParams(location.search); 
    const pokemon = {
        name : params.get('name'), 
        id : params.get('id'), 
        genus : params.get('genus'), 
        content : params.get('content'), 
        evolution : params.get('evolution'),  
        url : params.get('url') 
    }
    // 포켓몬의 기본 정보. 
    //props가 아닌 url 파라미터로 객체 정보를 유지함. 
    
    let [evolution, setEvolution] = useState([]); 
    //자세한 정보 1: 포켓몬의 진화정보. 
    let [move, setMoves] = useState([]); 
    //자세한 정보 2: 포켓몬의 스킬. 
    let [etc, setEtc] = useState([]); 
    //자세한 정보 3: 포켓몬 타입, 몸무게, 키. 
    //배운점 1
    //전역변수의 요소를 추가할 때 상태 변수로 관리해야 됨. 그래야 랜더링될 때 마다 최신 상태를 유지할 수 있음. 

    let [fade, setFade] = useState(''); 
    // 애니메이션 상태 여부 저장. 
    useEffect(()=>{
        setTimeout(()=>{return setFade('end')},100); 
        return ()=>{
            setFade(''); 
        }
    },[])
    // detail 페이지를 접근할 때 마다 애니메이션 상태를 변경함. 
  
    function skill(k){
        return k.map(move=>move.move.name); 
    }
    // 전역변수 데이터에서 스킬에 대한 데이터만 추출하는 함수. 
  
    useEffect(()=>{
        const fetchData = async() =>{ 

        try{
            axios.get(pokemon.evolution)
            .then((response)=>{
            let r1 =response.data.chain.species?.name|| '';
            let r2 =response.data.chain.evolves_to[0]?.species.name||'';
            let r3 =response.data.chain.evolves_to[0]?.evolves_to[0]?.species.name|| ''; 
            //진화가 없는 포켓몬에 대한 예외 처리. 
            setEvolution([r1, r2, r3]); 
        })
            axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`)
            .then((response)=>{
            let r1 =response.data.types[0]?.type.name|| '';
            let r2 =response.data.types[1]?.type.name|| '';
            //타입이 하나일 경우에 대한 예외처리. 
            setEtc({types: [r1, r2],height: response.data.height,weight: response.data.weight}); 
            setMoves(skill(response.data.moves)); 
        }) 
        }
        catch(error) {
            console.error(`Failed to fetch data for Pokemon ID ${pokemon.id}:`, error);
            return null; // 에러 발생 시 null 반환
        }
        finally{
        }
    }; 
    fetchData();
}
    ,[]);  
    //유저가 포켓몬의 디테일 페이지에 접근할 때 마다 해당 포켓몬의 자세한 정보를 가져오도록 함. 
  
    return(
        <DetailCompoment1>
            <DetailCompoment2>
                <Card className={'start '+ fade} style={{background:'rgba(0,102,0,0.35)', 
                width: '90%', padding:'5px', margin:'auto', boxShadow:'2px 3px 5px 0px'}}>
                    <Card.Img variant="top" src={JSON.parse(pokemon.url)} 
                    style={{width:'12rem', height:'12rem', placeSelf: 'center'}}/>
                    <Card.Body style={{position:'relative'}}>
                        <Card.Title>{pokemon.name}</Card.Title>
                        <Card.Text>
                            <div>
                                <p style={{textAlign:'center'}}>No.{pokemon.id}<br/>{etc.height}m, {etc.weight}kg</p>
                            </div>
                            <Type etc={etc}></Type>
                                <br/>
                            Detail
                            <Summary detail={{pokemon, evolution}}></Summary>
                                <br/>
                            Skill 
                            <Skill move={move}></Skill>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </DetailCompoment2>
        </DetailCompoment1>
      //포켓몬에 대한 정보를 하나의 레이아웃으로 제공. 
    )
  }; 

function Type(props){
    let etc = props.etc; 
    let color = [
        {key: 'fire', value: 'red'},{key: 'grass', value: 'light-green'},{key: 'steel', value: 'gray'},{key: 'bug', value: 'green'},{key: 'fighting', value: 'orange'},
        {key: 'electric', value: 'yellow'},{key: 'dragon', value: 'darkorchid'},{key: 'rock', value: 'brown'},{key: 'flying', value: 'skyblue'},{key: 'psychic', value: 'magenta'},
        {key: 'water', value: 'blue'},{key: 'normal', value: 'white'},{key: 'ghost', value: 'darkmagenta'},{key: 'poison', value: 'purple'},{key: 'ground', value: 'gold'}, 
        {key: 'dark', value: 'black'},{key: 'ice', value: 'Turquoise'},{key: 'fairy', value: 'pink'}
    ]; 
    //각 타입별 색상을 배열로 저장함. 
    return(
        <Row>
        {
            Array.isArray(etc.types) && etc.types.length > 0 ? (
                etc.types.map((type, i) => {
                if (type !== '') {
                    console.log(type); 
                    let index = color.find((i)=>{return i.key === type}); 
                    return (<Col key={i}><div style={{background:`${index.value}`, textAlign:'center', borderRadius:'10px', 
                        border:'1px solid'
                    }}>{type}</div></Col>);
                }
                return null;
            })
        ) : null
        // 배운점 2
        //map을 사용할 때 undefined 오류가 발생하는 이유는 주로 etc.types가 undefined 또는 null일 때 map을 호출하려 하기 때문입니다. 
        
        }
    </Row>
    )
}
function Evolution(props){
    let evolution = props.evolution; 
    return(
        <div>진화단계  
                    {
                        evolution.map((e,i)=>{
                        if(e!==''){
                            return(<div>{i+1}단계: {e}</div>)
                        }
                    }) 
                    }
                </div>
    )
}
function Skill(props){
    let move = props.move; 
    return(
        <div style={{textAlign:'center'}}>
              {
                move.map((m,i)=>{
                    if(m!==''){
                        return(<Row style={{margin:'7px',padding:'10px', boxShadow:'2px 3px 5px 0px'}}><Col>{i}</Col> <Col style={{textAlign:'left'}}>{m}</Col></Row>)
                    }
                })
              }
            </div>
    )
}
function Summary(props){
    let pokemon = props.detail.pokemon; 
    let evolution = props.detail.evolution; 
    return(
        <div style={{boxShadow:'2px 3px 5px 0px', borderRadius:'2px', padding:'5px', marginTop:'5px', background:'rgba(256,256,256,0.8)'}}>   
        <p>종족 | {pokemon.genus}</p>
        <div>
            <p>소개<br/>{pokemon.content}</p>
        </div>
        <Evolution evolution={evolution}></Evolution>
        </div>
    )
}
// 간단한 데이터 + Evolution 컴포넌트로 구성된 컴포넌트. 

export default Detail; 
// 알고싶은 포켓몬에 대한 자세한 데이터를 제공하는 컴포넌트. 
