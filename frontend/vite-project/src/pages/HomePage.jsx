import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]); // Clear solved problems on logout
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
  <div className="min-h-screen bg-base-200">
    
    {/* Navbar */}
    <nav className="navbar bg-base-100 border-b px-6">
      <div className="flex-1">
        <NavLink to="/" className="text-2xl font-bold tracking-wide">
          LeetCode
        </NavLink>
      </div>

      <div className="dropdown dropdown-end">
        <div tabIndex={0} className="btn btn-sm btn-ghost font-medium">
          {user?.firstName}
        </div>
        <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
    </nav>

    {/* Content */}
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* Filters Card */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body flex flex-wrap gap-4 md:flex-row md:items-center">

          <select
            className="select select-sm select-bordered"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All</option>
            <option value="solved">Solved</option>
          </select>

          <select
            className="select select-sm select-bordered"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-sm select-bordered"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">Tag</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>

        </div>
      </div>

      {/* Problems Table */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-0">

          {/* Header */}
          <div className="grid grid-cols-12 px-6 py-3 text-sm font-semibold border-b">
            <div className="col-span-6">Problem</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-2">Tag</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          {/* Rows */}
          {filteredProblems.map(problem => {
            const isSolved = solvedProblems.some(sp => sp._id === problem._id);

            return (
              <div
                key={problem._id}
                className="grid grid-cols-12 px-6 py-4 border-b hover:bg-base-200 transition"
              >
                <div className="col-span-6 font-medium">
                  <NavLink
                    to={`/problem/${problem._id}`}
                    className="hover:text-primary"
                  >
                    {problem.title}
                  </NavLink>
                </div>

                <div className="col-span-2">
                  <span className={`badge badge-sm ${getDifficultyBadgeColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="badge badge-outline badge-sm">
                    {problem.tags}
                  </span>
                </div>

                <div className="col-span-2 text-right">
                  {isSolved && (
                    <span className="badge badge-success badge-sm">
                      ✓ Solved
                    </span>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  </div>
);

}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Homepage;