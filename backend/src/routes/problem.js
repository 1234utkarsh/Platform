const express= require("express");
const problemRouter=express.Router();
const adminMiddleware=require("../middleware/adminMiddleware");
const createProblem=require("../controllers/createProblem")

problemRouter.post("/create",adminMiddleware,createProblem);
// problemRouter.patch("/:id",updateProblem);
// problemRouter.delete("/:id",deleteProblem);

// // route to fetch a particular problem
// problemRouter.get("/:id",getProblemById);
// // route to fetch all problem
// problemRouter.get("/",getAllProblem);
// // route to fetch all problem solved by user
// problemRouter.get("/user",solvedAllProblembyUser);

module.exports=problemRouter;
