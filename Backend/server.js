import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

// Configuración de CORS
app.use(cors({
  origin: "https://ominous-adventure-g4xvpww776q9397x4-5173.app.github.dev",
  credentials: true
}));

// Configuración de sesión
app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    sameSite: "lax",
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Serializar usuario
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Estrategia de Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://ominous-adventure-g4xvpww776q9397x4-3000.app.github.dev/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// ==============================
// RUTAS DE AUTENTICACIÓN
// ==============================
app.get("/", (req, res) => res.send("Servidor funcionando correctamente"));

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("https://ominous-adventure-g4xvpww776q9397x4-5173.app.github.dev/dashboard");
  }
);

app.get("/auth/user", (req, res) => {
  res.send(req.user || null);
});

app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("https://ominous-adventure-g4xvpww776q9397x4-5173.app.github.dev/");
  });
});

// ==============================
// JUEGO: ADIVINA EL NÚMERO
// ==============================
let numeroSecreto = Math.floor(Math.random() * 100) + 1;

app.get("/api/start", (req, res) => {
  numeroSecreto = Math.floor(Math.random() * 100) + 1;
  res.json({ mensaje: "Nuevo juego iniciado. Adivina un número entre 1 y 100." });
});

app.post("/api/guess", (req, res) => {
  const intento = req.body.numero;
  if (!intento && intento !== 0) {
    return res.status(400).json({ mensaje: "Debes enviar un número." });
  }
  if (intento < numeroSecreto) {
    res.json({ mensaje: "📈 El número secreto es mayor" });
  } else if (intento > numeroSecreto) {
    res.json({ mensaje: "📉 El número secreto es menor" });
  } else {
    res.json({ mensaje: "🎉 ¡Correcto! Adivinaste el número." });
  }
});

// ==============================
// JUEGO: ADIVINA EL POKÉMON
// ==============================
let pokemonActual = null;

app.get("/api/pokemon/start", async (req, res) => {
  try {
    const id = Math.floor(Math.random() * 151) + 1;
    const resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await resPoke.json();
    const resSpecies = await fetch(data.species.url);
    const species = await resSpecies.json();

    pokemonActual = {
      name: data.name,
      id: data.id,
      types: data.types.map(t => t.type.name),
      height: data.height,
      weight: data.weight,
      color: species.color.name,
      moves: data.moves.slice(0, 4).map(m => m.move.name),
      image: data.sprites.other.dream_world.front_default || data.sprites.front_default,
    };

    res.json({
      id: pokemonActual.id,
      types: pokemonActual.types,
      height: pokemonActual.height,
      weight: pokemonActual.weight,
      color: pokemonActual.color,
      moves: pokemonActual.moves,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el Pokémon" });
  }
});

app.post("/api/pokemon/guess", (req, res) => {
  const intento = req.body.nombre?.toLowerCase().trim();
  if (!intento) return res.status(400).json({ mensaje: "Debes enviar un nombre." });
  if (!pokemonActual) return res.status(400).json({ mensaje: "Primero inicia el juego." });

  if (intento === pokemonActual.name) {
    res.json({ mensaje: `✅ ¡Correcto! Es ${pokemonActual.name}`, imagen: pokemonActual.image, correcto: true });
  } else {
    res.json({ mensaje: `❌ Incorrecto, el Pokémon era ${pokemonActual.name}`, imagen: pokemonActual.image, correcto: false });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});