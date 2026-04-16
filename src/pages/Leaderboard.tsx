//FOR NED

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ExternalLink, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RankBadge } from '@/components/leaderboard/RankBadge';
import { DifficultyBadge } from '@/components/common/DifficultyBadge';
import { Avatar } from '@/components/common/Avatar';
import { PageLoader } from '@/components/common/Loader';
import { leaderboardApi } from '@/api/leaderboard.api.js';
import { settingsApi } from '@/api/settings.api.js';
import { BATCHES, ROUTES } from '@/lib/constants';
import type { LeaderboardEntry } from '@/types';

import { useAuth } from '@/context/AuthContext';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [columns, setColumns] = useState({
    rollno: true, programme: true, batch: true, leetcodeRank: true,
    total: true, hard: true, medium: true,
  });
  const { user } = useAuth();
  const itemsPerPage = 20;

  useEffect(() => {
    settingsApi.getLeaderboardColumns()
      .then((cols) => { if (cols) setColumns(cols); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const filters: Record<string, string> = {};
        if (batchFilter && batchFilter !== 'all') filters.batch = batchFilter;
        filters.limit = '500';
        const data = await leaderboardApi.getLeaderboard(filters);
        setLeaderboardData(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [batchFilter]);

  const filteredData = useMemo(() => {
    let data = [...leaderboardData];

    // Apply search filter (client-side)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (entry) =>
          entry.name.toLowerCase().includes(query) ||
          entry.leetcodeUsername.toLowerCase().includes(query)
      );
    }

    // Reverse order if toggled
    if (isReversed) {
      data.reverse();
    }

    // Recalculate ranks
    return data.map((entry, index) => ({ ...entry, rank: index + 1 }));
  }, [leaderboardData, searchQuery, isReversed]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const clearFilters = () => {
    setSearchQuery('');
    setBatchFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || batchFilter !== 'all';

  if (isLoading) {
    return <PageLoader message="Loading leaderboard..." />;
  }

  return (
    <div className="w-full px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Leaderboard</h1>
        <p className="mt-2 text-muted-foreground">
          See where you stand among {filteredData.length} students
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Filter toggle for mobile */}
          <Button
            variant="outline"
            className="sm:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {[searchQuery, batchFilter !== 'all'].filter(Boolean).length}
              </span>
            )}
          </Button>

          {/* Desktop filters */}
          <div className="hidden sm:flex gap-3">
            <Select value={batchFilter} onValueChange={(v) => { setBatchFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {BATCHES.map((batch) => (
                  <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Mobile filters dropdown */}
        {showFilters && (
          <div className="sm:hidden grid grid-cols-2 gap-3 p-4 border rounded-lg bg-card animate-slide-down">
            <Select value={batchFilter} onValueChange={(v) => { setBatchFilter(v); setCurrentPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {BATCHES.map((batch) => (
                  <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="col-span-2">
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">User</th>
              {columns.rollno && <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Roll No</th>}
              {columns.programme && <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Programme</th>}
              {columns.batch && <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Batch</th>}
              {columns.leetcodeRank && (
                <th
                  className="px-6 py-4 text-center text-sm font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => setIsReversed((prev) => !prev)}
                >
                  <span className="inline-flex items-center gap-1">
                    Leetcode Rank
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </span>
                </th>
              )}
              {columns.total && <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Total</th>}
              {columns.hard && <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Hard</th>}
              {columns.medium && <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Medium</th>}
              <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedData.map((entry) => (
              <tr key={entry.id} className="transition-colors hover:bg-muted/30">
                <td className="px-6 py-4">
                  <RankBadge position={entry.rank} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={entry.name} src={entry.stats.avatar} size="sm" />
                    <div>
                      <div className="font-medium"><a href={`${ROUTES.PROFILE}/${entry.id}`} target="_blank" rel="noopener noreferrer">{entry.name}</a></div>
                      <a
                        href={entry.leetcodeProfileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                      >
                        @{entry.leetcodeUsername}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </td>
                {columns.rollno && (
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{entry.rollno || '-'}</div>
                  </td>
                )}
                {columns.programme && (
                  <td className="px-6 py-4">
                    <div className="text-sm">{entry.programme || '-'}</div>
                  </td>
                )}
                {columns.batch && (
                  <td className="px-6 py-4">
                    <div className="text-sm">{entry.batch}</div>
                  </td>
                )}
                
                {columns.leetcodeRank && (
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm">#{entry.stats.ranking}</div>
                  </td>
                )}
                {columns.total && <td className="px-6 py-4 text-center font-semibold">{entry.stats.totalSolved}</td>}
                {/* <td className="px-6 py-4 text-center">
                  <DifficultyBadge difficulty="hard" count={entry.stats.easySolved} showLabel={false} />
                </td> */}
                    {columns.hard && (
                      <td className="px-6 py-4 text-center">
                        <DifficultyBadge difficulty="hard" count={entry.stats.hardSolved} showLabel={false} />
                      </td>
                    )}
                {columns.medium && (
                  <td className="px-6 py-4 text-center">
                    <DifficultyBadge difficulty="medium" count={entry.stats.mediumSolved} showLabel={false} />
                  </td>
                )}
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`${ROUTES.PROFILE}/${entry.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {paginatedData.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border bg-card p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar name={entry.name} src={entry.stats.avatar} size="lg" />
                <div>
                  <div className="font-semibold">{entry.name}</div>
                  <a
                    href={entry.leetcodeProfileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                  >
                    @{entry.leetcodeUsername}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <RankBadge position={entry.rank} size="lg" />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              {columns.rollno && entry.rollno && <><span>{entry.rollno}</span><span>•</span></>}
              {columns.programme && entry.programme && <><span>{entry.programme}</span><span>•</span></>}
              {columns.batch && <span>{entry.batch}</span>}
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex gap-2">
                <DifficultyBadge difficulty="easy" count={entry.stats.easySolved} showLabel={false} />
                <DifficultyBadge difficulty="medium" count={entry.stats.mediumSolved} showLabel={false} />
                <DifficultyBadge difficulty="hard" count={entry.stats.hardSolved} showLabel={false} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{entry.stats.totalSolved}</div>
                <div className="text-xs text-muted-foreground">problems</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No results found</p>
          <Button variant="link" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}








//MY OWN

// import { useState, useEffect, useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import { Search, Filter, ExternalLink, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { RankBadge } from '@/components/leaderboard/RankBadge';
// import { DifficultyBadge } from '@/components/common/DifficultyBadge';
// import { Avatar } from '@/components/common/Avatar';
// import { PageLoader } from '@/components/common/Loader';
// import { leaderboardApi } from '@/api/leaderboard.api.js';
// import { settingsApi } from '@/api/settings.api.js';
// import { BATCHES, ROUTES } from '@/lib/constants';
// import type { LeaderboardEntry } from '@/types';

// export default function Leaderboard() {
//   const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [batchFilter, setBatchFilter] = useState<string>('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showFilters, setShowFilters] = useState(false);
//   const [isReversed, setIsReversed] = useState(false);
//   const [columns, setColumns] = useState({
//     rollno: true, programme: true, batch: true, leetcodeRank: true,
//     total: true, hard: true, medium: true,
//   });
//   const itemsPerPage = 20;

//   useEffect(() => {
//     settingsApi.getLeaderboardColumns()
//       .then((cols) => { if (cols) setColumns(cols); })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       setIsLoading(true);
//       try {
//         const filters: Record<string, string> = {};
//         if (batchFilter && batchFilter !== 'all') filters.batch = batchFilter;
//         const data = await leaderboardApi.getLeaderboard(filters);
//         setLeaderboardData(data);
//       } catch (error) {
//         console.error('Failed to fetch leaderboard:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchLeaderboard();
//   }, [batchFilter]);

//   const filteredData = useMemo(() => {
//     let data = [...leaderboardData];

//     // Apply search filter (client-side)
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       data = data.filter(
//         (entry) =>
//           entry.name.toLowerCase().includes(query) ||
//           entry.leetcodeUsername.toLowerCase().includes(query)
//       );
//     }

//     // Reverse order if toggled
//     if (isReversed) {
//       data.reverse();
//     }

//     // Recalculate ranks
//     return data.map((entry, index) => ({ ...entry, rank: index + 1 }));
//   }, [leaderboardData, searchQuery, isReversed]);

//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredData.slice(start, start + itemsPerPage);
//   }, [filteredData, currentPage]);

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const clearFilters = () => {
//     setSearchQuery('');
//     setBatchFilter('all');
//     setCurrentPage(1);
//   };

//   const hasActiveFilters = searchQuery || batchFilter !== 'all';

//   if (isLoading) {
//     return <PageLoader message="Loading leaderboard..." />;
//   }

//   return (
//     <div className="container py-8 animate-fade-in">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Leaderboard</h1>
//         <p className="mt-2 text-muted-foreground">
//           See where you stand among {filteredData.length} students
//         </p>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 space-y-4">
//         <div className="flex flex-col sm:flex-row gap-4">
//           {/* Search */}
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search by name or username..."
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="pl-10"
//             />
//           </div>

//           {/* Filter toggle for mobile */}
//           <Button
//             variant="outline"
//             className="sm:hidden"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             <Filter className="h-4 w-4 mr-2" />
//             Filters
//             {hasActiveFilters && (
//               <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
//                 {[searchQuery, batchFilter !== 'all'].filter(Boolean).length}
//               </span>
//             )}
//           </Button>

//           {/* Desktop filters */}
//           <div className="hidden sm:flex gap-3">
//             <Select value={batchFilter} onValueChange={(v) => { setBatchFilter(v); setCurrentPage(1); }}>
//               <SelectTrigger className="w-[140px]">
//                 <SelectValue placeholder="Batch" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Batches</SelectItem>
//                 {BATCHES.map((batch) => (
//                   <SelectItem key={batch} value={batch}>{batch}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {hasActiveFilters && (
//               <Button variant="ghost" onClick={clearFilters}>
//                 Clear filters
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Mobile filters dropdown */}
//         {showFilters && (
//           <div className="sm:hidden grid grid-cols-2 gap-3 p-4 border rounded-lg bg-card animate-slide-down">
//             <Select value={batchFilter} onValueChange={(v) => { setBatchFilter(v); setCurrentPage(1); }}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Batch" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Batches</SelectItem>
//                 {BATCHES.map((batch) => (
//                   <SelectItem key={batch} value={batch}>{batch}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {hasActiveFilters && (
//               <Button variant="outline" onClick={clearFilters} className="col-span-2">
//                 Clear all filters
//               </Button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden md:block rounded-xl border bg-card overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-muted/50">
//             <tr>
//               <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Rank</th>
//               <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">User</th>
//               {columns.rollno && <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Roll No</th>}
//               {columns.programme && <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Programme</th>}
//               {columns.batch && <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Batch</th>}
//               {columns.leetcodeRank && (
//                 <th
//                   className="px-6 py-4 text-center text-sm font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
//                   onClick={() => setIsReversed((prev) => !prev)}
//                 >
//                   <span className="inline-flex items-center gap-1">
//                     Leetcode Rank
//                     <ArrowUpDown className="h-3.5 w-3.5" />
//                   </span>
//                 </th>
//               )}
//               {columns.total && <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Total</th>}
//               {columns.hard && <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Hard</th>}
//               {columns.medium && <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Medium</th>}
//               <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y">
//             {paginatedData.map((entry) => (
//               <tr key={entry.id} className="transition-colors hover:bg-muted/30">
//                 <td className="px-6 py-4">
//                   <RankBadge position={entry.rank} />
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-3">
//                     <Avatar name={entry.name} src={entry.stats.avatar} size="sm" />
//                     <div>
//                       <div className="font-medium"><a href={`${ROUTES.PROFILE}/${entry.id}`} target="_blank" rel="noopener noreferrer">{entry.name}</a></div>
//                       <a
//                         href={entry.leetcodeProfileURL}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
//                       >
//                         @{entry.leetcodeUsername}
//                         <ExternalLink className="h-3 w-3" />
//                       </a>
//                     </div>
//                   </div>
//                 </td>
//                 {columns.rollno && (
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-medium">{entry.rollno || '-'}</div>
//                   </td>
//                 )}
//                 {columns.programme && (
//                   <td className="px-6 py-4">
//                     <div className="text-sm">{entry.programme || '-'}</div>
//                   </td>
//                 )}
//                 {columns.batch && (
//                   <td className="px-6 py-4">
//                     <div className="text-sm">{entry.batch}</div>
//                   </td>
//                 )}
                
//                 {columns.leetcodeRank && (
//                   <td className="px-6 py-4 text-center">
//                     <div className="text-sm">#{entry.stats.ranking}</div>
//                   </td>
//                 )}
//                 {columns.total && <td className="px-6 py-4 text-center font-semibold">{entry.stats.totalSolved}</td>}
//                 {/* <td className="px-6 py-4 text-center">
//                   <DifficultyBadge difficulty="hard" count={entry.stats.easySolved} showLabel={false} />
//                 </td> */}
//                 {columns.medium && (
//                   <td className="px-6 py-4 text-center">
//                     <DifficultyBadge difficulty="medium" count={entry.stats.mediumSolved} showLabel={false} />
//                   </td>
//                 )}
//                 {columns.hard && (
//                   <td className="px-6 py-4 text-center">
//                     <DifficultyBadge difficulty="hard" count={entry.stats.hardSolved} showLabel={false} />
//                   </td>
//                 )}
//                 <td className="px-6 py-4 text-right">
//                   <Button variant="ghost" size="sm" asChild>
//                     <Link to={`${ROUTES.PROFILE}/${entry.id}`}>View</Link>
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Cards */}
//       <div className="md:hidden space-y-4">
//         {paginatedData.map((entry) => (
//           <div
//             key={entry.id}
//             className="rounded-xl border bg-card p-4 transition-all hover:shadow-md"
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <Avatar name={entry.name} src={entry.stats.avatar} size="lg" />
//                 <div>
//                   <div className="font-semibold">{entry.name}</div>
//                   <a
//                     href={entry.leetcodeProfileURL}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
//                   >
//                     @{entry.leetcodeUsername}
//                     <ExternalLink className="h-3 w-3" />
//                   </a>
//                 </div>
//               </div>
//               <RankBadge position={entry.rank} size="lg" />
//             </div>

//             <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
//               {columns.rollno && entry.rollno && <><span>{entry.rollno}</span><span>•</span></>}
//               {columns.programme && entry.programme && <><span>{entry.programme}</span><span>•</span></>}
//               {columns.batch && <span>{entry.batch}</span>}
//             </div>

//             <div className="flex items-center justify-between border-t pt-4">
//               <div className="flex gap-2">
//                 <DifficultyBadge difficulty="easy" count={entry.stats.easySolved} showLabel={false} />
//                 <DifficultyBadge difficulty="medium" count={entry.stats.mediumSolved} showLabel={false} />
//                 <DifficultyBadge difficulty="hard" count={entry.stats.hardSolved} showLabel={false} />
//               </div>
//               <div className="text-right">
//                 <div className="text-2xl font-bold">{entry.stats.totalSolved}</div>
//                 <div className="text-xs text-muted-foreground">problems</div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="mt-8 flex items-center justify-center gap-2">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <div className="flex items-center gap-1">
//             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//               let page: number;
//               if (totalPages <= 5) {
//                 page = i + 1;
//               } else if (currentPage <= 3) {
//                 page = i + 1;
//               } else if (currentPage >= totalPages - 2) {
//                 page = totalPages - 4 + i;
//               } else {
//                 page = currentPage - 2 + i;
//               }
//               return (
//                 <Button
//                   key={page}
//                   variant={currentPage === page ? 'default' : 'outline'}
//                   size="icon"
//                   onClick={() => setCurrentPage(page)}
//                 >
//                   {page}
//                 </Button>
//               );
//             })}
//           </div>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//           >
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       )}

//       {/* Empty state */}
//       {filteredData.length === 0 && (
//         <div className="text-center py-16">
//           <p className="text-muted-foreground">No results found</p>
//           <Button variant="link" onClick={clearFilters}>
//             Clear filters
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
