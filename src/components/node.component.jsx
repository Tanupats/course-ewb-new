import React, { Fragment, useCallback, useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import { Row, Col, Button } from "react-bootstrap";
import "./node.css";
import axios from "axios";
import SchemaIcon from "@mui/icons-material/Schema";
import Swal from "sweetalert2";

const inniialNodes = [
  {
    id: '0',
    type: 'default',
    data: { label: 'Nodes1' },
    position: { x: -229.35923167589, y: -302.12746162569 }

  },
  {
    id: '1',
    type: 'default',
    data: { label: 'Nodes2' },
    position: { x: 500, y: 0 }

  }
];

const inniialEage = [
  {
    id: 'e0-1',
    source: '0',
    target: '1'
  }
]

const MindNode = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(inniialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(inniialEage);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onLoad = (ReactFlowInstance) => {
    ReactFlowInstance.fitView();
  };

  const getPlos = async () => {
    let nodelist = [];
    await axios
      .get(`http://localhost/leadkku-api/program/index.php`)
      .then(response => response.json())
      .then((res) => {
        console.log('res', res)
        nodelist = res.map((item) => {
          return {
            id: item.programlerningId.toString(),
            position: {
              x: item.x ? Number(item.x) : Math.random() * window.innerWidth,
              y: item.y ? Number(item.y) : Math.random() * window.innerHeight,
            },
            data: {
              label: (
                <div className={`node-item-${item.name}`}> {item.answer}</div>
              ),
            },
          };
        });

        setNodes(nodelist);
      });
  };
  const getEage = async () => {
    let egelist = [];
    await axios
      .get(`http://localhost/leadkku-api/program/detail.php`)
      .then(response => response.json())
      .then((res) => {
        console.log('get agg', res)
        egelist = res.map(ege => {

          return {
            id: `${"e-" + ege.source.toString() + "-" + ege.target.toString()}`,
            source: ege.source.toString(),
            target: ege.target.toString(),
          };
        });
        setEdges(egelist);
      });
  };

  const UpdatePositions = async () => {
    nodes.map((data) => {
      let body = { x: data.position.x, y: data.position.y };
      fetch(
        `http://localhost/leadkku-api/program/index.php?id=${data.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(body)
        }
      );
    });

    Swal.fire({
      position: "center",
      icon: "success",
      title: "แก้ไขข้อมูลสำเร็จ",
      timer: 1500,
    });

    await getPlos();
    await getEage();
  };

  useEffect(() => {

  }, [])

  useEffect(() => {
    getPlos();
    getEage();

  }, []);





  useEffect(() => {
    console.log('n', nodes)
  }, [nodes]);



  return (
    <Fragment>
      <Row>
        <Col sm={12}>
          <Button

            onClick={() =>
              UpdatePositions()}
            variant="warning">
            {" "}
            <SchemaIcon style={{ color: '#fff' }} /> แก้ไขตำแหน่ง{" "}
          </Button>
        </Col>
      </Row>
      <ReactFlow
        style={{ width: "100%", height: "100vh" }}
        onLoad={onLoad}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />

    </Fragment>
  );
};
export default MindNode;
