import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import "../style/global.css";

function TarjetaJuego({ juego }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const animacion = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(30px)",
    config: { tension: 150, friction: 20 },
  });

  const addToWishlist = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Inicia sesión para agregar juegos a tu Wishlist.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        wishlist: arrayUnion({
          id: juego.id,
          name: juego.name,
          image: juego.background_image,
          rating: juego.metacritic,
        }),
      });
      alert("🎉 ¡Juego añadido a tu Wishlist!");
    } catch (error) {
      console.error("Error al agregar a Wishlist:", error);
    }
  };

  return (
    <animated.div ref={ref} style={animacion} className="card tarjeta-juego">
      <Link to={`/game/${juego.id}`}>
        <img src={juego.background_image} alt={juego.name} />
        <h3>{juego.name}</h3>
        <p>⭐ {juego.metacritic || "Sin puntuación"}</p>
      </Link>
      <button onClick={addToWishlist} className="wishlist-btn">
        💖 Agregar
      </button>
    </animated.div>
  );
}

export default TarjetaJuego;
