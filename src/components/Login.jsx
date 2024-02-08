import React, { useContext, useState } from "react";
import { Col, Row, Form, Button, Image, Card, Alert } from "react-bootstrap";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthData } from "../AuthContext";
const Login = () => {
  const { setIsLogin } = useContext(AuthData);
  const navigae = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handelSubmit = async (event) => {
    event.preventDefault();
    if (email !== "" && password !== "") {
      const body = {
        email: email,
        password: password,
        systemName: "course"
      };

      await
       axios.post(
          `${import.meta.env.VITE_BASE_URL}/login/index.php`,
        body

        )
        
          .then(res => {
            if (res.data.length > 0) {

              localStorage.setItem("name", res.data[0].name);
              localStorage.setItem("userId", res.data[0].userId);
              localStorage.setItem("auth", "loginged");
              setIsLogin("loginged");
              localStorage.setItem("role", res.data[0].role);
              localStorage.setItem("profile", res.data[0].profile);
              navigae("/admin");

            } else {
              setErrorMsg("ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง")
            }
          })
    }
  };

  return (
    <div>
      <Row>
        <Col sm={4}></Col>

        <Col sm={4} className="p-0">
          <div className="login-form">
            <Card>
              <Card.Body>
                <Row>
                  <Col sm={12} className="p-0">
                    <center>
                      {" "}
                      <Image
                        src="logo.jpg"
                        style={{ width: "20%", height: "auto" }}
                      />
                    </center>
                  </Col>
                  <Col sm={12}>
                    <Form
                      className="section-form"

                      onSubmit={handelSubmit}
                    >
                      <h4 className="text-center"> เข้าสู่ระบบ</h4>

                      <Form.Group className="mb-4">
                        <Form.Label>อีเมล</Form.Label>
                        <Form.Control
                          type="email"
                          value={email}
                          placeholder="Email"
                          required
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>รหัสผ่าน</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="***"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Form.Group>

                      {
                        errorMsg !== "" && (
                          <Alert variant="danger" className="mt-4">
                            <div className="text-center">
                              {errorMsg} </div>
                          </Alert>
                        )
                      }
                      <Button
                        variant="success"
                        type="submit"
                        className=" w-100 mt-2">
                        เข้าสู่ระบบ
                      </Button>
                      <hr />
                      <p>*หากยังไม่มีบัญชี คลิกลงทะเบียน</p>
                      <Button
                        onClick={() => navigae('/register')}
                        type="submit"
                        className=" w-100 mt-2">
                        ลงทะเบียน
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Col sm={4}></Col>
      </Row>
    </div>
  );
};

export default Login;
