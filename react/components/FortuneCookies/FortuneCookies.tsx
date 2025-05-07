import React, { useEffect, useState } from "react";
import {
  Button,
  IconDelete,
  IconPlus,
  Modal,
  Input,
  Table,
  Spinner,
} from "vtex.styleguide";

import axios from "axios";

type Row = { id: string; CookieFortune: string };

const API = "/_v/fortune";

const AdminFortune: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");

  const fetchRows = async () => {
    setLoading(true);
    const { data } = await axios.get<Row[]>(API);
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleSave = async () => {
    if (!text.trim()) return;
    await axios.post(API, { CookieFortune: text });
    setText("");
    setShow(false);
    fetchRows();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    setRows((r) => r.filter((row) => row.id !== id));
  };

  if (loading) return <Spinner />;

  return (
    <div className="pa6">
      <header className="flex justify-between items-center mb5">
        <h1 className="f2">Fortune cookies</h1>
        <Button variation="primary" onClick={() => setShow(true)}>
          <IconPlus /> &nbsp;Nueva frase
        </Button>
      </header>

      <Table
        schema={{
          properties: {
            CookieFortune: { title: "Frase", width: 90 },
            actions: { title: "", width: 10 },
          },
        }}
        items={rows.map((r) => ({
          ...r,
          actions: (
            <Button
              tone="critical"
              size="small"
              onClick={() => handleDelete(r.id)}
            >
              <IconDelete />
            </Button>
          ),
        }))}
        emptyStateLabel="Aún no hay frases"
      />

      <Modal
        centered
        isOpen={show}
        onClose={() => setShow(false)}
        bottomBar={
          <>
            <Button onClick={() => setShow(false)} variation="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSave} variation="primary">
              Guardar
            </Button>
          </>
        }
      >
        <div className="pa6">
          <h2 className="f3 mb4">Nueva frase</h2>
          <Input
            placeholder="Fortuna China"
            value={text}
            onChange={(e: any) => setText(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AdminFortune;
