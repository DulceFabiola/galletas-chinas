import "whatwg-fetch";
import React from "react";
import { useState } from "react";
import axios from "axios";

const API_URL = "/_v/fortune";

const Spinner = () => (
  <div style={{ marginTop: "1rem" }}>
    <div className="spinner" />
    <style>{`
      .spinner{
        margin:auto;border:4px solid #eee;border-top:4px solid #fcbf49;
        border-radius:50%;width:40px;height:40px;
        animation:spin 1s linear infinite;
      }
      @keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
    `}</style>
  </div>
);

const FortuneCookies = () => {
  const [loading, setLoading] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [lucky, setLucky] = useState("");

  const luckyNumber = () => `${rand2()}-${rand2()}-${rand4()}`;
  const rand2 = () => Math.floor(Math.random() * 90 + 10);
  const rand4 = () => Math.floor(Math.random() * 9000 + 1000);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL);

      if (!data?.length) throw new Error("Sin registros");
      const random = data[Math.floor(Math.random() * data.length)];
      setPhrase(random.CoookieFortune);
      setLucky(luckyNumber());
    } catch (err) {
      console.error(err);
      setPhrase("No pudimos obtener tu fortuna 😕");
      setLucky("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <button
        onClick={handleClick}
        style={{
          padding: "0.5rem 1rem",
          fontSize: 16,
          background: "#fcbf49",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Obtener fortuna
      </button>

      {loading && <Spinner />}
      {!loading && phrase && <h3 style={{ marginTop: "2rem" }}>{phrase}</h3>}
      {!loading && lucky && <h5 style={{ color: "#888" }}>{lucky}</h5>}
    </div>
  );
};

export default FortuneCookies;
