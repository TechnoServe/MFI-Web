import React, {useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {request} from 'common';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Tooltip,
  Spinner,
  Alert,
  AlertIcon,
  HStack,
  Badge,
  Select,
  Input,
  NumberInput,
  NumberInputField,
  Spacer,
  Button,
  Switch,
  FormControl,
  FormLabel,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';

import {DownloadIcon} from '@chakra-ui/icons';

/**
 * Column keys expected from the API (as implemented in store.getAll4PGRanking)
 */
const COLS = {
  company: 'Company Name',
  tier: 'TIER',
  ivcOverall: 'Validated Scores (%)',
  ivc: {
    personnel: 'IVC Personnel (%)',
    production: 'IVC Production (%)',
    procurement: 'IVC Procurement and Suppliers (%)',
    publicEng: 'IVC Public Engagement (%)',
    governance: 'IVC Governance (%)',
  },
  iegOverall: 'Industry Expert Group (%)',
  ieg: {
    personnel: 'IEG Personnel (%)',
    production: 'IEG Production (%)',
    procurement: 'IEG Procurement and Suppliers (%)',
    publicEng: 'IEG Public Engagement',
    governance: 'IEG Governance',
  },
  avg: {
    personnel: 'Average Personnel (%)',
    production: 'Average Production (%)',
    procurement: 'Average Procurement and Suppliers (%)',
    publicEng: 'Average Public Engagement (%)',
    governance: 'Average Governance (%)',
    total: 'Average 4PG',
  },
};


const MAX_BY_COMP = {
  'Personnel': 23,
  'Production': 20,
  'Procurement and Suppliers': 15,
  'Public Engagement': 17,
  'Governance': 25,
};

const fmt = (v) => (Number.isFinite(v) ? v.toFixed(1) : '-');

// Unweighted tiering: expects a percentage (0–100)
const perfTierUnweighted = (pct) => {
  const n = typeof pct === 'number' ? pct : Number(pct);
  if (!Number.isFinite(n)) return {label: '-', scheme: 'gray'};
  if (n >= 90) return {label: 'Elite', scheme: 'green'};
  if (n >= 80) return {label: 'Strong', scheme: 'green'};
  if (n >= 70) return {label: 'Solid', scheme: 'blue'};
  if (n >= 60) return {label: 'Fair', scheme: 'yellow'};
  return {label: 'Needs Work', scheme: 'red'};
};


const ENDPOINT = process.env.REACT_APP_4PG_ENDPOINT || '/admin/4pg-ranking';

/**
 * FourPGRanking Component
 * Renders a tabbed layout for 4PG rankings and related views (live data).
 */
const FourPGRanking = ({cycle}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const colorFor = (value) => {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n)) return undefined;
    if (n >= 80) return 'green.50';
    if (n >= 70) return 'yellow.50';
    return 'red.50';
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const url = `${ENDPOINT}?cycle-id=${cycle?.id}`;
        const response = await request(true).get(url);
        console.log('4PG Ranking Data:', response.data);
        if (!Array.isArray(response.data)) {
          throw new Error('Unexpected response shape');
        }
        setData(response.data);
      } catch (e) {
        setError(e.message || 'Failed to load 4PG data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    if (cycle?.id) {
      fetchData();
    }
  }, [cycle]);

  // Filters
  const [componentFilter, setComponentFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All'); // All | T1 | T3
  const [awardType, setAwardType] = useState('All');
  const [minAvg4pg, setMinAvg4pg] = useState('');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('component');
  const [sortDir, setSortDir] = useState('desc');
  const [ignoreZeroIVC, setIgnoreZeroIVC] = useState(false);
  // Toggle sorting for Top Performers tables
  const toggleSort = (key) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        // same key -> flip direction
        setSortDir((prevDir) => (prevDir === 'desc' ? 'asc' : 'desc'));
        return prevKey;
      }
      // new key -> default to desc
      setSortDir('desc');
      return key;
    });
  };
  const [showTop10, setShowTop10] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  // 4PG Table sorting state
  const [sortConfig, setSortConfig] = useState({key: null, direction: 'asc'});

  // --- CSV Export ---
  const csvEscape = (val) => {
    if (val == null) return '';
    const s = String(val);
    // If contains comma, quote, or newline, wrap in quotes and escape quotes
    if (/[",\n]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const buildCsv = (rows) => {
    const headers = [
      COLS.company,
      'T',
      COLS.ivcOverall,
      COLS.ivc.personnel,
      COLS.ivc.production,
      COLS.ivc.procurement,
      COLS.ivc.publicEng,
      COLS.ivc.governance,
      COLS.iegOverall,
      COLS.ieg.personnel,
      COLS.ieg.production,
      COLS.ieg.procurement,
      COLS.ieg.publicEng,
      COLS.ieg.governance,
      COLS.avg.personnel,
      COLS.avg.production,
      COLS.avg.procurement,
      COLS.avg.publicEng,
      COLS.avg.governance,
      COLS.avg.total,
    ];

    const lines = [];
    lines.push(headers.map(csvEscape).join(','));

    (rows || []).forEach((row) => {
      const t = row[COLS.tier] === 'TIER_3' ? 'T3' : row[COLS.tier] === 'TIER_1' ? 'T1' : (row[COLS.tier] || '');
      const vals = [
        row[COLS.company],
        t,
        row[COLS.ivcOverall],
        row[COLS.ivc.personnel],
        row[COLS.ivc.production],
        row[COLS.ivc.procurement],
        row[COLS.ivc.publicEng],
        row[COLS.ivc.governance],
        row[COLS.iegOverall],
        row[COLS.ieg.personnel],
        row[COLS.ieg.production],
        row[COLS.ieg.procurement],
        row[COLS.ieg.publicEng],
        row[COLS.ieg.governance],
        row[COLS.avg.personnel],
        row[COLS.avg.production],
        row[COLS.avg.procurement],
        row[COLS.avg.publicEng],
        row[COLS.avg.governance],
        row[COLS.avg.total],
      ];
      lines.push(vals.map(csvEscape).join(','));
    });

    // Prepend BOM so Excel opens UTF-8 correctly
    return '\uFEFF' + lines.join('\n');
  };

  const handleExport = () => {
    // Prefer the currently sorted view of the 4PG table; fall back to filtered data
    const rows = (sorted4PGData && sorted4PGData.length) ? sorted4PGData : filteredData;
    const csv = buildCsv(rows);
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `4pg_ranking_${cycle?.id ?? 'all'}_${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export Top Performers (per component) as CSV
  const handleExportTopPerformers = () => {
    // Decide which component sections to include
    const compKeys = (componentFilter === 'All'
      ? ['Personnel', 'Production', 'Procurement and Suppliers', 'Public Engagement', 'Governance']
      : [componentFilter]);

    // CSV headers
    const headers = ['Component', 'Company', 'Avg Component (%)', 'Ranked IVC (%)'];
    const lines = [headers.map(csvEscape).join(',')];

    compKeys.forEach((compKey) => {
      const rows = topByComponent[compKey] || [];
      const useRows = showTop10 ? rows.slice(0, 10) : rows;
      useRows.forEach(({company, score, ivcPct}) => {
        const vals = [compKey, company, fmt(score), fmt(ivcPct)];
        lines.push(vals.map(csvEscape).join(','));
      });
    });

    const csv = '\uFEFF' + lines.join('\n');
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `top_performers_${cycle?.id ?? 'all'}_${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const comp = params.get('comp');
    const tier = params.get('tier');
    const award = params.get('award');
    const min = params.get('min');

    if (q !== null) setSearch(q);
    if (comp !== null) setComponentFilter(comp);
    if (tier !== null) setTierFilter(tier);
    if (award !== null) setAwardType(award);
    if (min !== null) setMinAvg4pg(min);
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const setOrDel = (key, val) => {
      if (val === undefined || val === null || val === '' || val === 'All') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    };

    setOrDel('q', search);
    setOrDel('comp', componentFilter);
    setOrDel('tier', tierFilter);
    setOrDel('award', awardType);
    setOrDel('min', minAvg4pg);

    const newQuery = params.toString();
    const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}${window.location.hash || ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [search, componentFilter, tierFilter, awardType, minAvg4pg]);

  const toTierShort = (t) => (t === 'TIER_1' ? 'T1' : t === 'TIER_3' ? 'T3' : t);

  const meetsBalanced = (row) => {
    return [
      row[COLS.avg.personnel],
      row[COLS.avg.production],
      row[COLS.avg.procurement],
      row[COLS.avg.publicEng],
      row[COLS.avg.governance],
    ].every((v) => Number(v) >= 70);
  };

  const meetsComponentMastery = (row) => {
    if (componentFilter === 'All') return false;
    const map = {
      'Personnel': COLS.avg.personnel,
      'Production': COLS.avg.production,
      'Procurement and Suppliers': COLS.avg.procurement,
      'Public Engagement': COLS.avg.publicEng,
      'Governance': COLS.avg.governance,
    };
    const col = map[componentFilter];
    return Number(row[col]) >= 80;
  };

  const meetsRisingStar = (row) => {
    const n = Number(row[COLS.avg.total]);
    return Number.isFinite(n) && n >= 70 && n < 80;
  };

  const meetsOverallExcellence = (row) => Number(row[COLS.avg.total]) >= 80;

  const filteredData = useMemo(() => {
    let filtered = (data || []).filter((row) => {
      // search by company
      if (search && !String(row[COLS.company] || '').toLowerCase().includes(search.toLowerCase())) return false;

      // tier
      if (tierFilter !== 'All') {
        const tShort = toTierShort(row[COLS.tier]);
        if (tShort !== tierFilter) return false;
      }

      // component filter (only show rows that have a value for that component)
      if (componentFilter !== 'All') {
        const compMap = {
          'Personnel': COLS.avg.personnel,
          'Production': COLS.avg.production,
          'Procurement and Suppliers': COLS.avg.procurement,
          'Public Engagement': COLS.avg.publicEng,
          'Governance': COLS.avg.governance,
        };
        const col = compMap[componentFilter];
        const val = Number(row[col]);
        if (!Number.isFinite(val)) return false;
      }

      // min Avg 4PG
      if (minAvg4pg !== '' && Number.isFinite(Number(minAvg4pg))) {
        if (Number(row[COLS.avg.total]) < Number(minAvg4pg)) return false;
      }

      // award type logic
      switch (awardType) {
        case 'Overall Excellence':
          if (!meetsOverallExcellence(row)) return false;
          break;
        case 'Component Mastery':
          if (!meetsComponentMastery(row)) return false;
          break;
        case 'Balanced Performer':
          if (!meetsBalanced(row)) return false;
          break;
        case 'Rising Star':
          if (!meetsRisingStar(row)) return false;
          break;
        default:
          break;
      }

      return true;
    });
    if (ignoreZeroIVC) {
      const ivcCols = [
        COLS.ivc.personnel,
        COLS.ivc.production,
        COLS.ivc.procurement,
        COLS.ivc.publicEng,
        COLS.ivc.governance,
      ];
      filtered = filtered.filter((row) => {
        // Exclude rows where ANY IVC sub-score is explicitly 0 (after coercion).
        // Missing/NaN values are allowed and do not cause exclusion.
        return ivcCols.every((c) => {
          const v = Number(row[c]);
          return !Number.isFinite(v) || v !== 0;
        });
      });
    }
    return filtered;
  }, [data, search, tierFilter, componentFilter, minAvg4pg, awardType, ignoreZeroIVC]);

  // Sorting function for 4PG Table (must be placed after filteredData is defined)
  const sorted4PGData = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);


  const topByComponent = useMemo(() => {
    const source = (filteredData && filteredData.length) ? filteredData : data;
    const comps = [
      {key: 'Personnel', col: COLS.avg.personnel, max: 23},
      {key: 'Production', col: COLS.avg.production, max: 20},
      {key: 'Procurement and Suppliers', col: COLS.avg.procurement, max: 15},
      {key: 'Public Engagement', col: COLS.avg.publicEng, max: 17},
      {key: 'Governance', col: COLS.avg.governance, max: 25},
    ];

    const ivcColMap = {
      'Personnel': COLS.ivc.personnel,
      'Production': COLS.ivc.production,
      'Procurement and Suppliers': COLS.ivc.procurement,
      'Public Engagement': COLS.ivc.publicEng,
      'Governance': COLS.ivc.governance,
    };

    const toNum = (v) => (typeof v === 'number' ? v : Number(v) || 0);

    const out = {};
    comps.forEach(({key, col, max}) => {
      const rows = (source || [])
        .map((row) => {
          // Component average (percentage from API)
          const compPct = toNum(row[col]);
          const compScore = compPct;

          // IVC category score for this component (percentage from API)
          const ivcCol = ivcColMap[key];
          const ivcPct = toNum(row[ivcCol]);
          const ivcScore = ivcPct;

          return {
            company: row[COLS.company],
            score: compScore, // component metric (unweighted: %)
            ivcScore, // IVC metric (unweighted: %)
            ivcPct, // raw IVC % for badges
            max, // per-component maximum points
            row,
          };
        })
        .filter((x) => Number.isFinite(x.score) && Number.isFinite(x.ivcScore))
        .sort((a, b) => {
          const valA = sortKey === 'ivc' ? a.ivcScore : a.score;
          const valB = sortKey === 'ivc' ? b.ivcScore : b.score;
          return sortDir === 'desc' ? valB - valA : valA - valB;
        });
      out[key] = rows;
    });

    return out;
  }, [filteredData, data, sortKey, sortDir]);

  // --- Key Stats (computed from filtered data; fallback to all data) ---
  const keyStats = useMemo(() => {
    const src = (filteredData && filteredData.length) ? filteredData : data;
    const toNum = (v) => (typeof v === 'number' ? v : Number(v));
    const nums = (arr) => arr.map(toNum).filter((n) => Number.isFinite(n));

    const n = src.length;

    // Overall 4PG stats
    const avg4pgList = nums(src.map((r) => r[COLS.avg.total]));
    const mean = avg4pgList.length ? avg4pgList.reduce((a, b) => a + b, 0) / avg4pgList.length : 0;
    const sorted = [...avg4pgList].sort((a, b) => a - b);
    const median = sorted.length
      ? (sorted.length % 2
          ? sorted[(sorted.length - 1) / 2]
          : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2)
      : 0;
    const ge80 = avg4pgList.filter((v) => v >= 80).length;
    const ge80Pct = n ? (ge80 / n) * 100 : 0;

    // Best 4PG (company + value)
    const best4pg = src.reduce((acc, r) => {
      const v = toNum(r[COLS.avg.total]);
      if (!Number.isFinite(v)) return acc;
      if (!acc || v > acc.value) return {company: r[COLS.company], value: v};
      return acc;
    }, null);

    // Tier counts
    const t1 = src.filter((r) => r[COLS.tier] === 'TIER_1').length;
    const t3 = src.filter((r) => r[COLS.tier] === 'TIER_3').length;

    // Panel means (Average … % columns)
    const meanOf = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
    const compMeans = {
      personnel: meanOf(nums(src.map((r) => r[COLS.avg.personnel]))),
      production: meanOf(nums(src.map((r) => r[COLS.avg.production]))),
      procurement: meanOf(nums(src.map((r) => r[COLS.avg.procurement]))),
      publicEng: meanOf(nums(src.map((r) => r[COLS.avg.publicEng]))),
      governance: meanOf(nums(src.map((r) => r[COLS.avg.governance]))),
    };

    // IVC/IEG overall means
    const ivcMean = meanOf(nums(src.map((r) => r[COLS.ivcOverall])));
    const iegMean = meanOf(nums(src.map((r) => r[COLS.iegOverall])));

    return {
      n,
      mean4pg: mean,
      median4pg: median,
      ge80,
      ge80Pct,
      best4pg,
      t1,
      t3,
      compMeans,
      ivcMean,
      iegMean,
    };
  }, [filteredData, data]);

  return (
    <Box p={4}>
      <HStack mb={3} spacing={2}>
        <Heading size="md">4PG Ranking</Heading>
        {loading && <Spinner size="sm" />}
      </HStack>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon /> {error}
        </Alert>
      )}

      {/* Key Stats */}
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={3} mb={4}>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>Total Companies</StatLabel>
          <StatNumber>{keyStats.n}</StatNumber>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>Average 4PG</StatLabel>
          <StatNumber>{fmt(keyStats.mean4pg)}%</StatNumber>
          <StatHelpText>Median: {fmt(keyStats.median4pg)}%</StatHelpText>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>≥ 80% (Avg‑4PG)</StatLabel>
          <StatNumber>{keyStats.ge80}</StatNumber>
          <StatHelpText>{fmt(keyStats.ge80Pct)}% of companies</StatHelpText>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>Best Avg‑4PG</StatLabel>
          <StatNumber>{keyStats.best4pg ? `${fmt(keyStats.best4pg.value)}%` : '-'}</StatNumber>
          <StatHelpText>{keyStats.best4pg?.company || ''}</StatHelpText>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>Tier T1</StatLabel>
          <StatNumber>{keyStats.t1}</StatNumber>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>Tier T3</StatLabel>
          <StatNumber>{keyStats.t3}</StatNumber>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>IVC Overall (mean)</StatLabel>
          <StatNumber>{fmt(keyStats.ivcMean)}%</StatNumber>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>IEG Overall (mean)</StatLabel>
          <StatNumber>{fmt(keyStats.iegMean)}%</StatNumber>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>Avg Personnel</StatLabel>
          <StatNumber>{fmt(keyStats.compMeans.personnel)}%</StatNumber>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>Avg Production</StatLabel>
          <StatNumber>{fmt(keyStats.compMeans.production)}%</StatNumber>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>Avg Procurement & Suppliers</StatLabel>
          <StatNumber>{fmt(keyStats.compMeans.procurement)}%</StatNumber>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>Avg Public Engagement</StatLabel>
          <StatNumber>{fmt(keyStats.compMeans.publicEng)}%</StatNumber>
        </Stat>
        <Stat p={3} borderWidth="1px" borderRadius="md">
          <StatLabel>Avg Governance</StatLabel>
          <StatNumber>{fmt(keyStats.compMeans.governance)}%</StatNumber>
        </Stat>
      </SimpleGrid>

      <HStack spacing={3} mb={3} flexWrap="nowrap" overflowX="auto">
        <Input
          placeholder="Search company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="240px"
          size="sm"
        />
        {tabIndex === 1 && (
          <Select
            value={componentFilter}
            onChange={(e) => setComponentFilter(e.target.value)}
            width="220px"
            size="sm"
          >
            <option value="All">All Components</option>
            <option value="Personnel">Personnel</option>
            <option value="Production">Production</option>
            <option value="Procurement and Suppliers">Procurement & Suppliers</option>
            <option value="Public Engagement">Public Engagement</option>
            <option value="Governance">Governance</option>
          </Select>
        )}
        <Select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          width="120px"
          size="sm"
        >
          <option value="All">All Tiers</option>
          <option value="T1">T1</option>
          <option value="T3">T3</option>
        </Select>
        <NumberInput size="sm" width="140px" value={minAvg4pg} onChange={(v) => setMinAvg4pg(v)} min={0} max={100}>
          <NumberInputField placeholder="Min Avg 4PG" />
        </NumberInput>
        <FormControl display="flex" alignItems="center" ml={4}>
          <FormLabel htmlFor="ignore-zero-ivc" mb="0">
            Ignore IVC=0
          </FormLabel>
          <Switch
            id="ignore-zero-ivc"
            isChecked={ignoreZeroIVC}
            onChange={(e) => setIgnoreZeroIVC(e.target.checked)}
          />
        </FormControl>
        {/* <Button size="sm" onClick={handleExport} leftIcon={<DownloadIcon />}>Export CSV</Button> */}
        <Spacer />
        <Button
          size="sm"
          onClick={() => {
            setSearch('');
            setComponentFilter('All');
            setTierFilter('All');
            setAwardType('All');
            setMinAvg4pg('');
          }}
        >
          Reset Filters
        </Button>
      </HStack>

      <Tabs variant="enclosed" colorScheme="blue" index={tabIndex} onChange={setTabIndex}>
        <TabList>
          <Tab>4PG</Tab>
          <Tab>Top Performers</Tab>
        </TabList>
        <TabPanels>
          {/* Tab 1: Full 4PG table */}
          <TabPanel>
            <HStack mb={2} justify="flex-end">
              <Button size="sm" onClick={handleExport} leftIcon={<DownloadIcon />}>Export 4PG</Button>
            </HStack>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th
                    maxW="200px"
                    position="sticky"
                    left={0}
                    backgroundColor="white"
                    zIndex={2}
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.company && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.company, direction});
                    }}
                    cursor="pointer"
                  >
                    Company {sortConfig.key === COLS.company ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.tier && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.tier, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="Tier">
                      <Box as="span">
                        T{sortConfig.key === COLS.tier ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.ivcOverall && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.ivcOverall, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="Validated Scores (%)">
                      <Box as="span">
                        IVC (%) {sortConfig.key === COLS.ivcOverall ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.ivc.personnel && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.ivc.personnel, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="IVC Personnel (%)">
                      <Box as="span">
                        IVC-Pers (%) {sortConfig.key === COLS.ivc.personnel ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.ivc.production && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.ivc.production, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="IVC Production (%)">
                      <Box as="span">
                        IVC-Prod (%) {sortConfig.key === COLS.ivc.production ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.ivc.procurement && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.ivc.procurement, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="IVC Procurement and Suppliers (%)">
                      <Box as="span">
                        IVC-P.S (%) {sortConfig.key === COLS.ivc.procurement ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.ivc.publicEng && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.ivc.publicEng, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="IVC Public Engagement (%)">
                      <Box as="span">
                        IVC-PE (%) {sortConfig.key === COLS.ivc.publicEng ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.ivc.governance && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.ivc.governance, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="IVC Governance (%)">
                      <Box as="span">
                        IVC-Gov (%) {sortConfig.key === COLS.ivc.governance ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.iegOverall && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.iegOverall, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="Industry Expert Group (%)">
                      <Box as="span">
                        IEG (%) {sortConfig.key === COLS.iegOverall ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.ieg.personnel && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.ieg.personnel, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="IEG Personnel (%)">
                      <Box as="span">
                        IEG-Pers (%) {sortConfig.key === COLS.ieg.personnel ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.ieg.production && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.ieg.production, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="IEG Production (%)">
                      <Box as="span">
                        IEG-Prod (%) {sortConfig.key === COLS.ieg.production ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.ieg.procurement && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.ieg.procurement, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="IEG Procurement and Suppliers (%)">
                      <Box as="span">
                        IEG-P.S (%) {sortConfig.key === COLS.ieg.procurement ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.ieg.publicEng && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.ieg.publicEng, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="IEG Public Engagement">
                      <Box as="span">
                        IEG-PE {sortConfig.key === COLS.ieg.publicEng ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.ieg.governance && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.ieg.governance, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="IEG Governance">
                      <Box as="span">
                        IEG-Gov {sortConfig.key === COLS.ieg.governance ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.avg.personnel && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.avg.personnel, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="Average Personnel (%)">
                      <Box as="span">
                        Avg-Pers (%) {sortConfig.key === COLS.avg.personnel ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.avg.production && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.avg.production, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="Average Production (%)">
                      <Box as="span">
                        Avg-Prod (%) {sortConfig.key === COLS.avg.production ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.avg.procurement && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.avg.procurement, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="Average Procurement and Suppliers (%)">
                      <Box as="span">
                        Avg-P.S (%) {sortConfig.key === COLS.avg.procurement ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.avg.publicEng && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.avg.publicEng, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="Average Public Engagement (%)">
                      <Box as="span">
                        Avg-PE (%) {sortConfig.key === COLS.avg.publicEng ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.avg.governance && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.avg.governance, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="Average Governance (%)">
                      <Box as="span">
                        Avg-Gov (%) {sortConfig.key === COLS.avg.governance ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                  <Th
                    onClick={() => {
                      let direction = 'asc';
                      if (sortConfig.key === COLS.avg.total && sortConfig.direction === 'asc') {
                        direction = 'desc';
                      }
                      setSortConfig({key: COLS.avg.total, direction});
                    }}
                    cursor="pointer"
                  >
                    <Tooltip label="Average 4PG">
                      <Box as="span">
                        Avg-4PG {sortConfig.key === COLS.avg.total ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </Box>
                    </Tooltip>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sorted4PGData.length === 0 && !loading && (
                  <Tr><Td colSpan={19} style={{textAlign: 'center'}}>No data</Td></Tr>
                )}
                {sorted4PGData.map((row, idx) => (
                  <Tr key={idx}>
                    <Td
                      maxW="200px"
                      isTruncated
                      title={row[COLS.company]}
                      position="sticky"
                      left={0}
                      backgroundColor="white"
                      zIndex={1}
                    >
                      <Box as="span">{row[COLS.company]}</Box>
                    </Td>
                    <Td>
                      {row[COLS.tier] === 'TIER_3'
                        ? 'T3'
                        : row[COLS.tier] === 'TIER_1'
                          ? 'T1'
                          : row[COLS.tier] ?? '-'}
                    </Td>
                    <Td>{fmt(row[COLS.ivcOverall])}</Td>
                    <Td>{fmt(row[COLS.ivc.personnel])}</Td>
                    <Td>{fmt(row[COLS.ivc.production])}</Td>
                    <Td>{fmt(row[COLS.ivc.procurement])}</Td>
                    <Td>{fmt(row[COLS.ivc.publicEng])}</Td>
                    <Td>{fmt(row[COLS.ivc.governance])}</Td>
                    <Td>{fmt(row[COLS.iegOverall])}</Td>
                    <Td>{fmt(row[COLS.ieg.personnel])}</Td>
                    <Td>{fmt(row[COLS.ieg.production])}</Td>
                    <Td>{fmt(row[COLS.ieg.procurement])}</Td>
                    <Td>{fmt(row[COLS.ieg.publicEng])}</Td>
                    <Td>{fmt(row[COLS.ieg.governance])}</Td>
                    <Td bg={colorFor(row[COLS.avg.personnel])}>{fmt(row[COLS.avg.personnel])}</Td>
                    <Td bg={colorFor(row[COLS.avg.production])}>{fmt(row[COLS.avg.production])}</Td>
                    <Td bg={colorFor(row[COLS.avg.procurement])}>{fmt(row[COLS.avg.procurement])}</Td>
                    <Td bg={colorFor(row[COLS.avg.publicEng])}>{fmt(row[COLS.avg.publicEng])}</Td>
                    <Td bg={colorFor(row[COLS.avg.governance])}>{fmt(row[COLS.avg.governance])}</Td>
                    <Td>
                      {(() => {
                        const v = row[COLS.avg.total];
                        const t = perfTierUnweighted(v);
                        return (
                          <Badge colorScheme={t.scheme} variant="subtle">
                            {fmt(v)} · {t.label}
                          </Badge>
                        );
                      })()}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>


          {/* Tab 4: Top Performers per Component */}
          <TabPanel>
            <HStack mb={3} spacing={3}>
              <Heading size="sm">Top Performers (by Average Component %)</Heading>
              <Switch size="sm" isChecked={showTop10} onChange={(e) => setShowTop10(e.target.checked)}>
                Show Top 10
              </Switch>
              <Button size="sm" onClick={handleExportTopPerformers} leftIcon={<DownloadIcon />}>Export Top Performers</Button>
            </HStack>
            {(() => {
              const keys = (componentFilter === 'All'
                ? ['Personnel', 'Production', 'Procurement and Suppliers', 'Public Engagement', 'Governance']
                : [componentFilter]);
              const anyRows = keys.some((k) => (topByComponent[k] || []).length > 0);
              if (!anyRows) {
                return (
                  <Alert status="info" mb={3}>
                    <AlertIcon /> No companies meet the current thresholds/filters for the selected component(s).
                  </Alert>
                );
              }
              return keys.map((compKey) => (
                <Box key={compKey} mb={6}>
                  <Heading size="xs" mb={2}>
                    {compKey} (out of {MAX_BY_COMP[compKey]}%)
                  </Heading>
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th
                            position="sticky"
                            left={0}
                            backgroundColor="white"
                            zIndex={2}
                            maxW="200px"
                          >
                            Company
                          </Th>
                          <Th cursor="pointer" onClick={() => toggleSort('component')}>
                            Avg {compKey} {sortKey === 'component' ? (sortDir === 'desc' ? '▼' : '▲') : ''}
                          </Th>
                          <Th cursor="pointer" onClick={() => toggleSort('ivc')}>
                            Ranked IVC (%)
                            {sortKey === 'ivc' ? (sortDir === 'desc' ? '▼' : '▲') : ''}
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {(showTop10 ? (topByComponent[compKey] || []).slice(0, 10) : (topByComponent[compKey] || [])).map(({company, score, ivcPct}, idx) => (
                          <Tr key={idx}>
                            <Td
                              position="sticky"
                              left={0}
                              backgroundColor="white"
                              zIndex={1}
                              maxW="200px"
                              isTruncated
                              title={company}
                            >
                              <HStack spacing={1}>
                                <Box as="span">{company}</Box>
                              </HStack>
                            </Td>
                            <Td>
                              {(() => {
                                return (
                                  <Badge variant="subtle">
                                    {`${fmt(score)}%`}
                                  </Badge>
                                );
                              })()}
                            </Td>
                            <Td>
                              {(() => {
                                return (
                                  <Badge variant="subtle">
                                    {`${fmt(ivcPct)}%`}
                                  </Badge>
                                );
                              })()}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              ));
            })()}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};


FourPGRanking.propTypes = {
  cycle: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default FourPGRanking;
