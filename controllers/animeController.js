import {
  fetchOngoingAnime,
  fetchAnimeDetails,
  fetchBatchDetails,
} from "../services/animeService.js";
import { paginate, parsePositiveInt } from "../utils/pagination.js";

export const getOngoingAnime = async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const result = await fetchOngoingAnime(page);
  res.render("index", {
    animes: result.data,
    pagination: result.pagination,
  });
};

export const getAnimeDetails = async (req, res) => {
  const { slug } = req.params;
  const anime = await fetchAnimeDetails(slug);
  if (anime) {
    res.render("detail", { anime });
  } else {
    res.status(404).send("Anime not found");
  }
};

export const getBatchDetails = async (req, res) => {
  const { slug } = req.params;
  if (!slug) return res.redirect("/");
  const batch = await fetchBatchDetails(slug);
  if (batch) {
    res.json(batch);
  } else {
    res.status(404).send("Batch not found");
  }
};

export const searchAnime = (req, res) => {
  const query = String(req.query.q || "").trim();
  if (!query) return res.json({ results: [] });

  const allAnimeData = req.app.locals.currentAnimeData || [];
  const filteredResults = allAnimeData.filter((anime) =>
    anime.title.toLowerCase().includes(query.toLowerCase()),
  );
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parsePositiveInt(req.query.limit, 20);
  const { results, currentPage, totalPages } = paginate(filteredResults, {
    page,
    limit,
  });

  res.json({
    results,
    currentPage,
    totalPages,
  });
};

export const getAllAnimeAjax = (req, res) => {
  const allAnimeData = req.app.locals.currentAnimeData || [];
  const { results, currentPage, totalPages } = paginate(allAnimeData, {
    page: req.query.page,
    limit: req.query.limit,
  });

  res.json({
    results,
    currentPage,
    totalPages,
  });
};

export const renderAllAnimePage = (req, res) => {
  const allAnimeData = req.app.locals.currentAnimeData || [];
  const { results, ...pagination } = paginate(allAnimeData, {
    page: req.query.page,
  });

  res.render("all-anime", { animes: results, pagination });
};
