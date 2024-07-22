import {Container, Row, Col} from 'react-bootstrap'; 
import {memo} from 'react'; 

let Poketlist = memo(function(props){
    return(
        <Container>
        <Row>
        {
            props.pokemon.map((p)=>{ 
              <Col>{p.name}</Col>
            })
          }
        </Row>
      </Container>
    )

}
);

export default Poketlist; 