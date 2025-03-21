import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerDetallesJuego, obtenerTrailerJuego } from "../servicio/api";
import "../style/global.css";
import { Typography, Spin, Carousel, Tag } from "antd";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { motion } from "framer-motion";

const { Title } = Typography;

function Detail() {
  const { id } = useParams();
  const [juego, setJuego] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [tipoTrailer, setTipoTrailer] = useState(null);

  useEffect(() => {
    async function cargarDetalles() {
      setCargando(true);
      try {
        const detalles = await obtenerDetallesJuego(id);
        setJuego(detalles);
        const trailer = await obtenerTrailerJuego(id);

        if (trailer) {
          setTrailerUrl(trailer);
          setTipoTrailer(trailer.endsWith(".mp4") ? "mp4" : "link");
        } else {
          const youtubeLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(detalles.name + " trailer")}`;
          setTrailerUrl(youtubeLink);
          setTipoTrailer("link");
        }
      } catch (error) {
        console.error("Error al cargar los detalles del juego:", error);
      }
      setCargando(false);
    }

    cargarDetalles();
  }, [id]);

  const compartirPorWhatsApp = () => {
    const mensaje = `🎮 ¡Mira este juegazo que encontré! Se llama *${juego.name}* y se ve brutal 😍🔥\n\n¡Échale un vistazo y dime si lo jugamos juntos!`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  if (cargando) {
    return (
      <div className="cargando">
        <Spin size="large" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (!juego) return <p>Error al cargar el juego.</p>;

  return (
    <motion.div
      className="detalle-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="detalle-box">
        <Title level={1} className="titulo-juego">{juego.name}</Title>

        {juego.background_image && (
          <motion.img
            className="background-image"
            src={juego.background_image}
            alt={juego.name}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Tráiler */}
        <div className="trailer-container">
          <h2>🎬 Tráiler</h2>
          {trailerUrl && tipoTrailer === "mp4" ? (
            <motion.video
              controls
              className="trailer"
              src={trailerUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          ) : trailerUrl ? (
            <motion.a
              href={trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ver-trailer"
              whileHover={{ scale: 1.05 }}
            >
              🔗 Ver tráiler en YouTube
            </motion.a>
          ) : (
            <p className="no-info">No hay tráiler disponible.</p>
          )}
        </div>

        {/* Capturas */}
        {juego.screenshots?.length > 0 ? (
          <div className="screenshots-container">
            <h2>📸 Capturas de pantalla</h2>
            <Carousel autoplay className="carousel">
              {juego.screenshots.map((img, index) => (
                <div key={index} className="carousel-slide">
                  <img
                    src={img.image}
                    alt={`Screenshot ${index + 1}`}
                    className="screenshot"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <p className="no-info">No hay capturas disponibles.</p>
        )}

        {/* Información */}
        <div className="info-juego">
          <p><strong>📅 Fecha de lanzamiento:</strong> {juego.released ?? "Desconocida"}</p>
          <p><strong>🎭 Géneros:</strong> {juego.genres?.map((g) => g.name).join(", ") || "N/A"}</p>
          <p><strong>🎮 Plataformas:</strong> {juego.platforms?.map((p) => p.platform.name).join(", ") || "N/A"}</p>
          <p><strong>🏢 Desarrolladora:</strong> {juego.developers?.map((d) => d.name).join(", ") || "N/A"}</p>
          <p><strong>⭐ Puntuación:</strong> {juego.metacritic ?? "N/A"}</p>
          {juego.website && (
            <p>
              <strong>🔗 Más información:</strong>{" "}
              <a href={juego.website} target="_blank" rel="noopener noreferrer">
                Sitio web oficial
              </a>
            </p>
          )}
        </div>

        {/* Tags */}
        {juego.tags?.length > 0 && (
          <div className="tags-section">
            <h3>🏷 Tags populares:</h3>
            <div className="tags-list">
              {juego.tags.slice(0, 10).map((tag) => (
                <Tag color="geekblue" key={tag.id}>
                  {tag.name}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Botón de WhatsApp */}
        <p className="whatsapp-share-text">
          ¿Te tinca? ¡Compártelo por WhatsApp y nos echamos unas partidas 😏🔥!
        </p>
        <motion.button
          className="floating-whatsapp-btn"
          onClick={compartirPorWhatsApp}
          whileHover={{ scale: 1.1 }}
        >
          <WhatsAppIcon style={{ fontSize: 32 }} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Detail;
