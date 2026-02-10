import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
  <div className="min-h-screen bg-base-200 py-10">
    <div className="max-w-6xl mx-auto px-6">
      
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Create New Problem</h1>
        <p className="text-base-content/70 mt-2">
          Add problem details, test cases, and reference solutions
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

        {/* ================= BASIC INFORMATION ================= */}
<div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-8 shadow-xl">
  
  {/* Header */}
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-white">
      Basic Information
    </h2>
    <p className="text-slate-400 mt-1 text-sm">
      Define the problem statement and metadata
    </p>
  </div>

  {/* Form Content */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

    {/* LEFT COLUMN */}
    <div className="space-y-6">

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Problem Title
        </label>
        <input
          {...register("title")}
          placeholder="Reverse a Linked List"
          className="w-full rounded-lg bg-[#020617] border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Difficulty + Tag */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Difficulty
          </label>
          <select
            {...register("difficulty")}
            className="w-full rounded-lg bg-[#020617] border border-slate-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tag
          </label>
          <select
            {...register("tags")}
            className="w-full rounded-lg bg-[#020617] border border-slate-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Problem Description
      </label>
      <textarea
        {...register("description")}
        placeholder="Describe the problem clearly, including constraints and examples..."
        rows={9}
        className="w-full rounded-lg bg-[#020617] border border-slate-700 px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {errors.description && (
        <p className="text-red-500 text-xs mt-1">
          {errors.description.message}
        </p>
      )}
    </div>

  </div>
</div>


        {/* Test Cases */}
        <div className="card bg-base-100 shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Test Cases</h2>

          {/* Visible Test Cases */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Visible Test Cases</h3>
              <button
                type="button"
                onClick={() => appendVisible({ input: "", output: "", explanation: "" })}
                className="btn btn-primary btn-sm"
              >
                + Add Case
              </button>
            </div>

            <div className="space-y-4">
              {visibleFields.map((field, index) => (
                <div key={field.id} className="border rounded-xl p-4 bg-base-200">
                  <div className="flex justify-between mb-3">
                    <span className="badge badge-outline">Case {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeVisible(index)}
                      className="btn btn-xs btn-error"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    {...register(`visibleTestCases.${index}.input`)}
                    placeholder="Input"
                    className="input input-bordered w-full mb-2"
                  />
                  <input
                    {...register(`visibleTestCases.${index}.output`)}
                    placeholder="Output"
                    className="input input-bordered w-full mb-2"
                  />
                  <textarea
                    {...register(`visibleTestCases.${index}.explanation`)}
                    placeholder="Explanation"
                    className="textarea textarea-bordered w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Test Cases */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: "", output: "" })}
                className="btn btn-primary btn-sm"
              >
                + Add Case
              </button>
            </div>

            <div className="space-y-4">
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="border rounded-xl p-4 bg-base-200">
                  <div className="flex justify-between mb-3">
                    <span className="badge badge-outline">Hidden {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="btn btn-xs btn-error"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    {...register(`hiddenTestCases.${index}.input`)}
                    placeholder="Input"
                    className="input input-bordered w-full mb-2"
                  />
                  <input
                    {...register(`hiddenTestCases.${index}.output`)}
                    placeholder="Output"
                    className="input input-bordered w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Templates */}
        <div className="card bg-base-100 shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Code Templates</h2>

          <div className="space-y-8">
            {["C++", "Java", "JavaScript"].map((lang, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium mb-3">{lang}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label font-medium">Initial Code</label>
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      rows={8}
                      className="textarea textarea-bordered font-mono bg-base-200"
                    />
                  </div>

                  <div>
                    <label className="label font-medium">Reference Solution</label>
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      rows={8}
                      className="textarea textarea-bordered font-mono bg-base-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary btn-lg px-10">
            Create Problem
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export default AdminPanel;