import {useState, useEffect} from 'react'; 
import {useNavigate, Outlet} from 'react-router-dom'; 
import {useDispatch, useSelector} from 'react-redux';
import {loginUser, clearUser} from '../store.js';
import {Form, Button} from 'react-bootstrap'; 
import '../App.css'; 
import Footer from './Footer.js';
import styled from 'styled-components'; 

let AccountContainer1 = styled.div`
padding: 7px 0px 1px 0px; 
margin: 10px; 
border: 1px solid; 
background: rgba(0,0,0,0.7); 
`

function Account(){
  const dispatch = useDispatch(); 
  let navigate = useNavigate(); 

  let user = useSelector((user) => {return user.user}); 
  // 유저 정보를 불러옴. 
  let userLogin = useSelector(user=>user.user.isLoging); 
  //유저의 로그인 상태를 불러옴. 
    
  useEffect(()=>{
    sessionStorage.setItem("root",1234); 
  },[]) 

  const LogoutFunc = (()=>{
    alert("로그아웃"); 
    dispatch(clearUser()); 
    sessionStorage.removeItem('favorites'); 
  })
  
  return (
    <div className="App">
      {
        userLogin == false? <LoginPage></LoginPage>: 
        <div>
        <AccountContainer1 style={{padding:'100px'}}>
          <h1 style={{color:'white'}}>MyPage</h1>
          <p className="pAccount_1">{user.id}님, 안녕하세요!</p>
          <button className="buttonAccount_1" style={{marginRight:'5px'}} onClick={()=>{LogoutFunc();}}>로그아웃</button>
          <button className="buttonAccount_1"  onClick={()=>{navigate('./Favorites');}}>관심목록</button>
          <Outlet></Outlet>
        </AccountContainer1>
        <Footer></Footer>
        </div>
      }
      
    </div>
    //사용자 로그인 여부에 따른 필요한 컴포넌트를 보여줌. userLogin 상태 변수 사용. 
  );
}

function LoginPage() { 
  let [id, setId] = useState(); 
  let [passwd, setPasswd] = useState(); 
  
  let [loading, setLoading] = useState(false); 
  let navigate = useNavigate(); 
  let dispatch = useDispatch(); 
  
  useEffect(()=>{
    if(loading==true){
      //로그인을 위한 세션을 확인 과정에서만 동작하도록 함. 
    if(!id){
      return alert('id를 입력하세요.'); 
    }
    //아이디 검사. 
    else if(!passwd){
      return alert('비밀번호를 입력하세요.'); 
    }
    //비밀번호 검사. 
    else{
      if(sessionStorage.getItem(id) === passwd){
        dispatch(loginUser({id: id, pw:passwd, isLoging: true})); 
        alert("성공"); 
        sessionStorage.setItem('favorites',[]); 
      } 
      // 성공시 세션에 보관할 포켓몬 관심목록을 생성. 
      else{
        alert("실패");
      }
    }
    // 두검사 모두 성공 후 세션에서 세션 정보 확인하는 분기처리. 
    setLoading(false); 
    //세션 확인하는 로딩을 마치면 끝났다는 상태 정보로 변경. 
  }
  },[loading])
  //로그인 버튼을 눌르면 로딩 변수 값이 변경되어 세션정보를 확인하는 과정. 
  //+ 재랜더링되어 Account 컴포넌트의 isLoging 변수의 최신 값을 반영시킴. 

  return (
    <div>
      <div className="FormComponent">
        <Form className="FormLoginComponent">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" placeholder="Enter ID" onChange={(e)=>{setId(e.target.value)}}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={(e)=>{setPasswd(e.target.value)}}/>
            <Form.Text className="text-muted">
              We'll never share your PW with anyone else.
            </Form.Text>
          </Form.Group>
          <Button variant="white" type="submit" onClick={()=>{setLoading(true); }}>
            LOGIN
          </Button>
          <div style={{margin:'-20px auto'}}>
            <br/>NO ACC...? 
            <Button variant="dark" type="submit" onClick={()=>{navigate('../CreateAccount')}}>
              CREATE
            </Button>
          </div>
        </Form> 
      </div>
        <Footer></Footer>
    </div>
  );
  //세션 입력을 받고 세션 정보를 확인하는 분기처리를 함. loading 상태 변수 값 변경.
}

export default Account; 
//로그인, 로그아웃 기능을 구현한 컴포넌트. 