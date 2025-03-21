import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import "../style/global.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const juegosValidos = (userSnap.data().wishlist || []).filter(
          (juego) => juego.id && juego.image
        );
        setWishlist(juegosValidos);
      }

      setLoading(false);
    };

    fetchWishlist();
  }, []);

  const compartirWishlist = () => {
    if (wishlist.length === 0) {
      alert("No hay juegos en tu Wishlist para compartir.");
      return;
    }

    const listaJuegos = wishlist.map((j) => `🎮 ${j.name}`).join("\n");
    const mensaje = `🎮 Esta es mi Wishlist de juegos 🔥\n¿Me regalas uno y jugamos junt@s? 😏👇\n\n${listaJuegos}\n\n#jeje`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">✨ Mi Wishlist 🎮</h1>

      {loading ? (
        <p className="loading-text">Cargando...</p>
      ) : wishlist.length === 0 ? (
        <p className="empty-wishlist">No hay juegos en tu Wishlist 😢</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((juego) => (
            <div key={juego.id} className="wishlist-card">
              <img src={juego.image} alt={juego.name} className="wishlist-img" />
              <h3 className="wishlist-name">{juego.name}</h3>
              <p className="wishlist-rating">⭐ {juego.rating}</p>
            </div>
          ))}
        </div>
      )}

      <p className="whatsapp-share-text">
        ¿Te tinca? ¡Compártela por WhatsApp! 📲
      </p>
      <button className="floating-whatsapp-btn" onClick={compartirWishlist}>
        <WhatsAppIcon style={{ fontSize: 30 }} />
      </button>
    </div>
  );
};

export default Wishlist;
