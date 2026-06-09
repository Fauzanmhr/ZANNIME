import express from "express";
import "dotenv/config";
import path from "path";
import {
  animeRoutes,
  genreRoutes,
  episodeRoutes,
  scheduleRoutes,
} from "./routes/Routes.js";
import { fetchAllAnimeData } from "./services/animeService.js";

const __dirname = import.meta.dirname;

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")),
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")),
);
app.use(
  "/icons",
  express.static(path.join(__dirname, "node_modules/bootstrap-icons/font")),
);

app.locals.sourceData = [];
app.locals.buildAnimePath = (anime) =>
  anime?.animeId ? `/anime/${anime.animeId}` : "#";
app.locals.buildEpisodePath = (episode) =>
  episode?.episodeId ? `/episode/${episode.episodeId}` : "#";
app.locals.buildBatchPath = (batch) =>
  batch?.batchId ? `/batch/${batch.batchId}` : "#";
app.locals.buildGenrePath = (genre) =>
  genre?.genreId ? `/genres/${genre.genreId}` : "#";

app.use((req, res, next) => {
  req.app.locals.currentAnimeData = app.locals.sourceData;
  next();
});

const fetchAllSourcesData = async () => {
  const data = await fetchAllAnimeData();
  app.locals.sourceData = data;
  console.log(`Data loaded: ${data.length} anime from otakudesu`);
};

await fetchAllSourcesData();

app.use(
  "/",
  animeRoutes,
  genreRoutes,
  episodeRoutes,
  scheduleRoutes,
);

app.use((req, res) => {
  res.status(404).render("404");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("404", {
    error: {
      status: 500,
      message: "Internal server error",
    },
  });
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`),
);

setInterval(fetchAllSourcesData, 60 * 60 * 1000);
