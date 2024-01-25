import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
const EdcationDetail = (props) => {
  const { id } = props;
  const [data, setData] = useState([]);
  const getDetail = (id) => {
    axios
      .get(`http://localhost/leadkku-api/education/educationOne.php?id=${id}`)
      .then(response => response.json())
      .then((res) => {
        setData(res);
      });
  };

  useEffect(() => {
    getDetail(id);
  }, []);
  return (
    <>
      <Row>
        {data?.length > 0 && data?.map((ans) => {
          return (
            <>
              <Col sm={12} className="text-left">
                <h5>{ans.answer}</h5>
              </Col>
            </>
          );
        })}
      </Row>
    </>
  );
};

export default EdcationDetail;
