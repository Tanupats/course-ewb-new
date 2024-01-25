import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Alert,
} from "react-bootstrap";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PreviewFile from "./PreviewFile";
import TableViewIcon from "@mui/icons-material/TableView";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DatasetIcon from '@mui/icons-material/Dataset';
import TocIcon from '@mui/icons-material/Toc';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import "./Admin.css";

const Education = () => {
  const [show, setShow] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [title, setTitle] = useState("");
  const [counter, setCounter] = useState(0);

  const [getOne, setGetone] = useState([]);
  //topics
  const [option, setOption] = useState([]);
  const [topics, setTopics] = useState([]);

  //education
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState([]);
  const [gname, setGname] = useState("");
  const [eId, setEId] = useState("");

  const [document, setDocument] = useState("");

  const [selectedValue, setSelectedValue] = useState("");

  const [educationId, setEducationId] = useState("");
  const [educationTopic, setEducationTopic] = useState("");
  const [name, setName] = useState("");
  const [nameGroup, setNameGroup] = useState("");

  const [itemId, setItemID] = useState("");

  const [GroupId, setGroupId] = useState("");
  const [selectTable, setSelectTable] = useState("");

  //file for update new file
  const [file, setFile] = useState([]);

  //1
  const uploadFile = async () => {
    //ถ้ายังไม่มีไฟล์
    if (document === "") {
      let formData = new FormData();

      formData.append("file", file[0]);

      await
        fetch(`http://localhost/leadkku-api/file/index.php`,
          {
            method: 'POST',
            body: formData
          }

        )
          .then(response => response.json())
          .then((res) => {
            if (res.status === 200) {
              updateFileEducation(res.path);
            }
          });
    } else {

      let formData = new FormData();
      formData.append("file", file[0]);

      //delete file old 
      fetch(`http://localhost/leadkku-api/file/index.php?filename=${document}`, { method: 'DELETE' })

      //upnew file 
      fetch(`http://localhost/leadkku-api/file/index.php`,
        {
          method: 'POST',
          body: formData
        }
      )
        .then(response => response.json())
        .then((res) => {
          if (res.status === 200) {
            console.log(res.path);

            let newPath = res.path;

            updateFileEducation(newPath);
          }
        });
    }
  };

  //2
  const updateFileEducation = async (path) => {
    const body = { path: path };

    fetch(`http://localhost/leadkku-api/education/updatefile/${eId}`,
      {
        method: 'PUT',
        body: JSON.stringify(body)
      }
    )
      .then((res) => {
        if (res.status === 200) {
          alert("แก้ไขไฟล์ในเอกสารสำเร็จ");
        }
      });
    await getEducations();
  };

  const handelUpFile = (e) => {
    setFile([e.target.files[0]]);
  };

  const handleClose = () => {
    setShow(false);
    setItemID("");
    setName("");
  };

  const handleCloseGroup = () => {
    setShowGroup(false);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  const handleShow = (id, name) => {
    setItemID(id);
    setName(name);
    setShow(true);
  };

  const handleShowGroup = (id, name) => {
    setGroupId(id);
    setNameGroup(name);
    setShowGroup(true);
  };

  //หัวข้อใหญ่
  const getTopic = async () => {
    let topics = [];
    fetch(`http://localhost/leadkku-api/topics/index.php`)
      .then(response => response.json())
      .then((res) => {
        topics = res.map((data) => {
          return { label: data.topic, value: data.id };
        });

        setTopics(res);
        setOption(topics);
      });
  };

  const getOneEducation = async (id) => {
    await fetch(`http://localhost/leadkku-api/topicsItem/getone.php?id=${id}`)
      .then(response => response.json())
      .then((res) => {
        setGetone(res);
      });
  };

  const getAllEducation = async () => {
    await
      fetch(`http://localhost/leadkku-api/topicsItem/index.php`)
        .then(response => response.json())
        .then((res) => {
          setGetone(res);
        });
  };

  //เลือกหัวข้อใหญ่ สำหรับแสดงข้อมูล
  const onSelectTopic = (event) => {
    setSelectedValue(event);
    getOneEducation(event.value);
  };

  //เลือกหัวข้อจาดฟอร์มเพิ่มข้อมูล
  const onSelectEducationTopic = (event) => {
    setEducationTopic(event);
    setEducationId(event.value);
  };

  const updateItem = async () => {
    const body = { topic: name };
    await fetch(`http://localhost/leadkku-api/topicsItem/index.php?id=${itemId}`,
      {
        method: 'PUT',
        body: JSON.stringify(body)
      }
    )
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "แก้ไขข้อมูลสำเร็จ",
            showConfirmButton: true,
            timer: 1500,
          });
          getAllEducation();
        }
      });
  };


  const updateGroupId = async () => {
    handleCloseGroup();
    const body = { topic: nameGroup };
    await
      fetch(`http://localhost/leadkku-api/topics/index.php?id=${GroupId}`,
        {
          method: 'PUT',
          body: JSON.stringify(body)
        }
      )
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "แก้ไขข้อมูลสำเร็จ",
              showConfirmButton: true,
              timer: 1500,
            });
            getTopic();
          }
        });
  };

  const addGroup = async () => {
    const body = { topic: nameGroup };
    await fetch(`http://localhost/leadkku-api/topics/index.php`,
      {
        method: 'POST',
        body: JSON.stringify(body)
      }
    )
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "บันทึกข้อมูลสำเร็จ",
            showConfirmButton: true,
            timer: 1500,
          });
          getTopic();
        }
      });

    handleCloseGroup();
  };

  const updateAwnser = (index, value) => {
    detail[index].answer = value;
    setCounter(counter + 1);
  };

  const updateEducation = async () => {
    if (file.length > 0) {
      uploadFile();
    }

    const body = {
      groupName: educationTopic.label ? educationTopic.label : gname,
      name: title,
    };
    await fetch(`http://localhost/leadkku-api/education/index.php?id=${eId}`,
      {
        method: 'PUT',
        body: JSON.stringify(body)
      }
    )
      .then((res) => {
        if (res.status === 200) {
          alert("แก้ไขข้อมูลสำเร็จ");
        }
      });
  };

  const updateEducationDetail = () => {
    detail.map((item) => {
      let body = { answer: item.answer };
      fetch(`http://localhost/leadkku-api/education/detail.php?id=${item.educationdetailId}`,
        {
          method: 'PUT',
          body: JSON.stringify(body)
        }
      );
    });

    updateEducation();
    handleCloseDetail();
    getEducations();
  };

  const DeleteItemId = async (id) => {
    Swal.fire({
      title: "ต้องการลบข้อมูลหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {

        fetch(`http://localhost/leadkku-api/topicsItem/index.php?id=${id}`, {
          method: 'DELETE'
        }

        )
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "ลบข้อมูลสำเร็จ",
                showConfirmButton: true,
                timer: 1500,
              });
              getAllEducation();
            }
          });
      }
    });

    setShow(false);
  };

  const DeleteEducation = async (id) => {
    Swal.fire({
      title: "ต้องการลบข้อมูลหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {

        fetch(`http://localhost/leadkku-api/education/detail.php?id=${id}`, { method: 'DELETE' });
        fetch(`http://localhost/leadkku-api/education/index.php?id=${id}`, { method: 'DELETE' })
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "ลบข้อมูลสำเร็จ",
                showConfirmButton: true,
                timer: 1500,
              });
              getEducations();
            }
          });
      }
    });

    setShow(false);
  };

  const DeleteGroup = async (Id) => {
    Swal.fire({
      title: "ต้องการลบข้อมูลหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {

        fetch(`http://localhost/leadkku-api/topics/index.php?id=${Id}`, { method: 'DELETE' })
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "ลบข้อมูลสำเร็จ",
                showConfirmButton: true,
                timer: 1500,
              });

              getTopic();
            }
          });
      }
    });

    setShow(false);
  };

  //เพิ่มกลุ่มหัวข้อใหญ่
  const handelSubmitGroup = async (event) => {
    event.preventDefault();
    if (GroupId) {
      updateGroupId();
    } else {
      addGroup();
    }
  };

  const handelSubmit = async (event) => {
    event.preventDefault();
    //เพิ่มหัวข้อย่อยใน กลุ่มใหญ่
    if (itemId) {
      updateItem();
    } else {
      let body = { topic: name, topicId: educationId };
      await fetch(`http://localhost/leadkku-api/topicsItem/index.php`,
        {
          method: 'POST',
          body: JSON.stringify(body)
        }
      )
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "บันทึกข้อมูลสำเร็จ",
              showConfirmButton: true,
              timer: 1500,
            });
          }
        });
    }

    await getAllEducation();
    setShow(false);
  };

  const onSelectTable = (val) => {
    setSelectTable(val);
    if (val === "ข้อมูลที่บันทึกความสอดคล้อง") {
      getEducations();
    }
  };

  const getEducations = async () => {
    await axios
      .get(`http://localhost/leadkku-api/education/index.php`)
      .then(response => response.json())
      .then((res) => {
        setData(res);
      });
  };

  const getDetail = (id, title, groupnam, docs) => {
    setEId(id);
    setEducationTopic([{ label: groupnam, value: groupnam }]);
    setTitle(title);
    setGname(groupnam);
    setDocument(docs);

    axios
    fetch(`http://localhost/leadkku-api/education/educationOne.php?id=${id}`)
      .then(response => response.json())
      .then((res) => {
        setDetail(res.data);
      });

    setShowDetail(true);
  };

  useEffect(() => {
    getTopic();
    getAllEducation();
    getEducations();
    onSelectTable("ข้อมูลความสอดคล้อง");
  }, []);

  useEffect(() => { }, [getOne]);
  useEffect(() => { }, [option]);

  useEffect(() => {

  }, [counter]);

  return (
    <>
      <Container>
        <Row className="mb-4">
          <Col sm={12}>
            <Row className="mt-4">
              <Col sm={4}></Col>
            </Row>
            <Row className="mb-4">
              <Col sm={12}>
                <Form.Group>
                  <Button
                    style={{ height: '50px', fontSize: '18px' }}
                    variant="primary"
                    onClick={() => onSelectTable("ข้อมูลที่บันทึกความสอดคล้อง")}
                    className="mt-4"
                  >
                    <DatasetIcon />   ข้อมูลความสอดคล้องทั้งหมด
                  </Button>{" "}
                  <Button
                    style={{ height: '50px', fontSize: '18px' }}
                    variant="primary"
                    onClick={() => onSelectTable("ข้อมูลความสอดคล้อง")}
                    className="mt-4"
                  >
                    <ViewModuleIcon />   หัวข้อความสอดคล้อง
                  </Button>{" "}
                  <Button
                    style={{ height: '50px', fontSize: '18px' }}
                    variant="primary"
                    onClick={() => onSelectTable("ข้อมูลกลุ่มความสอดคล้อง")}
                    className="mt-4"
                  >
                    <TocIcon />  กลุ่มความสอดคล้อง
                  </Button>{" "}
                </Form.Group>
              </Col>
            </Row>

            <TableContainer component={Paper} className="mt-2">
              <div className="title text-center mt-4">
                <h5>{selectTable}</h5>
              </div>

              {selectTable === "ข้อมูลที่บันทึกความสอดคล้อง" && (
                <>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell>ชื่อเรื่อง</TableCell>
                        <TableCell>กลุ่ม</TableCell>
                        <TableCell>รายละเอียด</TableCell>
                        <TableCell>จัดการ</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data?.length > 0 && data?.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.educationId}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.groupName}
                          </TableCell>

                          <TableCell component="th" scope="row">
                            <Button
                              onClick={() =>
                                getDetail(
                                  row.educationId,
                                  row.name,
                                  row.groupName,
                                  row.document
                                )
                              }
                            >
                              <TableViewIcon /> รายละเอียด
                            </Button>
                          </TableCell>

                          <TableCell component="th" scope="row">
                            <Button
                              variant="danger"
                              onClick={() => DeleteEducation(row.educationId)}
                            >
                              {" "}
                              <DeleteIcon /> ลบ
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
              {selectTable === "ข้อมูลความสอดคล้อง" && (
                <>
                  <Row className="p-2">
                    <Col sm={4}>
                      <Form.Group>
                        <Form.Label>เลือกกลุ่มสำหรับแสดงข้อมูล </Form.Label>
                        <Select

                          onChange={onSelectTopic}
                          options={option}
                          value={selectedValue}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Button
                        variant="success"
                        style={{ marginTop: "32px" }}
                        onClick={() => setShow(true)}
                      >
                        <AddCircleOutlineIcon /> เพิ่มข้อมูลความสอดคล้อง
                      </Button>{" "}
                    </Col>
                  </Row>

                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell>ชื่อเรื่อง</TableCell>
                        <TableCell>จัดการ</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {getOne?.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.id}
                          </TableCell>

                          <TableCell component="th" scope="row">
                            {row.topic}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Button
                              variant="warning"
                              style={{ color: "#fff" }}
                              onClick={() => handleShow(row.id, row.topic)}
                            >
                              <ModeEditIcon />
                              แก้ไข
                            </Button>{" "}
                            <Button
                              variant="danger"
                              onClick={() => DeleteItemId(row.id)}
                            >
                              {" "}
                              <DeleteIcon /> ลบ
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}

              {selectTable === "ข้อมูลกลุ่มความสอดคล้อง" && (
                <>
                  <Row className="p-2">
                    <Col sm={4}>
                      <Button
                        variant="success"
                        onClick={() => setShowGroup(true)}>
                        <AddCircleOutlineIcon /> เพิ่มกลุ่มข้อมูลความสอดคล้อง
                      </Button>
                    </Col>
                  </Row>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell>ชื่อกลุ่ม</TableCell>
                        <TableCell>จัดการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topics?.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.id}
                          </TableCell>

                          <TableCell component="th" scope="row">
                            {row.topic}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Button
                              variant="warning"
                              style={{ color: "#fff" }}
                              onClick={() => handleShowGroup(row.id, row.topic)}
                            >
                              แก้ไข
                            </Button>{" "}
                            <Button
                              variant="danger"
                              onClick={() => DeleteGroup(row.id)}
                            >
                              ลบ
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </TableContainer>
          </Col>
        </Row>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              {itemId ? "แก้ไขข้อมูล" : "เพิ่มข้อมูลความสอดคล้อง"}{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handelSubmit}>
              {itemId === "" && (
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>เลือกกลุ่มของข้อมูล</Form.Label>
                  <Select
                    onChange={onSelectEducationTopic}
                    options={option}
                    value={educationTopic}
                    required
                  />
                </Form.Group>
              )}

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>ชื่อเรื่อง</Form.Label>
                <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="ตัวอย่าง ทักษะศตวรรษที่ 21"
                  value={name}
                  required
                />
              </Form.Group>

              <Row>
                <Col sm={6}>
                  <Button variant="success" type="submit">
                    <SaveIcon /> {itemId ? "แก้ไข" : "บันทึกข้อมูล"}
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button
                    className="btn-cancel"
                    onClick={() => handleClose()}
                    variant="danger"
                  >
                    {" "}
                    <CancelIcon /> ยกเลิก
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showGroup}
          onHide={handleCloseGroup}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              {GroupId ? "แก้ไขข้อมูล" : "เพิ่มกลุ่มข้อมูลความสอดคล้อง"}{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handelSubmitGroup}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>กลุ่มของข้อมูล</Form.Label>
                <Form.Control
                  onChange={(e) => setNameGroup(e.target.value)}
                  type="text"
                  placeholder="ตัวอย่าง ความสอดคล้องกับนโยบาย"
                  value={nameGroup}
                  required
                />
              </Form.Group>
              <Row>
                <Col sm={6}>
                  <Button variant="success" type="submit">
                    <SaveIcon /> บันทึกข้อมูล
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button
                    className="btn-cancel"
                    onClick={() => handleCloseGroup()}
                    variant="danger"
                  >
                    {" "}
                    <CancelIcon /> ยกเลิก
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showDetail}
          onHide={handleCloseDetail}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>รายละเอียดความสอดคล้อง</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col sm={12}>
                  <Form.Group>
                    <Form.Label>ชื่อเรื่อง</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group sm={12} className="mt-2">
                    <Form.Label>กลุ่ม</Form.Label>
                    <Select
                      onChange={onSelectEducationTopic}
                      options={option}
                      value={educationTopic}
                    />
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className="mt-4">
                    <Form.Label> แก้ไขไฟล์ </Form.Label>
                    <Form.Control
                      type="file"
                      name="photo"
                      onChange={handelUpFile}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Form.Label className="mt-4">คำตอบทั้งหมด</Form.Label>
                {data?.length > 0 && detail?.map((ans, index) => {
                  return (
                    <>
                      <Col
                        sm={12}
                        key={ans.educationdetailId}
                        className="text-left mb-2 mt-2"
                      >
                        <Form.Group>
                          <Form.Control
                            type="text"
                            defaultValue={ans.answer}
                            onChange={(e) =>
                              updateAwnser(index, e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                    </>
                  );
                })}
                <Col sm={12}>
                  {document ? (
                    <PreviewFile path={document} />
                  ) : (
                    <Alert variant="danger" className="text-center">
                      {" "}
                      <AttachFileIcon /> ไม่มีไฟล์แสดง
                    </Alert>
                  )}
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => updateEducationDetail()}>
              แก้ไขข้อมูล
            </Button>
            <Button onClick={() => handleCloseDetail()} variant="danger">
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Education;
