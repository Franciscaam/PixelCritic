import React, { useEffect, useState } from "react";
import { Pagination, Select, Input, Spin } from "antd";
import {
  obtenerTodosLosJuegos,
  obtenerGeneros,
  obtenerPlataformas,
  obtenerTags,
  obtenerEmpresas
} from "../servicio/api";
import TarjetaJuego from "../components/TarjetaJuego";
import Background from "../components/Background";
import "../style/global.css";

const Home = () => {
  const [juegos, setJuegos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalJuegos, setTotalJuegos] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [filtroAño, setFiltroAño] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroPlataforma, setFiltroPlataforma] = useState("");
  const [filtroTag, setFiltroTag] = useState("");
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [años, setAños] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [tags, setTags] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const juegosPorPagina = 20;

  useEffect(() => {
    async function cargarFiltros() {
      const [resGeneros, resPlataformas, resTags, resEmpresas] = await Promise.all([
        obtenerGeneros(),
        obtenerPlataformas(),
        obtenerTags(),
        obtenerEmpresas()
      ]);

      setGeneros(resGeneros.map((g) => ({ nombre: g.name, valor: g.slug })));
      setPlataformas(resPlataformas.map((p) => ({ nombre: p.name, valor: p.id })));
      setTags(resTags.map((t) => ({ nombre: t.name, valor: t.slug })));
      setEmpresas(resEmpresas.map((e) => ({ nombre: e.name, valor: e.slug })));
    }

    cargarFiltros();
  }, []);

  useEffect(() => {
    async function cargarJuegos() {
      setCargando(true);

      const filtros = {
        año: filtroAño,
        genero: filtroGenero,
        plataforma: filtroPlataforma,
        tag: filtroTag,
        empresa: filtroEmpresa,
      };

      const respuesta = await obtenerTodosLosJuegos(pagina, juegosPorPagina, busqueda, "-metacritic", filtros);
      const juegosObtenidos = respuesta.results || [];

      setJuegos(juegosObtenidos);
      setTotalJuegos(respuesta.count || 0);
      setCargando(false);

      const allAños = new Set();
      juegosObtenidos.forEach((j) => {
        if (j.released?.length >= 4) allAños.add(j.released.substring(0, 4));
      });
      setAños([...allAños].sort((a, b) => b - a));
    }

    cargarJuegos();
  }, [pagina, busqueda, filtroAño, filtroGenero, filtroPlataforma, filtroTag, filtroEmpresa]);

  useEffect(() => {
    setPagina(1);
  }, [busqueda, filtroAño, filtroGenero, filtroPlataforma, filtroTag, filtroEmpresa]);

  return (
    <>
      <Background />
      <div className="container">
        <h1 className="animated-title">🔥 Top Videojuegos</h1>

        <Input
          placeholder="🔎 Buscar juegos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-bar"
        />

        <div className="filters">
          <Select placeholder="📅 Año" onChange={setFiltroAño} allowClear>
            {años.map((año, index) => (
              <Select.Option key={index} value={año}>{año}</Select.Option>
            ))}
          </Select>

          <Select placeholder="🎭 Género" onChange={setFiltroGenero} allowClear>
            {generos.map((g, index) => (
              <Select.Option key={index} value={g.valor}>{g.nombre}</Select.Option>
            ))}
          </Select>

          <Select placeholder="🕹 Plataforma" onChange={setFiltroPlataforma} allowClear>
            {plataformas.map((p, index) => (
              <Select.Option key={index} value={p.valor}>{p.nombre}</Select.Option>
            ))}
          </Select>

          <Select placeholder="🏷 Tag" onChange={setFiltroTag} allowClear>
            {tags.map((t, index) => (
              <Select.Option key={index} value={t.valor}>{t.nombre}</Select.Option>
            ))}
          </Select>

          <Select placeholder="🏢 Empresa" onChange={setFiltroEmpresa} allowClear>
            {empresas.map((e, index) => (
              <Select.Option key={index} value={e.valor}>{e.nombre}</Select.Option>
            ))}
          </Select>
        </div>

        {cargando ? (
          <Spin size="large" className="loading-spinner" />
        ) : (
          <div className="grid">
            {juegos.length > 0 ? (
              juegos.map((juego) => <TarjetaJuego key={juego.id} juego={juego} />)
            ) : (
              <p>No se encontraron juegos</p>
            )}
          </div>
        )}

        <Pagination
          current={pagina}
          pageSize={juegosPorPagina}
          total={totalJuegos}
          onChange={setPagina}
          showSizeChanger={false}
          className="pagination"
        />
      </div>
    </>
  );
};

export default Home;
