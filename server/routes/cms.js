import express from "express";
import mongoose from "mongoose";
import { Portfolio, Team, Stat, Company } from "../models/CmsModels.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const buildIdQuery = (id) => {
  if (!id || id === "undefined") return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { _id: id };
  }
  return { id: id };
};

// GET /api/cms/all — Public: loads all CMS state
router.get("/all", async (req, res) => {
  try {
    const [portfolio, team, stats, company] = await Promise.all([
      Portfolio.find().sort({ order: 1 }),
      Team.find().sort({ order: 1 }),
      Stat.find(),
      Company.findOne(),
    ]);

    res.json({
      success: true,
      portfolio: portfolio.map((p) => ({ ...p.toObject(), id: p._id.toString() })),
      team: team.map((t) => ({ ...t.toObject(), id: t._id.toString() })),
      stats: stats.map((s) => ({ ...s.toObject(), id: s._id.toString() })),
      company: company ? company.toObject() : {},
    });
  } catch (err) {
    console.error("CMS fetch error:", err);
    res.status(500).json({ success: false, error: "Failed to load CMS data." });
  }
});

// --- PORTFOLIO ROUTES ---

// POST /api/cms/portfolio (Protected)
router.post("/portfolio", requireAuth, async (req, res) => {
  try {
    const project = await Portfolio.create(req.body);
    const obj = project.toObject();
    res.json({ success: true, project: { ...obj, id: obj._id.toString() } });
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/cms/portfolio/:id (Protected)
router.put("/portfolio/:id", requireAuth, async (req, res) => {
  try {
    const query = buildIdQuery(req.params.id);
    if (!query) {
      return res.status(400).json({ success: false, error: "Invalid project ID." });
    }
    const project = await Portfolio.findOneAndUpdate(query, { $set: req.body }, { new: true });
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found." });
    }
    const obj = project.toObject();
    res.json({ success: true, project: { ...obj, id: obj._id.toString() } });
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/cms/portfolio/:id (Protected)
router.delete("/portfolio/:id", requireAuth, async (req, res) => {
  try {
    const query = buildIdQuery(req.params.id);
    if (!query) {
      return res.status(400).json({ success: false, error: "Invalid project ID." });
    }
    await Portfolio.findOneAndDelete(query);
    res.json({ success: true, message: "Project deleted." });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- TEAM ROUTES ---

// POST /api/cms/team (Protected)
router.post("/team", requireAuth, async (req, res) => {
  try {
    const member = await Team.create(req.body);
    const obj = member.toObject();
    res.json({ success: true, member: { ...obj, id: obj._id.toString() } });
  } catch (err) {
    console.error("Create team member error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/cms/team/:id (Protected)
router.put("/team/:id", requireAuth, async (req, res) => {
  try {
    const query = buildIdQuery(req.params.id);
    if (!query) {
      return res.status(400).json({ success: false, error: "Invalid member ID." });
    }
    const member = await Team.findOneAndUpdate(query, { $set: req.body }, { new: true });
    if (!member) {
      return res.status(404).json({ success: false, error: "Team member not found." });
    }
    const obj = member.toObject();
    res.json({ success: true, member: { ...obj, id: obj._id.toString() } });
  } catch (err) {
    console.error("Update team member error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/cms/team/:id (Protected)
router.delete("/team/:id", requireAuth, async (req, res) => {
  try {
    const query = buildIdQuery(req.params.id);
    if (!query) {
      return res.status(400).json({ success: false, error: "Invalid member ID." });
    }
    await Team.findOneAndDelete(query);
    res.json({ success: true, message: "Team member removed." });
  } catch (err) {
    console.error("Delete team member error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- STATS ROUTES ---

// PUT /api/cms/stats/:id (Protected)
router.put("/stats/:id", requireAuth, async (req, res) => {
  try {
    const query = buildIdQuery(req.params.id);
    if (!query) {
      return res.status(400).json({ success: false, error: "Invalid stat ID." });
    }
    const stat = await Stat.findOneAndUpdate(query, { $set: req.body }, { new: true });
    if (!stat) {
      return res.status(404).json({ success: false, error: "Stat not found." });
    }
    const obj = stat.toObject();
    res.json({ success: true, stat: { ...obj, id: obj._id.toString() } });
  } catch (err) {
    console.error("Update stat error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/cms/company (Protected)
router.put("/company", requireAuth, async (req, res) => {
  try {
    let company = await Company.findOne();
    if (!company) {
      company = await Company.create(req.body);
    } else {
      Object.assign(company, req.body);
      await company.save();
    }
    res.json({ success: true, company: company.toObject() });
  } catch (err) {
    console.error("Update company error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
