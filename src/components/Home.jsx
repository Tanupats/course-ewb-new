import React from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <Container fluid>
      <Row className="mt-4 text-center">

        <Col className="mt-4 mb-4" >
          <h3 className="mb-4" style={{ color: '#8f56b8',marginBottom:'40px' }}>ยินดีต้อนรับ ระบบจัดทำหลักสูตร</h3>

          <div className="cover" >
            <Image style={{ width: '100%' }} src="homepage.jpg" />
          </div>
          {

            localStorage.getItem("name") === "" || localStorage.getItem("name") === null && (
              <Button style={{ width: '300px', marginTop: '60px' }} onClick={() => { navigate('/login') }}>เข้าสู่ระบบ</Button>
            )
          }


        </Col>




      </Row>
    </Container>
  );
};

export default Home;
