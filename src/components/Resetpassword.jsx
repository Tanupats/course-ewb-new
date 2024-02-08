import React, { useState } from "react";
import {
    Col,
    Row,
    Form,
    Button,
    Image,
    Card

} from "react-bootstrap";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'
const ResetPassword = () => {

    const navigae = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("")

    async function handelSubmit() {

        const body = {
            email: email,
            password: password,
        };

        await axios.put(`${import.meta.env.VITE_BASE_URL}/users/updatepassword.php`, body
        )
            .then(data => {
                if (data.status === 200) {

                    Swal.fire(
                        '',
                        'เปลี่ยนรหัสผ่านสำเร็จ',
                        'success'
                    )
                }

            }
            )

    };

    return (
        <div>
            <Row>
                <Col sm={3}></Col>
                <Col sm={6} className="p-0">
                    <div className="login-form">
                        <Row>
                            <Col sm={6} className="p-0">
                                <Image
                                    src="6374585.jpg"
                                    style={{ width: "100%", height: "auto" }}
                                />
                            </Col>
                            <Col sm={6}>
                                <Card>
                                    <Card.Body>


                                        <Form className="section-form" >
                                            <h4 className="text-center mt-4" style={{ color: '#673382' }}> ตั้งรหัสผ่านใหม่</h4>

                                            <Form.Group className="mb-4">
                                                <Form.Label>กรอกอีเมลที่ลงทะเบียนไว้แล้ว</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    value={email}
                                                    placeholder="****"
                                                    required
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>ตั้งรหัสผ่านใหม่</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="***"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </Form.Group>





                                            <Button
                                                onClick={() => handelSubmit()}

                                                variant="primary"
                                                className="w-100 mt-3"
                                            >
                                                รีเซทรหัสผ่าน
                                            </Button>
                                            <Button
                                                onClick={() => navigae('/login')}

                                                variant="success"
                                                className="w-100 mt-3"
                                            >
                                                ไปยังหน้าเข้าสู่ระบบอีกครั้ง
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>




                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col sm={3}></Col>
            </Row>
        </div>
    );
};

export default ResetPassword;
