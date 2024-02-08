import React, { useEffect, useState } from "react";
import { Col, Row, Container, Card, Button } from "react-bootstrap";
import EdcationDetail from "./EducationDetail";
import "../index.css";
import PreviewIcon from "@mui/icons-material/Preview";
import { useNavigate } from "react-router-dom";
const ReportAll = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false);
  const [data, setData] = useState([{
    educationdetailId: "58",
    answer: "คำตอบใหม่eee",
    educationId: 27
  }]);

  

  function downloadURI(uri, name) {
    if (uri !== "") {
      var link = document.createElement("a");
      link.download = name;
      link.href = `${import.meta.env.VITE_BASE_URL}/${uri}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }


  


  const getData = async () => {
 await  fetch(`${import.meta.env.VITE_BASE_URL}/education/index.php`)
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
                                onClick={()=> downloadURI(data.document,data.name)}
                              >
                                <PreviewIcon />โหลดเอกสาร
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
      
      </Container>
    </>
  );
};

export default ReportAll;
