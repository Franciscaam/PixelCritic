import React, { useEffect, useState } from "react";
import { obtenerTodosLosJuegos } from "../servicio/api";
import TarjetaJuego from "../components/TarjetaJuego";
import Background from "../components/Background";
import { Spin } from "antd";
import "../style/global.css";

const Populares = () => {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarPopulares() {
      setCargando(true);
      const respuesta = await obtenerTodosLosJuegos(1, 30, "", "-added");
      setJuegos(respuesta.results || []);
      setCargando(false);
    }

    cargarPopulares();
  }, []);

  return (
    <>
      <Background />
      <div className="container">
        <h1 className="animated-title">🔥 Juegos Populares</h1>
        <p className="populares-desc">
          Aquí encontrarás los juegos que están siendo más añadidos por los usuarios en todo el mundo.
          Esta lista se actualiza según la actividad global en la plataforma.
        </p>

        {cargando ? (
          <Spin size="large" />
        ) : (
          <div className="grid">
            {juegos.length > 0 ? (
              juegos.map((juego) => (
                <TarjetaJuego key={juego.id} juego={juego} />
              ))
            ) : (
              <p className="no-info">No se encontraron juegos populares en este momento.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Populares;
