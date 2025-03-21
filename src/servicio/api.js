import axios from "axios";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api/games";

// Obtener todos los juegos con paginación y filtros
export async function obtenerTodosLosJuegos(
  pagina = 1,
  pageSize = 10,
  busqueda = "",
  orden = "-metacritic",
  filtros = {}
) {
  try {
    const params = {
      key: API_KEY,
      page: pagina,
      page_size: pageSize,
      ordering: orden,
      search: busqueda || undefined,
      dates: filtros.año ? `${filtros.año}-01-01,${filtros.año}-12-31` : undefined,
      genres: filtros.genero || undefined,
      platforms: filtros.plataforma || undefined,
      tags: filtros.tag || undefined,
      developers: filtros.empresa || undefined,
      publishers: filtros.empresa || undefined,
    };

    const { data } = await axios.get(BASE_URL, { params });

    const juegosBase = data.results.map((juego) => ({
      id: juego.id,
      name: juego.name,
      background_image: juego.background_image,
      metacritic: juego.metacritic,
      genres: juego.genres || [],
      platforms: juego.platforms || [],
      tags: juego.tags || [],
    }));

    const juegosConEmpresas = await Promise.all(
      juegosBase.map(async (juego) => {
        try {
          const detalles = await axios.get(`${BASE_URL}/${juego.id}`, {
            params: { key: API_KEY },
          });

          return {
            ...juego,
            developers: detalles.data.developers || [],
            publishers: detalles.data.publishers || [],
            released: detalles.data.released || "",
          };
        } catch {
          return { ...juego, developers: [], publishers: [], released: "" };
        }
      })
    );

    return { results: juegosConEmpresas, count: data.count };
  } catch (error) {
    console.error("❌ Error al obtener los juegos:", error);
    return { results: [], count: 0 };
  }
}

// Obtener datos para filtros
export async function obtenerGeneros() {
  const { data } = await axios.get("https://api.rawg.io/api/genres", {
    params: { key: API_KEY },
  });
  return data.results;
}

export async function obtenerPlataformas() {
  const { data } = await axios.get("https://api.rawg.io/api/platforms", {
    params: { key: API_KEY },
  });
  return data.results;
}

export async function obtenerTags() {
  const { data } = await axios.get("https://api.rawg.io/api/tags", {
    params: { key: API_KEY },
  });
  return data.results;
}

export async function obtenerEmpresas() {
  const { data } = await axios.get("https://api.rawg.io/api/developers", {
    params: { key: API_KEY },
  });
  return data.results;
}

// Obtener detalle de juego (con screenshots y trailers)
export async function obtenerDetallesJuego(id) {
  try {
    const [detalles, screenshots, trailers] = await Promise.all([
      axios.get(`${BASE_URL}/${id}`, { params: { key: API_KEY } }),
      axios.get(`${BASE_URL}/${id}/screenshots`, { params: { key: API_KEY } }),
      axios.get(`${BASE_URL}/${id}/movies`, { params: { key: API_KEY } }),
    ]);

    return {
      ...detalles.data,
      screenshots: screenshots.data?.results || [],
      trailers: trailers.data?.results || [],
    };
  } catch (error) {
    console.error("Error al obtener los detalles del juego:", error);
    return null;
  }
}

// Obtener tráiler principal
export async function obtenerTrailerJuego(id) {
  try {
    const { data } = await axios.get(`${BASE_URL}/${id}/movies`, {
      params: { key: API_KEY },
    });

    if (data.results.length > 0) {
      return data.results[0].data?.max || data.results[0].data?.["480"];
    }
  } catch (error) {
    console.error("Error al obtener los trailers:", error);
  }
  return null;
}

// Obtener todos los trailers como array
export async function obtenerTrailersJuego(id) {
  try {
    const { data } = await axios.get(`${BASE_URL}/${id}/movies`, {
      params: { key: API_KEY },
    });

    return data.results.map((trailer) => trailer.data?.max || "").filter(Boolean);
  } catch (error) {
    console.error("Error al obtener los trailers:", error);
    return [];
  }
}

// Obtener juegos con tráiler
export async function obtenerJuegosConTrailer(pagina = 1, pageSize = 10) {
  try {
    const juegos = await obtenerTodosLosJuegos(pagina, pageSize);

    const juegosConTrailer = await Promise.all(
      juegos.results.map(async (juego) => {
        const trailer = await obtenerTrailerJuego(juego.id);
        return {
          ...juego,
          trailer:
            trailer ||
            `https://www.youtube.com/results?search_query=${encodeURIComponent(juego.name + " official game trailer")}`,
        };
      })
    );

    return juegosConTrailer;
  } catch (error) {
    console.error("Error al obtener los juegos con trailer:", error);
    return [];
  }
}
