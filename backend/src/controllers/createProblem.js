const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

const Problem=require("../models/problem")

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    for (const { language, completeCode } of referenceSolution) {
      // source_code:
      // language_id:
      // stdin:
      // expectedOutput:

      const languageId = getLanguageById(language);
      // I am creating Batch submission
      const submissions = visibleTestCases.map((testCase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
      }));

      const submitResult = await submitBatch(submissions);

      const resultToken = submitResult.map((value) => value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id == 4) {
          return res.status(400).send("Wrong Answer");
        }
        if (test.status_id == 5) {
          return res.status(400).send("Time Limit Exceeded");
        }
        if (test.status_id == 6) {
          return res.status(400).send("Compilation Error");
        }
        if (test.status_id == 7) {
          return res.status(400).send("Runtime Error (SIGSEGV)");
        }
        if (test.status_id == 8) {
          return res.status(400).send("Runtime Error (SIGXFSZ)");
        }
        if (test.status_id == 9) {
          return res.status(400).send("Runtime Error (SIGFPE)");
        }
        if (test.status_id == 10) {
          return res.status(400).send("Runtime Error (SIGABRT)");
        }
        if (test.status_id == 11) {
          return res.status(400).send("Runtime Error (NZEC)");
        }
        if (test.status_id == 12) {
          return res.status(400).send("Runtime Error (Other)");
        }
        if (test.status_id == 13) {
          return res.status(400).send("Internal Error");
        }
        if (test.status_id == 14) {
          return res.status(400).send("Exec Format Error");
        }
      }

      

    }
    // we can store it in our DB
    const userProblem=await Problem.create({
      ...req.body,
      problemCreator:req.result._id
    });

    res.status(201).send("Problem saved successfully");
  } catch (err) {
    res.status(400).send("Error:"+err);
  }
}

module.exports=createProblem
