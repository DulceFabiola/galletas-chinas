import React, { useState } from "react";
import axios from "axios";
import { Button } from "vtex.styleguide";

const rand = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pad2 = (n: number): string => n.toString().padStart(2, "0");
const pad4 = (n: number): string => n.toString().padStart(4, "0");

const API_BASE_URL =
  "https://fortunechinecookie--valtech.myvtex.com/_v/fortune-cookie-service";

const FortuneCookie: React.FC = () => {
  const [fortune, setFortune] = useState<string>("");
  const [luckyNumber, setLuckyNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const getFortune = async () => {
    setLoading(true);
    setFortune("");
    setLuckyNumber("");

    try {
      const { data } = await axios.get<{ fortune: string }>(
        `${API_BASE_URL}/fortune`
      );

      setFortune(data?.fortune ?? "No fortune found");

      const lucky = `${pad2(rand(0, 99))} ${pad2(rand(0, 99))} ${pad4(
        rand(0, 9999)
      )}`;
      setLuckyNumber(lucky);
    } catch (error) {
      console.error("Error fetching fortune:", error);
      setFortune("Ups, no se pudo obtener la fortuna.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center mw6 w-90 pa4 bg-washed-green br3 shadow-3 tc mt4">
      <h1 className="f3 fw6 mb4">🍪 Galletas Chinas de la Fortuna 🍪</h1>

      <Button
        onClick={getFortune}
        variation="primary"
        isLoading={loading}
        size="regular"
      >
        Obtener mi fortuna
      </Button>

      {!loading && fortune && (
        <div className="mt4">
          <h3 className="f4 f3-ns dark-gray">{fortune}</h3>
          <p className="f6 f5-ns dark-gray mt3">
            Números de la suerte:
            <h5 className="db bg-black-10 pa2 br2 mt2">{luckyNumber}</h5>
          </p>
        </div>
      )}
    </div>
  );
};

export default FortuneCookie;
