import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Container, Row, Col, Card, Form, Image, Alert } from "react-bootstrap";
import "./Admin.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import FormPlos from "./FormPlos";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
const Admin = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("name") === "") {
    navigate("/login");
  }

  const [formName, setFormName] = useState("บันทึกความสอดคล้องกับนโยบายหรือทิศทางการศึกษา");
  const [topicsMenu, settopicsMenu] = useState([]);

  const [optionToppics, setOptionToppics] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  const [counter, setCounter] = useState(0);
  const [topicsData, setTopicData] = useState([]);
  const [topicName, setTopicName] = useState("");

  const [lerningName, setLerningName] = useState("");

  const [plos, setPlos] = useState([]);
  const [ylos, setYlos] = useState([]);
  const [yloValue, setYloValue] = useState(0);
  const [ploValue, setPloValue] = useState(0);

  //แนบไฟล์เอกสาร
  const [file, setFile] = useState([]);

  const onSelectTopic = (event) => {
    setSelectedValue(event.value);
    setTopicName(event.value);
  };

  const getSubtopics = async (id) => {

    let subtopis = [];
    await fetch(`http://localhost/leadkku-api/topicsItem/getone.php?id=${id}`)
     .then(response=>response.json())
      .then((res) => {
        subtopis = res.map((data) => {
          return { label: data.topic, value: data.topic };
        });
        setOptionToppics(subtopis);
      });
  };

  const addTopicData = () => {
    const checkTitle = topicsData.filter((obj) => obj.title === topicName);

    //ยังไม่ได้เลือกหัวข้อ
    if (topicName === "") {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "กรุณาเลือกหัวข้อที่จะบันทึก",
        showConfirmButton: true,
        timer: 1000,
      });
    } else {
      if (topicsData.length === 0) {
        setTopicData([
          ...topicsData,
          {
            title: topicName,
            anwsers: [
              { list: "", Id: 1 },
              { list: "", Id: 2 },
              { list: "", Id: 3 },
            ],
          },
        ]);
      }

      if (topicsData.length > 0) {
        if (checkTitle.length) {
          Swal.fire({
            position: "center",
            icon: "success",
            title:
              "ได้เลือกหัวข้อนี้ไปแล้ว กรุณาพิม์หัวข้อใหม่ หรือเลือกใหม่อีกครั้ง",
            showConfirmButton: true,
          });
        } else {
          setTopicData([
            ...topicsData,
            {
              title: topicName,
              anwsers: [
                { list: "", Id: 1 },
                { list: "", Id: 2 },
                { list: "", Id: 3 },
              ],
            },
          ]);
        }
      }
    }
  };

  // ลบกลุ่มหัวข้อใหญ่
  const deleteToppic = (title) => {
    let result = topicsData.filter((obj) => obj.title !== title);
    setTopicData(result);
  };

  // ลบช่องคำตอบ
  const deleteAnswerFil = (gindex, id) => {
    if (topicsData[gindex].anwsers.length > 1) {
      let result = topicsData[gindex].anwsers.filter((obj) => obj.Id !== id);
      topicsData[gindex].anwsers = result;

      setCounter(counter + 1);
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ไม่สามารถลบได้ จะต้องมีคำตอบอย่างน้อย 1 คำตอบ",
        showConfirmButton: true,
        timer: 1000,
      });
    }
  };

  const addPOLdata = (title) => {
    setLerningName(title);
    setTopicData([
      {
        title: title,
        anwsers: [
          { list: "", Id: 1 },
          { list: "", Id: 2 },
          { list: "", Id: 3 },
        ],
      },
    ]);
  };

  const onSelectForm = (name, id) => {
    if (name === "บันทึกส่วนประกอบของหลักสูตร") {
      setLerningName("PLOs");
      addPOLdata("PLOs");
      setFormName(name);
    } else {
      setTopicData([]);
      setFormName(name);
      getSubtopics(id);
    }
  };

  let docPath = "";
  const uploadFile = async () => {
    let formData = new FormData();
    formData.append("file", file[0]);

    await fetch(`http://localhost/leadkku-api/file/index.php`, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then((res) => {
        if (res.status === 200) {
          docPath = res.path;
        }
      });
  };

  const addAwnser = (index) => {
    let newID = Math.floor(Math.random() * 100);

    topicsData[index].anwsers.push({ list: "", Id: newID });
    setCounter(counter + 1);
  };

  const updateAwnser = (index, anser, value) => {
    topicsData[index].anwsers[anser].list = value;
    setCounter(counter + 1);
  };

  // บันทึกความสอดคล้องทางการศึกษา
  const postData = async () => {
    if (file.length > 0) {
      await uploadFile();
    }

    let id = "";
    if (topicsData.length > 0) {
      //post toppics
      topicsData.map((item) => {
        let body = { name: item.title, groupName: formName, document: docPath };
        axios
          .post(`http://localhost/leadkku-api/education/index.php`, body)
          .then(response => response.json())
          .then((respone) => {
            //education Id
            id = respone.id;

            //detail
            item.anwsers.map((data) => {
              if (data.list !== "") {
                let body = { answer: data.list, educationId: id };

                fetch(`http://localhost/leadkku-api/education/detail.php`,
                  {
                    method: 'POST',
                    body: JSON.stringify(body)
                  }
                );
              }
            });
          });
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "บันทึกข้อมูลสำเร็จ",
        showConfirmButton: true,
        timer: 1500,
      });

      setTopicData([]);
      setFile([]);
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ยังไม่มีข้อมูลสำหรับบันทึก",
        showConfirmButton: true,
      });
    }
  };

  const postDataPlo = async () => {
    if (file.length > 0) {
      await uploadFile();
    }

    if (lerningName === "PLOs") {
      //post plos
      topicsData[0].anwsers.map((item) => {
        if (item.list !== "") {
          let body = {
            name: lerningName,
            answer: item.list,
            document: docPath,
          };

          fetch(`http://localhost/leadkku-api/program/index.php`,
            {
              method: 'POST' ,
              body: JSON.stringify(body)
            }
          )
            .then((respone) => {
              if (respone.status === 200) {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "บันทึกข้อมูล PLOs สำเร็จ",
                  showConfirmButton: true,
                  timer: 1500,
                });
              }
            });
        }
      });

      setTopicData([]);
    } else if (lerningName === "CLOs") {
      //post toppics
      topicsData[0].anwsers.map((item) => {
        if (item.list !== "") {
          let body = {
            name: lerningName,
            answer: item.list,
            document: docPath,
          };

          fetch(`http://localhost/leadkku-api/program/index.php`,
            {
              method: 'POST',
              body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then((respone) => {
              let id = respone.id;

              const body = { source: parseInt(yloValue), target: String(id) };

              //for connect node Ylo to clo
              fetch(`http://localhost/leadkku-api/program/detail.php`,
                {
                  method: 'POST',
                  body: JSON.stringify(body)
                }
              );
            });
        }
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "บันทึกข้อมูล CLOs สำเร็จ",
        showConfirmButton: true,
        timer: 1500,
      });

      setTopicData([]);
    } else if (lerningName === "YLOs") {
      //post toppics
      topicsData[0].anwsers.map((item) => {
        if (item.list !== "") {
          let body = {
            name: lerningName,
            answer: item.list,
            document: docPath,
          };
          fetch(`http://localhost/leadkku-api/program/index.php`,
            {
              method: 'POST',
              body: JSON.stringify(body)
            }
          )
            .then(response => response.json())
            .then((respone) => {
              let id = respone.id;

              let body = { source: parseInt(ploValue), target: String(id) };

              //for connect node Ylo to plo
              fetch(
                `http//localhost/leadkku-api/program/detail.php`,
                {
                  method: 'POST',
                  body: JSON.stringify(body)
                }
              );
            });
        }
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "บันทึกข้อมูล YLOs สำเร็จ",
        showConfirmButton: true,
        timer: 1500,
      });

      setTopicData([]);
    }
  };

  const getPLOs = async () => {
    let plos = [];

    fetch(`http://localhost/leadkku-api/program/getPlo.php?name=PLOs`)
      .then(response => response.json())
      .then((res) => {
        plos = res.map((item) => {
          return { label: item.answer, value: item.programlerningId };
        });
      });

    setPlos(plos);
  };

  const getYLOs = async () => {
    let clos = [];
    await
      fetch(`http://localhost/leadkku-api/program/getPLo.php?name=YLOs`)
        .then(response => response.json())
        .then((res) => {
          clos = res.map((item) => {
            return { label: item.answer, value: item.programlerningId };
          });
        });

    setYlos(clos);
  };

  const getTopics = async () => {
    await fetch(`http://localhost/leadkku-api/topics/index.php`)
      .then(response => response.json())
      .then((res) => {
        settopicsMenu(res);
      });
  };

  const handelUploadFiles = (e) => {
    setFile([e.target.files[0]]);
  };

  useEffect(() => {
    getSubtopics(15);
    getTopics();
    getPLOs();
    getYLOs();
  }, []);

  useEffect(() => {

  }, [optionToppics])
  useEffect(() => { }, [counter]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col sm={3} id="sidebar-wrapper">
            <Nav className="d-md-block  sidebar">
              <div className="text-center mb-4">
                <Image
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "12px",
                  }}
                  src={`${import.meta.env.VITE_BASE_URL}/${localStorage.getItem("profile")}`}
                />

                <h5> {localStorage.getItem("name")} </h5>
              </div>

              {topicsMenu.map((data) => {
                return (
                  <Nav.Item
                    key={data.id}
                    onClick={() => onSelectForm(data.topic, data.id)}
                  >
                    <Nav.Link style={{ color: "#fff" }}>{data.topic}</Nav.Link>
                  </Nav.Item>
                );
              })}

              <Nav.Item>
                <Nav.Link
                  onClick={() => onSelectForm("บันทึกส่วนประกอบของหลักสูตร")}
                  style={{ color: "#fff" }}
                >
                  บันทึกส่วนประกอบของหลักสูตร
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to={"/education"} style={{ color: "#fff" }}>
                  จัดการข้อมูลความสอดคล้อง
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col sm={9} id="page-content-wrapper ">
            <Card className="mt-4 mb-4">
              <Card.Body>
                <Card.Title className="text-center mt-4 mb-4">
                  {formName}
                </Card.Title>

                {formName === "บันทึกส่วนประกอบของหลักสูตร" && (
                  <>
                    <Col sm={4} className="mb-4">
                      <Form>
                        <Form.Label>แนบไฟล์เพิ่มเติม</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={(e) => handelUploadFiles(e)}
                        />
                      </Form>
                    </Col>
                    <FormPlos
                      file={file}
                      setFile={setFile}
                      ylos={ylos}
                      plos={plos}
                      yloValue={yloValue}
                      ploValue={ploValue}
                      addPOLdata={addPOLdata}
                      topicsData={topicsData}
                      setYloValue={setYloValue}
                      setPloValue={setPloValue}
                      addAwnser={addAwnser}
                      updateAwnser={updateAwnser}
                      deleteAnswerFil={deleteAnswerFil}
                      postDataPlo={postDataPlo}
                    />
                  </>
                )}

                {formName !== "บันทึกส่วนประกอบของหลักสูตร" && (
                  <Form>
                    <Row>
                      <Col sm={4}>
                        <Form.Group>
                          <Form.Label>
                            เลือกหัวข้อสำหรับบันทึกข้อมูล{" "}
                          </Form.Label>
                          <Select
                            placeholder="เลือกหัวข้อที่ต้องการบันทึก"
                            onChange={onSelectTopic}
                            options={optionToppics}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group>
                          <Form.Label>กำหนดเอง </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="อื่นๆ"
                            onChange={(e) => setTopicName(e.target.value)}
                          />
                        </Form.Group>
                        <br />
                      </Col>

                      <Col>
                        <Form.Group style={{ marginTop: "29px" }}>
                          <Button onClick={() => addTopicData()}>
                            + เพิ่มหัวข้อ
                          </Button>
                        </Form.Group>
                      </Col>
                      <Col sm={4} className="mb-4">
                        <Form>
                          <Form.Label>แนบไฟล์เพิ่มเติม</Form.Label>
                          <Form.Control
                            type="file"
                            onChange={(e) => handelUploadFiles(e)}
                          />
                        </Form>
                      </Col>
                    </Row>

                    <div className="topic">
                      {topicsData.map((data, indexp) => {
                        return (
                          <Row className="mb-3 ">
                            <Col>
                              <Card>
                                <Card.Body>
                                  <Row>
                                    <Col sm={6}>
                                      <Card.Title>{data.title}</Card.Title>
                                      <Button
                                        variant="outline-primary"
                                        onClick={() => addAwnser(indexp)}
                                      >
                                        + เพิ่มช่องคำตอบ
                                      </Button>
                                    </Col>

                                    <Col sm={6}>
                                      <Button
                                        variant="light"
                                        onClick={() => deleteToppic(data.title)}
                                        style={{ float: "right" }}
                                        className="text-right"
                                      >
                                        <ClearIcon
                                          style={{
                                            color: "red",
                                            float: "right",
                                          }}
                                        />
                                      </Button>
                                    </Col>
                                  </Row>

                                  <div className="anwser mt-3">
                                    <Row>
                                      {data.anwsers.map((item, index) => {
                                        return (
                                          <>
                                            <Col sm={5} className="d-flex">
                                              <Form.Control
                                                required
                                                type="text"
                                                placeholder="คำตอบ"
                                                className="mt-2"
                                                defaultValue={item.list}
                                                onChange={(e) =>
                                                  updateAwnser(
                                                    indexp,
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </Col>
                                            <Col sm={1}>
                                              <div
                                                style={{ marginTop: "12px" }}
                                                onClick={() =>
                                                  deleteAnswerFil(
                                                    indexp,
                                                    item.Id
                                                  )
                                                }
                                              >
                                                <DeleteIcon style={{ color: 'red' }} />
                                              </div>
                                            </Col>
                                          </>
                                        );
                                      })}
                                    </Row>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        );
                      })}
                    </div>
                    <Row className="mt-4 ">
                      <Col sm={12}>
                        {" "}
                        {topicsData.length === 0 && (
                          <Alert className="text-center">
                            กรุณาเลือกหัวข้อที่จะบันทึก
                            หากบันทึกเรียบร้อยแล้วไปที่เมนู สรุปความสอดคล้อง
                          </Alert>
                        )}
                      </Col>
                      <Col sm={6}>
                        <Button
                          variant="success w-50"
                          onClick={() => postData()}
                        >
                          <SaveIcon /> บันทึกข้อมูล
                        </Button>
                      </Col>
                      <Col sm={6}>
                        <Button
                          style={{ float: "right" }}
                          variant="danger w-50"
                        >
                          {" "}
                          <CancelIcon /> ยกเลิก
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Admin;
