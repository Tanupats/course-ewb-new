import React, { useEffect, useState } from "react";
import { Col, Row, Container, Card, Button, Modal } from "react-bootstrap";
import axios from "axios";
import EdcationDetail from "./EducationDetail";
import "../index.css";
import PreviewFile from "./PreviewFile";
import PreviewIcon from "@mui/icons-material/Preview";
const ReportAll = () => {

  const [show, setShow] = useState(false);
  const [data, setData] = useState([{
    educationdetailId: "58",
    answer: "คำตอบใหม่eee",
    educationId: 27
  }]);
  const [src, setSrc] = useState("");

  const handelShow = (path) => {
    setSrc(path);
    setShow(true);
  };

  const handelClose = () => setShow(false);

  const getData = async () => {
    await axios
      .get(`http://localhost/leadkku-api/education/index.php`)
      .then(response=>response.json())
      .then((res) => {
        setData(res);
      });
  };

  useEffect(() => {
    getData();
  }, []);
  
  return (
    <>
      <Container>
        <Row>
          <Col sm={12} className="text-center" style={{ marginTop: "30px" }}>
            <div className="text-center mt-4 mb-4">
              <h5>สรุปความสอดของการศึกษาทั้งหมด</h5>
            </div>

            <Row>


              {


                data?.length > 0 && data?.map((data, index) => {
                  return (
                    <>
                      <Col sm={4} className="mb-4" key={index}>
                        <Card>
                          <Card.Title className="title-bg text-left">
                            <Row>
                              <Col sm={12}>{data.groupName}</Col>
                            </Row>
                          </Card.Title>

                          <h5 className="mt-2">เรื่อง :  {data.name}</h5>

                          <EdcationDetail id={data.educationId} />
                          {data.document !== "" && (
                            <>
                              <Button
                                className="mt-4"
                                variant="success"
                                onClick={() => handelShow(data.document)}
                              >
                                <PreviewIcon /> ดูไฟล์
                              </Button>
                            </>
                          )}
                        </Card>
                      </Col>
                    </>
                  );
                })


              }

            </Row>
          </Col>
        </Row>
        <Modal size="md" show={show} onHide={handelClose}>
          <Modal.Header>
            <Modal.Title>PreviewFile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PreviewFile path={src} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handelClose}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default ReportAll;
