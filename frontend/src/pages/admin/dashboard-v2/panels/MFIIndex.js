import React, {useState, useMemo, useEffect} from 'react';
import {request} from 'common';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Select,
  HStack,
  Input,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Tooltip,
  Spinner,
  Center,
  Button,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

/**
 * MFIIndex Component
 * Displays a summary table for MFI scoring with rankings.
 *
 * @param {Object} props
 * @param {Object} props.cycle
 * @returns {JSX.Element}
 */
const MFIIndex = ({cycle}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await request(true).get('/index-ranking-list', {
          params: {
            'page-size': 100,
            'cycle-id': cycle?.id,
          },
        });
        setData(res.data.results);
      } catch (err) {
        console.error('Failed to fetch index rankings', err);
      } finally {
        setLoading(false);
      }
    };

    cycle && fetchData();
  }, [cycle]);

  const [filters, setFilters] = useState({sector: '', satType: '', company: ''});

  const [sortConfig, setSortConfig] = useState({key: 'variance', direction: 'desc'});

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredData = data.filter((item) => {
    const sectorLabel = item.productType?.name || item.sector || '';
    const satTypeLabel = item.tier || item.satType || '';
    const sectorOk = filters.sector === '' || sectorLabel === filters.sector;
    const satTypeOk = filters.satType === '' || satTypeLabel === filters.satType;
    const companyOk =
      filters.company === '' ||
      (item.company_name &&
        item.company_name.toLowerCase().includes(filters.company.toLowerCase()));
    return sectorOk && satTypeOk && companyOk;
  });

  const derivedData = useMemo(() => {
    const rows = filteredData.map((item) => {
      const ivc = Number(item.ivc) || 0; // Weighted SAT (Max 60%)
      const pt = item.productTests.length > 0 ? Number(item.productTests[0].fortification?.score) || 0 : 0; // PT (20%)
      const ieg = Number(item.ieg) || 0; // IEG (20%)
      const finalScore = ivc + pt + ieg; // FINAL (100%)
      const sectorLabel = item.productType?.name || item.sector || '';
      return {
        ...item,
        ivc,
        pt,
        ieg,
        finalScore,
        sectorLabel,
      };
    });

    const byFinal = [...rows].sort((a, b) => b.finalScore - a.finalScore);
    byFinal.forEach((row, idx) => {
      row.rank = idx + 1;
    });
    return byFinal;
  }, [filteredData]);

  const metrics = useMemo(() => {
    const rows = derivedData;
    const sum = (key) => rows.reduce((s, r) => s + (Number(r[key]) || 0), 0);
    const avg = (key) => (rows.length ? sum(key) / rows.length : 0);

    const avgIVC = avg('ivc');
    const avgPT = avg('pt');
    const avgIEG = avg('ieg');
    const avgFinal = avg('finalScore');

    const topBrandRow = rows.length
      ? rows.reduce((best, r) => (r.finalScore > best.finalScore ? r : best), rows[0])
      : null;

    const sectorAgg = rows.reduce((acc, r) => {
      const key = r.sectorLabel || '—';
      if (!acc[key]) acc[key] = {sum: 0, count: 0};
      acc[key].sum += r.finalScore;
      acc[key].count += 1;
      return acc;
    }, {});

    let topSector = '—';
    let topSectorAvg = 0;
    Object.entries(sectorAgg).forEach(([k, v]) => {
      const a = v.sum / v.count;
      if (v.count > 0 && (a > topSectorAvg)) {
        topSectorAvg = a;
        topSector = k;
      }
    });

    const totalCompanies = new Set(rows.map((r) => r.company_name)).size;
    const totalBrands = new Set(rows.map((r) => r.name)).size;
    const totalTier1 = rows.filter((r) => r.tier === 'TIER_1').length;
    const totalTier3 = rows.filter((r) => r.tier === 'TIER_3').length;

    return {
      topBrand: topBrandRow ? topBrandRow.name : '—',
      topBrandScore: topBrandRow ? topBrandRow.finalScore : 0,
      topSector,
      topSectorAvg,
      avgIVC,
      avgPT,
      avgIEG,
      avgFinal,
      avgMFI: avgFinal,
      count: rows.length,
      totalCompanies,
      totalBrands,
      totalTier1,
      totalTier3,
    };
  }, [derivedData]);

  const fmt = (num) => (typeof num === 'number' ? num.toFixed(2) : '—');

  const isIncomplete = (val) => {
    if (val === null || val === undefined) return true;
    if (typeof val === 'string') {
      const v = val.trim();
      if (v === '' || v.toUpperCase() === 'N/A') return true;
      const n = Number(v);
      if (!Number.isNaN(n) && n === 0) return true;
      return false;
    }
    if (typeof val === 'number') return val === 0;
    return false;
  };

  const CellWithBadge = ({value, children, reason}) => (
    <HStack spacing={2} align="center">
      {children}
      {isIncomplete(value) && (
        <Tooltip label={reason || 'Incomplete (null, N/A, or 0)'}>
          <Badge colorScheme="orange" variant="subtle">!</Badge>
        </Tooltip>
      )}
    </HStack>
  );

  CellWithBadge.propTypes = {
    value: PropTypes.any,
    children: PropTypes.node,
    reason: PropTypes.string,
  };

  const sortedData = useMemo(() => {
    const keyMap = {
      brand: 'name',
      company: 'company_name',
      sector: 'sectorLabel',
      satType: 'tier',
      satScore: 'ivc',
      ptScore: 'pt',
      iegScore: 'ieg',
      finalScore: 'finalScore',
      rank: 'rank',
      variance: 'variance',
    };
    const key = keyMap[sortConfig.key] || sortConfig.key;
    const isAsc = sortConfig.direction === 'asc';

    const sorted = [...derivedData].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      const aU = valA === undefined || valA === null;
      const bU = valB === undefined || valB === null;
      if (aU && bU) return 0;
      if (aU) return isAsc ? -1 : 1;
      if (bU) return isAsc ? 1 : -1;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return isAsc ? valA - valB : valB - valA;
      }
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return isAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

    return sorted;
  }, [derivedData, sortConfig]);

  const handleExport = () => {
    const headers = [
      'Brand',
      'Company Name',
      'Sector',
      'SAT Type',
      'Weighted SAT Score',
      'Weighted PT Score',
      'Weighted IEG Score',
      'Final MFI Score',
      'Ranking'
    ];
    const rows = sortedData.map((item) => [
      item.name,
      item.company_name,
      item.productType?.name || '—',
      item.tier || '—',
      item.ivc.toFixed(2),
      item.pt.toFixed(2),
      item.ieg.toFixed(2),
      item.finalScore.toFixed(2),
      item.rank
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'mfi_index_rankings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    loading ? (
      <Center py={10}><Spinner size="lg" /></Center>
    ) : (
      <Box p={4}>
        <HStack justify="space-between" mb={4}>
          <Heading size="md">MFI Index Rankings</Heading>
          <Button colorScheme="blue" onClick={handleExport}>Export</Button>
        </HStack>

        <SimpleGrid columns={{base: 1, md: 2, lg: 3, xl: 5}} spacing={4} mb={4}>
          <Stat p={4} borderWidth="1px" borderRadius="md">
            <StatLabel>Top Performing Brand</StatLabel>
            <StatNumber fontSize="lg">{metrics.topBrand || '—'}</StatNumber>
            <StatHelpText>Final Score: {fmt(metrics.topBrandScore)}</StatHelpText>
          </Stat>
          <Stat p={4} borderWidth="1px" borderRadius="md">
            <StatLabel>Top Performing Sector</StatLabel>
            <StatNumber fontSize="lg">{metrics.topSector || '—'}</StatNumber>
            <StatHelpText>Avg Final: {fmt(metrics.topSectorAvg)}</StatHelpText>
          </Stat>
          <Stat p={4} borderWidth="1px" borderRadius="md">
            <StatLabel>Average SAT (60%)</StatLabel>
            <StatNumber fontSize="lg">{fmt(metrics.avgIVC)}</StatNumber>
          </Stat>
          <Stat p={4} borderWidth="1px" borderRadius="md">
            <StatLabel>Average PT (20%)</StatLabel>
            <StatNumber fontSize="lg">{fmt(metrics.avgPT)}</StatNumber>
          </Stat>
          <Stat p={4} borderWidth="1px" borderRadius="md">
            <StatLabel>Average IEG (20%)</StatLabel>
            <StatNumber fontSize="lg">{fmt(metrics.avgIEG)}</StatNumber>
          </Stat>
          <Stat p={4} borderWidth="1px" borderRadius="md">
            <StatLabel>Average MFI Score</StatLabel>
            <StatNumber fontSize="lg">{fmt(metrics.avgMFI)}</StatNumber>
          </Stat>
          <Stat p={4} borderWidth="1px" borderRadius="md">
            <StatLabel>Total Companies</StatLabel>
            <StatNumber fontSize="lg">{metrics.totalCompanies}</StatNumber>
          </Stat>
          <Stat p={4} borderWidth="1px" borderRadius="md">
            <StatLabel>Total Brands</StatLabel>
            <StatNumber fontSize="lg">{metrics.totalBrands}</StatNumber>
          </Stat>
          <Stat p={4} borderWidth="1px" borderRadius="md">
            <StatLabel>Total Tier 1</StatLabel>
            <StatNumber fontSize="lg">{metrics.totalTier1}</StatNumber>
          </Stat>
          <Stat p={4} borderWidth="1px" borderRadius="md">
            <StatLabel>Total Tier 3</StatLabel>
            <StatNumber fontSize="lg">{metrics.totalTier3}</StatNumber>
          </Stat>
        </SimpleGrid>

        <HStack align="start" spacing={4} mb={4}>
          <Input
            placeholder="Filter by Company Name"
            value={filters.company}
            onChange={(e) => setFilters((prev) => ({...prev, company: e.target.value}))}
            width="200px"
          />
          <Select
            placeholder="Filter by Sector"
            value={filters.sector}
            onChange={(e) => setFilters((prev) => ({...prev, sector: e.target.value}))}
            width="200px"
          >
            <option value="Edible Oil">Edible Oil</option>
            <option value="Sugar">Sugar</option>
            <option value="Flour">Flour</option>
          </Select>

          <Select
            placeholder="Filter by SAT Type"
            value={filters.satType}
            onChange={(e) => setFilters((prev) => ({...prev, satType: e.target.value}))}
            width="200px"
          >
            <option value="TIER_1">TIER_1</option>
            <option value="TIER_3">TIER_3</option>
          </Select>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th onClick={() => handleSort('brand')} cursor="pointer">
                Brands{sortConfig.key === 'brand' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
              </Th>
              <Th onClick={() => handleSort('company')} cursor="pointer">
                Company Name{sortConfig.key === 'company' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
              </Th>
              <Th onClick={() => handleSort('sector')} cursor="pointer">
                Sector{sortConfig.key === 'sector' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
              </Th>
              <Th onClick={() => handleSort('satType')} cursor="pointer">
                SAT Type{sortConfig.key === 'satType' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
              </Th>
              <Th onClick={() => handleSort('satScore')} cursor="pointer">
                Weighted SAT Scores (Max 60%){sortConfig.key === 'satScore' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
              </Th>
              <Th onClick={() => handleSort('ptScore')} cursor="pointer">
                Weighted Product Testing Scores (20%){sortConfig.key === 'ptScore' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
              </Th>
              <Th onClick={() => handleSort('iegScore')} cursor="pointer">
                Weighted IEG Scores (20%){sortConfig.key === 'iegScore' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
              </Th>
              <Th onClick={() => handleSort('finalScore')} cursor="pointer">
                FINAL MFI Score (100%){sortConfig.key === 'finalScore' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
              </Th>
              <Th onClick={() => handleSort('rank')} cursor="pointer">
                Ranking{sortConfig.key === 'rank' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
              </Th>
              <Th>Validated</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map((item, index) => (
              <Tr key={index}>
                <Td>{item.name}</Td>
                <Td>{item.company_name}</Td>
                <Td>
                  <CellWithBadge value={item.productType?.name} reason="Missing sector">
                    <span>{item.productType?.name || '—'}</span>
                  </CellWithBadge>
                </Td>
                <Td>
                  <CellWithBadge value={item.tier} reason="Missing SAT type">
                    <span>{item.tier || '—'}</span>
                  </CellWithBadge>
                </Td>
                <Td>
                  <CellWithBadge value={item.ivc} reason="SAT score is 0 or missing">
                    <span>{typeof item.ivc === 'number' ? item.ivc.toFixed(2) : item.ivc}</span>
                  </CellWithBadge>
                </Td>
                <Td>
                  <CellWithBadge value={typeof item.pt === 'number' ? item.pt : 'N/A'} reason="PT score is N/A or 0">
                    <span>{typeof item.pt === 'number' ? item.pt.toFixed(2) : 'N/A'}</span>
                  </CellWithBadge>
                </Td>
                <Td>
                  <CellWithBadge value={item.ieg} reason="IEG score is 0 or missing">
                    <span>{typeof item.ieg === 'number' ? item.ieg.toFixed(2) : item.ieg}</span>
                  </CellWithBadge>
                </Td>
                <Td>
                  <CellWithBadge value={item.finalScore} reason="Final score is 0">
                    <span>{item.finalScore.toFixed(2)}</span>
                  </CellWithBadge>
                </Td>
                <Td>{item.rank}</Td>
                <Td>{item.ivc && item.ivc !== 0 ? 'Yes' : 'No'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    )
  );
};

MFIIndex.propTypes = {
  cycle: PropTypes.object.isRequired,
};

export default MFIIndex;
