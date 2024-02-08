import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button, Image, Card, Alert } from "react-bootstrap";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Register = () => {
  const navigae = useNavigate();

  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailCheck, setEmailCheck] = useState(null);
  let path = "";
  const uploadProfile = async () => {
    if (file) {
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
  }

  const validateEmail = (email) => {
    // สร้าง Regular Expression ที่รับเฉพาะภาษาอังกฤษ
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // ใช้ test() เพื่อตรวจสอบว่าอีเมลผ่าน Regex หรือไม่
    return regex.test(email);
  }

  const handleEmail = (val) => {
    setEmail(val)
    let validEmail = validateEmail(val)
    console.log(validEmail)
    setEmailCheck(validEmail);
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
    await axios.post(`${import.meta.env.VITE_BASE_URL}/users/index.php`, body
    )
      .then(res => {
        if (res.status === 200) {
          navigae("/login");
        }


      }).catch(err => {
        setErrMsg(err)
      })

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
                          width: "60px",
                          height: "60px",
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
                      <h5 className="text-center"> ลงทะเบียน</h5>

                      <Form.Group className="mb-4">
                        <Form.Label>อัพโหลดโปรไฟล์</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label>ชื่อ-นามสกุล (ภาษาไทย หรือภาษาอังกฤษ)</Form.Label>
                        <Form.Control
                          type="text"
                          value={name}
                          placeholder="ชื่อ"
                          required
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Group>
                      {
                        emailCheck === false && (<> <p style={{ color: 'red' }}> *กรุณากรอกอีเมลให้ถูกต้องตามรูปแบบ</p></>)
                      }
                      <Form.Group className="mb-4">
                        <Form.Label>อีเมล</Form.Label>
                        <Form.Control
                          type="email"
                          value={email}
                          placeholder="Email"
                          required
                          onChange={(e) => handleEmail(e.target.value)}
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
