import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button, Image, Card, Alert } from "react-bootstrap";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigae = useNavigate();

  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  let path = "";
  const uploadProfile = async () => {
    let formData = new FormData();
    formData.append("file", file);
    await fetch(`${import.meta.env.VITE_BASE_URL}/file/index.php`,
      {
        method: 'POST',
        body: formData
      }
    )
      .then(response => response.json())
      .then((res) => {
        path = res.path
      })
  }

  const handelSubmit = async (e) => {
    e.preventDefault();
    await uploadProfile();
    const body = {
      name: name,
      email: email,
      profile: path,
      password: password,
      role: "admin",
      systemName: "course"
    }
    await fetch(`${import.meta.env.VITE_BASE_URL}/users/index.php`,
      {
        method: 'POST',
        body: JSON.stringify(body)
      }
    )
      .then((res) => {
        if (res.status === 200) {
          navigae("/login");
        }
      })
      .catch((err) => {
        if (err) {
          setMessage("ผู้ใช้นี้ได้ลงทะเบียนแล้ว");
        }
      });
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
                        src={file ? URL.createObjectURL(file) : "profile.png"}
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50px",
                        }}
                      />
                    </center>
                  </Col>
                  <Col sm={12}>
                    <Form
                      className="section-form"

                      enctype="multipart/form-data"
                    >
                      <h4 className="text-center"> ลงทะเบียน</h4>

                      <Form.Group className="mb-4">
                        <Form.Label>อัพโหลดโปรไฟล์</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label>ชื่อ-นามสกุล</Form.Label>
                        <Form.Control
                          type="text"
                          value={name}
                          placeholder="ชื่อ"
                          required
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Group>
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
                      <br />
                      {message ? <Alert variant="danger" className="text-center"> {message} </Alert> : <></>}
                      <br />
                      <a href="/login">หากมีบัญชีอยู่แล้ว คลิกเข้าสู่ระบบ</a>
                      <Button
                        onClick={(e) => handelSubmit(e)}

                        className=" w-100 mt-4">
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

export default Register;
