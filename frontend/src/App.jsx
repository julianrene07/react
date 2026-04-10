import { useEffect, useState } from "react";

function App() {
  // ---- Conexión básica ----
  const [mensaje, setMensaje] = useState("");

  // ---- Adivina el Número ----
  const [mensajeJuego, setMensajeJuego] = useState("Haz clic en Reiniciar para comenzar");
  const [numero, setNumero] = useState("");

  // ---- Adivina el Pokémon ----
  const [pistas, setPistas] = useState(null);
  const [nombreIntento, setNombreIntento] = useState("");
  const [resultadoPoke, setResultadoPoke] = useState("");
  const [imagenPoke, setImagenPoke] = useState("");

  useEffect(() => {
    fetch("/api/mensaje")
      .then(res => res.json())
      .then(data => setMensaje(data.texto));
  }, []);

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
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center" }}>

      {/* Conexión básica */}
      <h1 style={{ color: "#2d3436" }}>Frontend conectado</h1>
      <p style={{ color: "#0984e3" }}>{mensaje}</p>
      <hr style={{ margin: "20px 0" }} />

      {/* Adivina el Número */}
      <h1>🎲 Juego: Adivina el Número</h1>
      <p style={{ fontSize: "1.2rem", color: "#d63031" }}>{mensajeJuego}</p>
      <input
        type="number"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
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
          color: "#fff", cursor: "pointer" }}
        onMouseOver={e => e.target.style.backgroundColor = "#019875"}
        onMouseOut={e => e.target.style.backgroundColor = "#00b894"}>
        Intentar
      </button>
      <button onClick={reiniciarJuego}
        style={{ padding: "10px 20px", fontSize: "1rem", borderRadius: "8px",
          border: "none", backgroundColor: "#0984e3", color: "#fff", cursor: "pointer" }}
        onMouseOver={e => e.target.style.backgroundColor = "#0652dd"}
        onMouseOut={e => e.target.style.backgroundColor = "#0984e3"}>
        Reiniciar Juego
      </button>

      <hr style={{ margin: "30px 0" }} />

      {/* Adivina el Pokémon */}
      <h1>🎮 Juego: Adivina el Pokémon</h1>
      <button onClick={iniciarPokemon}
        style={{ padding: "10px 20px", fontSize: "1rem", borderRadius: "8px",
          border: "none", backgroundColor: "#e17055", color: "#fff", cursor: "pointer" }}
        onMouseOver={e => e.target.style.backgroundColor = "#c0392b"}
        onMouseOut={e => e.target.style.backgroundColor = "#e17055"}>
        Nuevo Pokémon
      </button>

      {pistas && (
        <div style={{ marginTop: "20px", display: "inline-block", textAlign: "left",
          backgroundColor: "#f5f6fa", padding: "20px", borderRadius: "12px",
          border: "2px solid #dfe6e9" }}>
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
            onChange={(e) => setNombreIntento(e.target.value)}
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
              border: "none", backgroundColor: "#6c5ce7", color: "#fff", cursor: "pointer" }}
            onMouseOver={e => e.target.style.backgroundColor = "#5541d7"}
            onMouseOut={e => e.target.style.backgroundColor = "#6c5ce7"}>
            ¡Adivinar!
          </button>
        </div>
      )}

      {resultadoPoke && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "1.3rem", fontWeight: "bold" }}>{resultadoPoke}</p>
          {imagenPoke && (
            <img src={imagenPoke} alt="Pokemon"
              style={{ width: "150px", marginTop: "10px" }} />
          )}
        </div>
      )}

    </div>
  );
}

export default App;