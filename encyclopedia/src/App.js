import logo from './logo.svg';
import './App.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route, useNavigate, Outlet,Link} from 'react-router-dom'; 
import Detail from './pages/Detail.js'; 
import CreateAccount from './pages/CreateAccount.js'; 
import Account from './pages/Account.js'; 
import Favorites from './pages/Favorites.js'; 
import Footer from './pages/Footer.js'; 
import {Navbar, Nav, Container, Row, Col, Card, Button, InputGroup, Form} from 'react-bootstrap'; 
import axios from 'axios'; 
import {useSelector} from 'react-redux'; 
import {useState, useEffect} from 'react'; 
import styled from 'styled-components'; 

let SearchComponent = styled.div`
border: 3px; 
border-radius: 5px; 
margin: 5px 10px;
background: rgba(0,0,0,0.2); 
`
let HomeComponent = styled.div`
display: grid; 
height: 50vh; 
`
let InputComponent = styled.div`
position: relative; 
border: solid 1px; 
height: 50vh; 
margin: auto 0px; 
background: rgba(0,0,0,0.7); 
`

function App() { 
  let [fade1, setFade1] = useState(''); 
  let [fade2, setFade2] = useState('');
  // 애니메이션 상태 여부 저장. 
  useEffect(()=>{
    setTimeout(()=>{return setFade1('end')
    },200);
    setTimeout(()=>{return setFade2('end')}, 400); 
    return ()=>{
      setFade1(''); 
    }
  },[]) 
  //처음 접속시, 새로고침시 fade in 애니메이션 구현. 

  let navigate = useNavigate(); 
  let userLogin = useSelector(user=> user.user.isLoging); 
  const [detail, setDetail] = useState(''); //detail 페이지에 전달할 포켓몬 데이터. 

  const [pokemons, setPokemons] = useState([]); 
  function contents(k){
    for(let i =0; i<k.length;i++){
      if(k[i].language.name ==="ko"){
        return k[i]; 
      }
    }
    return ''; 
  }
  //포켓몬에 대한 텍스트를 가져오는 함수. 
  
  useEffect(() => {
    const fetchData = async () => {
      const requests = Array.from({ length: 151 }, (_, i) => i + 1).map(i =>
        axios.get(`https://pokeapi.co/api/v2/pokemon-species/${i}/`)
          .then(response => ({
            name: response.data.names[2]?.name || '', 
            genus: response.data.genera[1]?.genus || '', 
            content: contents(response.data.flavor_text_entries).flavor_text|| '', 
            id: i || '', 
            evolution: response.data.evolution_chain?.url || '', 
            url: JSON.stringify(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${i}.gif`) 
          }))
          .catch(error => {
            console.error(`Failed to fetch data for Pokemon ID ${i}:`, error); 
            return null; // 에러 발생 시 null 반환
          })
      );
      const results = await Promise.all(requests);
      setPokemons(results.filter(result => result !== null)); // null이 아닌 결과만 상태에 저장
    };
    fetchData();
  }, []); 
  //페이지가 로드되면 포켓몬에 대한 기본 데이터를 가져옴. 

  let [inputValue, setInputValue] = useState(''); //검색 데이터 저장. 
  let [found, setFound] = useState(true); 

  useEffect(()=>{
    let item = localStorage.getItem('recent')
    if(item == null){item = [];}
    else{
      item = JSON.parse(item);
      item = item.filter(function(item){
        return detail.id !== item.id; 
      })
      if(item.length == 8){
        item.splice(0,1); 
      }
      if(detail!='')item.push(detail); 
      //예외처리: 새로고침되면 detail 값이 ''로 되어서 랜더링되면서''값이 추가됨. 
    }  
     localStorage.setItem('recent', JSON.stringify(item)); 
        
  },[detail]) 
  //포켓몬에 대한 디테일 페이지에 들어갈 때 마다 최근 접근한 포케몬을 기록함. 
  //새로고침되도 계속 유지되도록하고 로그인과 무관한 동작이므로 로컬 스토리지에 저장. 
  
  let k = JSON.parse(localStorage.getItem('recent')); 
  //useEffect 동작 후 최근 접근한 포켓몬에 대한 정보를 가져옴. 

  return (
    <div className="App">
      <Navbar expand="lg" style={{borderBottom:'1px solid rgba(0,0,0,0.2)', boxShadow:'1px 2px 5px 0px'}}>
      <Container>
        <Navbar.Brand onClick={()=>{navigate('/')}}>PokeMon Encyclopedia</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link style={{color:'rgba(0,0,0,1)'}} onClick={()=>{navigate('./poketlist')}}>Pokemons</Nav.Link>
            <Nav.Link style={{color:'rgba(0,0,0,1)'}} onClick={()=>{navigate('./Account')}}>MyPage</Nav.Link>
            <Nav.Link style={{color:'rgba(0,0,0,1)'}} onClick={()=>{navigate('./CreateAccount')}}>CreateAccount</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      </Navbar> 

    <Routes>
      <Route path="/" element={
        <HomeComponent> 
          <InputComponent className={`start `+fade1}>
            <InputGroup className="mb-3" style={{width:'70%',position:'absolute', top:'50%', left:'15%'}}>
            <Form.Control
              placeholder="이름 또는 번호를 입력하시오" 
              type='text' onChange={(e)=>{setInputValue(e.target.value)}}
            />
            <Button variant="outline-secondary" style={{color:'white'}} id="button-addon2" onClick={()=>{
          {
            if(isNaN(inputValue)==true){
              pokemons.map((p,i)=>{
                if(inputValue.length == p.name.length){ 
                  for(let i =0; i<p.name.length; i++){ 
                    if(inputValue[i] !== p.name[i])return; 
                  }
                  setDetail({
                    url: p.url, name: p.name, content: p.content, genus:p.genus, evolution: p.evolution, id: p.id
                    });
                    navigate('./detail'); 
                }
              }) 
            }
            else if(isNaN(inputValue)==false){
              pokemons.map((p,i)=>{
                if(inputValue == p.id){
                  setDetail({
                    url: p.url, name: p.name, content: p.content, genus:p.genus, evolution: p.evolution, id: p.id
                    });
                    navigate('./detail');
                }
              })
              
            }
            else setFound(false); 
            if(found===false)alert('도감번호 또는 이름을 정확히 입력해주세요');
            else{setFound(false);}  
          }
              }}>
          검색
            </Button>
            </InputGroup> 
          </InputComponent>
          <SearchComponent className={`start `+fade2}>
          <h4 style={{textAlign:'center', margin:'20px auto'}}>검색목록</h4>
            <Row>
              {
              k===null?null:
              k.map((a, i)=>{
                return(
                <Col md={3} style={{width:'25%',heigth:'25%'}}>
                  <img style={{width:'30%', height:'60%'}} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${a.id}.gif`}
                  onClick={()=>{
                    setDetail(a); 
                    navigate('./detail'); 
                    }}>
                  </img>
                  <p style={{textAlign:'center', margin:'auto'}}>{a.name}</p>
                </Col>
                )
              }) 
              }
            </Row>
          </SearchComponent>
          <Outlet></Outlet>
          <Footer></Footer>
        </HomeComponent>
      }>
        <Route path="/Poketlist" element={
        <div style={{background:'rgba(0,0,0,0.3)', paddingTop:'10px'}}>
        <Container>
          <Row md={4}>
            {
              pokemons.map((p,i)=>{
                return(
                  <Col>
                    <Card className="CardComponent" style={{background: 'rgba(256,256,256,0.3)' }}>
                      <Card.Img variant="top" src={JSON.parse(p.url)} style={{width:'12rem', height:'12rem', placeSelf: 'center'}}/>
                      <Card.Body style={{position:'relative'}}>
                        <Card.Title>{p.name}</Card.Title>
                        <Card.Text style={{textAlign:'center'}}>NO.{p.id}</Card.Text>
                        <Row>
                          <Col md="4">
                            <Button variant="dark" onClick={()=>{
                              if(userLogin == true){
                              let f = sessionStorage.getItem("favorites"); 
                              if(f==[]){sessionStorage.setItem("favorites",JSON.stringify([p]));}
                              else{
                                f= JSON.parse(f); 
                                f.push(p); 
                                sessionStorage.setItem("favorites",JSON.stringify(f));
                              }
                            }
                            }}>
                              관심
                            </Button>
                          </Col>
                          <Col md="4">
                              <Link to={`/detail/?${new URLSearchParams(p).toString()}`}>
                                <Button variant="dark" >Detail</Button>
                              </Link>
                          </Col>
                        </Row>
                       </Card.Body>
                     </Card>
                   </Col>
               )
              })
              //가로 줄에 4개의 포켓몬 카드가 있도록 배치함. 
              //배운점 3 
              //새로고침에 의한 랜더링은 전달된 props를 초기화함. -> 전달할 객체를 유지하는 방법이 필요했음. 
              //해결책: url 파라미터로 객체를 전달하여 새로고침 시에도 전달할 객체를 유지하도록 함. 
             }   
          </Row>
        </Container>
        </div>
        }>
        </Route>
      </Route> 
      <Route path="/Detail" element={<Detail></Detail>}></Route>
      <Route path="/CreateAccount" element={<CreateAccount></CreateAccount>}></Route>
      <Route path="/Account" element={<Account></Account>}>
        <Route path="/Account/Favorites" element={<Favorites></Favorites>}></Route>
      </Route>
    </Routes>
    </div> 
  );
}
export default App; 
