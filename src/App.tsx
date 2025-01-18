import React, { useState, useEffect } from 'react';
import {
  ArrowUpDown,
  RefreshCw,
  Trophy,
  Medal,
  Star,
  Calendar,
  Target,
  Award,
  Briefcase,
  CheckCircle,
  AlertCircle,
} from 'lucide-react/dist/esm/icons';

interface LeaderboardEntry {
  EmployeeName: string;
  Product: string;
  ProductivityPMTG: number;
  BoosterTGMonth: number;
  TargetAchieve: number;
  AchievePercentage: number;
}

function App() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LeaderboardEntry;
    direction: 'asc' | 'desc';
  }>({ key: 'EmployeeName', direction: 'asc' });
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

  useEffect(() => {
    const targetDate = new Date('2025-03-31T23:59:59');

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vRpwirjrkxZ2jIGN0hJeNHyxvZGlcwOYgkt-u0l0oWfounZltZ-Tyu8VUqynynzyeY3hIHtABBPLtEE/pub?gid=0&single=true&output=csv'
      );
      const text = await response.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');

      const parsedData = rows.slice(1).map((row) => {
        const values = row.split(',');
        return {
          EmployeeName: values[0],
          Product: values[1],
          ProductivityPMTG: parseFloat(values[2]),
          BoosterTGMonth: parseFloat(values[3]),
          TargetAchieve: parseFloat(values[4]),
          AchievePercentage: parseFloat(values[5]),
        };
      });

      setData(parsedData);
    } catch (err) {
      setError('Failed to fetch leaderboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (key: keyof LeaderboardEntry) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const filteredData =
    selectedProduct === 'all'
      ? sortedData
      : sortedData.filter((entry) => entry.Product === selectedProduct);

  const products = ['all', ...new Set(data.map((entry) => entry.Product))];

  const topPerformers = [...data]
    .sort((a, b) => b.AchievePercentage - a.AchievePercentage)
    .slice(0, 3);

  const columns: { key: keyof LeaderboardEntry; label: string }[] = [
    { key: 'EmployeeName', label: 'Employee Name' },
    { key: 'Product', label: 'Product' },
    { key: 'ProductivityPMTG', label: 'Productivity PM TG' },
    { key: 'BoosterTGMonth', label: 'Booster TG/Month' },
    { key: 'TargetAchieve', label: 'Target Achieve' },
    { key: 'AchievePercentage', label: 'Achieve %' },
  ];

  const getTopPerformerIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Star className="w-6 h-6 text-amber-700" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      {/* Animated Banner */}
      <div
        className="relative overflow-hidden mb-8 rounded-2xl shadow-lg"
        style={{
          background:
            'linear-gradient(-45deg, #FF6B6B, #4ECDC4, #45B7D1, #96C93D, #FED766)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
        }}
      >
        <div className="relative z-10 px-8 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-wider">
            Kamyabi Ke Rang
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-white">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
              <div className="text-3xl font-bold">{countdown.days}</div>
              <div className="text-sm">Days</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
              <div className="text-3xl font-bold">{countdown.hours}</div>
              <div className="text-sm">Hours</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
              <div className="text-3xl font-bold">{countdown.minutes}</div>
              <div className="text-sm">Minutes</div>
            </div>
          </div>
          <div className="mt-4 text-white/90 flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>Until March 31, 2025</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h1 className="text-2xl font-bold text-gray-800">
                Performance Leaderboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {products.map((product) => (
                  <option key={product} value={product}>
                    {product === 'all' ? 'All Products' : product}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Top Performers Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Top Performers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topPerformers.map((performer, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-lg p-6 transform hover:scale-105 transition-all duration-300 ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 hover:shadow-yellow-200/50'
                      : index === 1
                      ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:shadow-gray-200/50'
                      : 'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 hover:shadow-amber-200/50'
                  } hover:shadow-xl`}
                >
                  <div className="absolute top-0 right-0 mt-2 mr-2">
                    {getTopPerformerIcon(index)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-800 mb-1">
                      {performer.EmployeeName}
                    </span>
                    <span className="text-sm text-gray-600 mb-2">
                      {performer.Product}
                    </span>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          performer.AchievePercentage >= 100
                            ? 'bg-green-100 text-green-800'
                            : performer.AchievePercentage >= 80
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {performer.AchievePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {columns.map(({ key, label }) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort(key)}
                      >
                        <div className="flex items-center gap-2">
                          {label}
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((entry, index) => (
                    <tr
                      key={index}
                      className={`
                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        hover:bg-blue-50 transition-colors
                      `}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {entry.EmployeeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {entry.Product}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {entry.ProductivityPMTG.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {entry.BoosterTGMonth.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {entry.TargetAchieve.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            entry.AchievePercentage >= 100
                              ? 'bg-green-100 text-green-800'
                              : entry.AchievePercentage >= 80
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {entry.AchievePercentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Contest Parameters Section */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <Target className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              Contest Parameters
            </h2>
          </div>

          {/* Participating Verticals */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              Participating Verticals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Branch Channel', 'Equipment Finance', 'Home Loan'].map(
                (vertical) => (
                  <div
                    key={vertical}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <h4 className="text-lg font-semibold">{vertical}</h4>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Rewards Table */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" />
              Rewards Structure
            </h3>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-blue-500 text-white text-sm font-medium">
                BRANCH CHANNEL (RM/BM) | HOME LOAN (RM/BM) | EQUIPMENT FINANCE
                (RM)
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      FROM
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      TO
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      REWARDS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { from: '0%', to: '110%', reward: 'Not Eligible' },
                    {
                      from: '111%',
                      to: '125%',
                      reward: '1.5 Ton AC - 3 Star',
                    },
                    {
                      from: '126%',
                      to: '150%',
                      reward: '400 L Refrigerator',
                    },
                    { from: '151%', to: '175%', reward: 'Smart TV' },
                    {
                      from: '176%',
                      to: '200%',
                      reward: 'TVS Jupiter 110 CC (Ex Showroom)',
                    },
                    {
                      from: '200%',
                      to: '=+',
                      reward: 'Foreign Trip – Baku, Azerbaijan',
                    },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className={`
                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        hover:bg-blue-50 transition-colors
                      `}
                    >
                      <td className="px-6 py-4 text-gray-600">{row.from}</td>
                      <td className="px-6 py-4 text-gray-600">{row.to}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {row.reward}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CBM Rewards */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-500" />
              CBM Rewards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Royal Enfield Bike
                </h4>
                <p className="text-gray-600 mb-2">
                  Up to ₹2.5 Lakhs (Ex Showroom)
                </p>
                <div className="mt-4 text-sm font-medium text-blue-600">
                  Target Achievement ≥ 500%
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Foreign Trip to Baku, Azerbaijan
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Branch Channel: Target Achievement ≥ 110%
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Equipment Finance: Target Achievement ≥ 125%
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Four Wheeler
                </h4>
                <p className="text-gray-600 mb-2">
                  Up to ₹8 Lakhs (Ex Showroom)
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Branch Channel: Target Achievement ≥ 150%
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Equipment Finance: Achievement ≥ 200%
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Credit Team Section */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              For Credit Team
            </h3>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">
                    If Branch qualifies for foreign trip – corresponding CM/ACM
                    to qualify for foreign trip.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">
                    If business cluster qualifies for foreign trip then
                    corresponding Cluster credit also qualifies for foreign
                    trip.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Eligibility & Terms */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              Eligibility & Terms
            </h3>
            {[
              {
                title: 'For RM/SM/Executive/SO',
                terms: [
                  'Minimum Individual Target achievement should be more than 110%',
                  'Resigned Employee would not get the contest rewards',
                  'The rewards in the said contest are over and above the regular incentive',
                  'The rewards cannot be encashed or transferred',
                  'New Joinee would be considered only if they have achieved the defined contest target',
                  'Pro-rata calculation is not applicable in the contest',
                  'Team mapping in the HRMS at the end of contest would be considered as Final for calculation',
                  'Any Govt Tax Liability is to be borne by individual',
                  'In case of any doubts, disputes, errors the decision of top management of RCPL will be final',
                ],
              },
              {
                title: 'For BM/Leader',
                terms: [
                  'Minimum Branch / Location Target achievement should be more than 110%',
                  'Minimum 50% disbursement target of 2 individual RM should be achieved by BMs (Applicable for BMs having 3 or more RMs).',
                  'Disbursement amount per case / each group would be up to maximum of Product Capping',
                  'Resigned BM would not get the contest rewards',
                  'The rewards in the said contest are over and above the regular incentive',
                  'The rewards cannot be encashed or transferred',
                  'New Joinee would be considered only if they have achieved the defined contest target',
                  'Pro-rata calculation is not applicable in the contest',
                  'Team mapping in the HRMS at the end of contest would be considered as Final for calculation',
                  'Any Govt Tax Liability is to be borne by individual',
                  'In case of any doubts, disputes, errors the decision of top management of RCPL will be final',
                ],
              },
              {
                title: 'For CBM',
                terms: [
                  'Minimum Cluster Target achievement should be as per contest target slab.',
                  'Disbursement amount per case / each group would be up to maximum of Product Capping',
                  'Resigned CBM would not get the contest rewards',
                  'The rewards in the said contest are over and above the regular incentive',
                  'The rewards cannot be encashed or transferred',
                  'New Joinee would be considered only if they have achieved the defined contest target',
                  'Pro-rata calculation are not applicable in the contest',
                  'Team mapping in the HRMS at the end of contest would be considered as Final for calculation',
                  'Any Govt Tax Liability is to be borne by individual',
                  'In case of any doubts, disputes, errors the decision of top management of RCPL will be final',
                ],
              },
            ].map((section) => (
              <div key={section.title} className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  {section.title}
                </h4>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <ul className="space-y-4">
                    {section.terms.map((term, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
