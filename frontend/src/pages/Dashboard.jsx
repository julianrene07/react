import React, { useEffect, useState } from "react";
import api from "../services/api";

const containerStyle = {
  fontFamily: "Arial, sans-serif",
  padding: "20px",
  textAlign: "center",
  background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  minHeight: "100vh",
  color: "#fff",
};

const cardStyle = {
  display: "inline-block",
  backgroundColor: "rgba(255,255,255,0.1)",
  borderRadius: "14px",
  padding: "20px 30px",
  marginBottom: "20px",
  backdropFilter: "blur(10px)",
};

const Dashboard = () => {
  const [user, setUser] = useState(null);

  // ---- Adivina el Número ----
  const [mensajeJuego, setMensajeJuego] = useState("Haz clic en Reiniciar para comenzar");
  const [numero, setNumero] = useState("");

  // ---- Adivina el Pokémon ----
  const [pistas, setPistas] = useState(null);
  const [nombreIntento, setNombreIntento] = useState("");
  const [resultadoPoke, setResultadoPoke] = useState("");
  const [imagenPoke, setImagenPoke] = useState("");

  useEffect(() => {
    api.get("/auth/user")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    // Redirige al inicio si no hay sesión después de 2 segundos
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
    return (
      <div style={{ ...containerStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Cerrando sesión...</h2>
      </div>
    );
  }

  // ---- Cerrar sesión ----
  const cerrarSesion = () => {
    window.location.href = "https://ominous-adventure-g4xvpww776q9397x4-3000.app.github.dev/auth/logout";
  };

  // ---- Funciones Adivina el Número ----
  const reiniciarJuego = async () => {
    const res = await fetch("/api/start");
    const data = await res.json();
    setMensajeJuego(data.mensaje);
    setNumero("");
  };

  const enviarIntento = async () => {
    if (!numero) return;
    const res = await fetch("/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero: Number(numero) }),
    });
    const data = await res.json();
    setMensajeJuego(data.mensaje);
  };

  // ---- Funciones Adivina el Pokémon ----
  const iniciarPokemon = async () => {
    setResultadoPoke("");
    setImagenPoke("");
    setNombreIntento("");
    setPistas(null);
    const res = await fetch("/api/pokemon/start");
    const data = await res.json();
    setPistas(data);
  };

  const adivinarPokemon = async () => {
    if (!nombreIntento) return;
    const res = await fetch("/api/pokemon/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombreIntento }),
    });
    const data = await res.json();
    setResultadoPoke(data.mensaje);
    setImagenPoke(data.imagen);
  };

  return (
    <div style={containerStyle}>

      {/* Perfil del usuario */}
      <div style={cardStyle}>
        <img
          src={user.photos?.[0]?.value}
          alt="Foto de perfil"
          style={{ borderRadius: "50%", width: "80px", height: "80px", border: "3px solid #4285F4" }}
        />
        <h2 style={{ margin: "10px 0 5px" }}>Hola, {user.displayName} 👋</h2>
        <p style={{ color: "#ccc", margin: 0 }}>¡Autenticación exitosa con Google!</p>
        <p style={{ color: "#aaa", fontSize: "13px" }}>{user.emails?.[0]?.value}</p>
        <button
          onClick={cerrarSesion}
          style={{
            marginTop: "10px",
            padding: "8px 20px",
            fontSize: "14px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#e74c3c",
            color: "#fff",
            cursor: "pointer"
          }}
          onMouseOver={e => e.target.style.backgroundColor = "#c0392b"}
          onMouseOut={e => e.target.style.backgroundColor = "#e74c3c"}
        >
          🚪 Cerrar sesión
        </button>
      </div>

      <hr style={{ borderColor: "rgba(255,255,255,0.2)", margin: "20px 0" }} />

      {/* Adivina el Número */}
      <h1>🎲 Juego: Adivina el Número</h1>
      <p style={{ fontSize: "1.2rem", color: "#f39c12" }}>{mensajeJuego}</p>
      <input
        type="number"
        value={numero}
        onChange={e => setNumero(e.target.value)}
        placeholder="Escribe un número"
        style={{
          padding: "10px 15px", fontSize: "1rem", borderRadius: "8px",
          border: "2px solid #0984e3", width: "150px",
          textAlign: "center", marginBottom: "15px"
        }}
      />
      <br />
      <button onClick={enviarIntento}
        style={{ padding: "10px 20px", marginRight: "10px", fontSize: "1rem",
          borderRadius: "8px", border: "none", backgroundColor: "#00b894",
          color: "#fff", cursor: "pointer" }}>
        Intentar
      </button>
      <button onClick={reiniciarJuego}
        style={{ padding: "10px 20px", fontSize: "1rem", borderRadius: "8px",
          border: "none", backgroundColor: "#0984e3", color: "#fff", cursor: "pointer" }}>
        Reiniciar Juego
      </button>

      <hr style={{ borderColor: "rgba(255,255,255,0.2)", margin: "30px 0" }} />

      {/* Adivina el Pokémon */}
      <h1>🎮 Juego: Adivina el Pokémon</h1>
      <button onClick={iniciarPokemon}
        style={{ padding: "10px 20px", fontSize: "1rem", borderRadius: "8px",
          border: "none", backgroundColor: "#e17055", color: "#fff", cursor: "pointer" }}>
        Nuevo Pokémon
      </button>

      {pistas && (
        <div style={{ ...cardStyle, marginTop: "20px", textAlign: "left" }}>
          <p>🔢 <strong>ID:</strong> {pistas.id}</p>
          <p>⚡ <strong>Tipo:</strong> {pistas.types.join(", ")}</p>
          <p>🎨 <strong>Color:</strong> {pistas.color}</p>
          <p>📏 <strong>Altura:</strong> {pistas.height}</p>
          <p>⚖️ <strong>Peso:</strong> {pistas.weight}</p>
          <p>⚔️ <strong>Ataques:</strong> {pistas.moves.join(", ")}</p>
        </div>
      )}

      {pistas && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            value={nombreIntento}
            onChange={e => setNombreIntento(e.target.value)}
            placeholder="Escribe el nombre del Pokémon"
            style={{
              padding: "10px 15px", fontSize: "1rem", borderRadius: "8px",
              border: "2px solid #e17055", width: "220px",
              textAlign: "center", marginBottom: "10px"
            }}
          />
          <br />
          <button onClick={adivinarPokemon}
            style={{ padding: "10px 20px", fontSize: "1rem", borderRadius: "8px",
              border: "none", backgroundColor: "#6c5ce7", color: "#fff", cursor: "pointer" }}>
            ¡Adivinar!
          </button>
        </div>
      )}

      {resultadoPoke && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "1.3rem", fontWeight: "bold" }}>{resultadoPoke}</p>
          {imagenPoke && <img src={imagenPoke} alt="Pokemon" style={{ width: "150px", marginTop: "10px" }} />}
        </div>
      )}

    </div>
  );
};

export default Dashboard;