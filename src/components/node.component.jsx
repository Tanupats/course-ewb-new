import React, { Fragment, useCallback, useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import { Row, Col, Button } from "react-bootstrap";
import "./node.css";
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

  const initialPosition = { x: 0, y: 0 }; // ตำแหน่งเริ่มต้นที่ต้องการ
  const initialZoom = 1; // ระดับซูมเริ่มต้นที่ต้องการ

  const getPlos = async () => {
    let nodelist = [];
    await fetch(`${import.meta.env.VITE_BASE_URL}/program/index.php`)
      .then(response => response.json())
      .then((res) => {
        
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
    await fetch(`${import.meta.env.VITE_BASE_URL}/program/detail.php`)
      .then(response => response.json())
      .then((res) => {
       
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
        `${import.meta.env.VITE_BASE_URL}/program/index.php?id=${data.id}`,
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
      
  }, [nodes]);
  useEffect(() => {
  
  }, [edges]);



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
      className="mt-4"
     zoom={-0.6}
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
