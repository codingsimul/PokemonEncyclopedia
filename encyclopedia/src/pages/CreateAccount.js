import {useState, useEffect} from 'react'; 
import {Form, Button} from 'react-bootstrap'; 
import {useNavigate} from 'react-router-dom'; 
import styled from 'styled-components'; 
import Footer from './Footer.js'; 

let AccountContainer1 = styled.div`
padding: 7px 0px 1px 0px; 
margin: 10px; 
background: rgba(0,0,0,0.3); 
`

function CreateAccount(){
    let [newid, setNewid] = useState(''); 
    let [newpw, setNewpw] = useState(''); 
    let [verify, setVerify] = useState(false); 
    // 계정의 아이디와 비밀번호를 검사하는 시기를 제공하는 플래그 역할. 
    let navigate = useNavigate(); 

    useEffect(()=>{
      if(verify == true){
      if(newid ==''){
        setVerify(false); 
        alert('아이디를 다시 입력하시오');
      }
      else if(newpw == ''){
        setVerify(false); 
        alert('비밀번호를 다시 입력하시오');
      }
      else{
        sessionStorage.setItem(newid, newpw); 
        alert("가입을 환영합니다^^"); 
        navigate('../Account'); 
      }
    }
    },[verify])
    // create 버튼 누를 때마다 아이디, 비밀번호 검증함. 
  
    return(
      <div>
        <AccountContainer1>
          <Form className="FormCreateComponent">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>ID</Form.Label>
              <Form.Control type="text" placeholder="Enter ID" onChange={(e)=>{setNewid(e.target.value)}}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e)=>{setNewpw(e.target.value)}}/>
              <Form.Text className="text-muted">
                We'll never share your PW with anyone else.
              </Form.Text>
            </Form.Group>
            <Button variant="white" type="submit" onClick={()=>{setVerify(true); }}>
              CREATE
            </Button>
          </Form> 
        </AccountContainer1>
        <Footer></Footer>
      </div>
    )
  }

export default CreateAccount; 
