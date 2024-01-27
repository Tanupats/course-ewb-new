import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
const EdcationDetail = (props) => {
  const { id } = props;
  const [data, setData] = useState([]);
  const getDetail = (id) => {

    fetch(`${import.meta.env.VITE_BASE_URL}/education/educationOne.php?id=${id}`)
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
