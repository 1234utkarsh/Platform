const express= require("express");
const problemRouter=express.Router();
const adminMiddleware=require("../middleware/adminMiddleware");
const userMiddleware= require("../middleware/userMiddleware")
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser}=require("../controllers/createProblem")

problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);

// route to fetch a particular problem
problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
// route to fetch all problem
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
// // route to fetch all problem solved by user
problemRouter.get("/problemSolvedByUser",userMiddleware, solvedAllProblembyUser);

module.exports=problemRouter;
