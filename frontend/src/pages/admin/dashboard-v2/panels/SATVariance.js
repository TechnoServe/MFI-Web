import React, {useState, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Spinner,
  Center,
  Flex,
  Icon,
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Badge,
  Tooltip,
  Button,
  Input,
  SimpleGrid
} from '@chakra-ui/react';
import {ChevronUpIcon, ChevronDownIcon} from '@chakra-ui/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {request} from 'common';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ChartTooltip, Legend);

/**
 * SATVariance Component
 * Displays a comparison between self-assessed and validated SAT scores for companies,
 * highlighting the variance between the two scores.
 *
 * @returns {JSX.Element} The rendered SAT variance table.
 */

const SATVariance = ({cycle}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [varianceThreshold, setVarianceThreshold] = useState(5); // percent
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false);

  const [companyFilter, setCompanyFilter] = useState('');

  const [sortConfig, setSortConfig] = useState({key: 'variancePct', direction: 'asc'});

  const handleExportFlagged = () => {
    const flagged = data.filter(
      (r) => typeof r.variancePct === 'number' && r.variancePct > varianceThreshold
    );
    if (flagged.length === 0) return;
    const headers = [
      'Company',
      'Tier',
      'Self Score (%)',
      'Validated Score (%)',
      'Variance (%)',
    ];
    const rows = flagged.map((r) => [
      r.company,
      r.tier ?? '',
      (Number(r.selfScore) ?? 0).toFixed(2),
      (Number(r.validatedScore) ?? 0).toFixed(2),
      (Number(r.variancePct) ?? 0).toFixed(2),
    ]);
    const csv = [headers, ...rows].map((arr) => arr.join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sat_variance_flagged.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    if (data.length === 0) return;
    const headers = [
      'Company',
      'Tier',
      'Self Score (%)',
      'Validated Score (%)',
      'Variance (%)',
    ];
    const rows = data.map((r) => [
      r.company,
      r.tier ?? '',
      (Number(r.selfScore) ?? 0).toFixed(2),
      (Number(r.validatedScore) ?? 0).toFixed(2),
      (Number(r.variancePct) ?? 0).toFixed(2),
    ]);
    const csv = [headers, ...rows].map((arr) => arr.join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sat_variance_all.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {key, direction: prev.direction === 'asc' ? 'desc' : 'asc'};
      }
      return {key, direction: 'asc'};
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData([]);
      try {
        const response = await request(true).get('/admin/sat-variance', {
          params: {'cycle-id': cycle?.id}
        });
        const mappedData = response.data.map((item) => ({
          company: item.company_name,
          tier: item.tier,
          selfScore: item.selfScore,
          validatedScore: item.validatedScore,
          variance: item.variance,
          variancePct: item.variancePct
        }));
        setData(mappedData);
      } catch (error) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    if (cycle?.id) {
      fetchData();
    }
  }, [cycle]);

  const filteredData = useMemo(() => {
    let temp = data;
    if (companyFilter.trim()) {
      const lowerFilter = companyFilter.trim().toLowerCase();
      temp = temp.filter((r) => r.company.toLowerCase().includes(lowerFilter));
    }
    if (showOnlyFlagged) {
      temp = temp.filter((r) => typeof r.variancePct === 'number' && r.variancePct > varianceThreshold);
    }
    return temp;
  }, [data, companyFilter, showOnlyFlagged, varianceThreshold]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return sortConfig.direction === 'asc'
          ? aVal - bVal
          : bVal - aVal;
      }
    });
  }, [filteredData, sortConfig]);

  const summary = useMemo(() => {
    const totalCompanies = data.length;
    const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    const hasVar = (r) => Number.isFinite(Number(r.variancePct));

    const totalFlagged = data.filter((r) => hasVar(r) && r.variancePct > varianceThreshold).length;

    const avgSelfScore = totalCompanies
      ? (data.reduce((sum, r) => sum + safeNum(r.selfScore), 0) / totalCompanies).toFixed(2)
      : '0.00';
    const avgValidatedScore = totalCompanies
      ? (data.reduce((sum, r) => sum + safeNum(r.validatedScore), 0) / totalCompanies).toFixed(2)
      : '0.00';

    const variances = data.filter(hasVar).map((r) => Number(r.variancePct)).sort((a, b) => a - b);
    const avgVariance = variances.length
      ? (variances.reduce((s, v) => s + v, 0) / variances.length).toFixed(2)
      : '0.00';
    const medianVariance = variances.length
      ? (variances.length % 2 === 1
          ? variances[(variances.length - 1) / 2]
          : (variances[variances.length / 2 - 1] + variances[variances.length / 2]) / 2
        ).toFixed(2)
      : '0.00';

    let highestSatRow = null;
    for (const r of data) {
      if (!highestSatRow || safeNum(r.selfScore) > safeNum(highestSatRow.selfScore)) highestSatRow = r;
    }

    let highestIvcRow = null;
    for (const r of data) {
      if (!highestIvcRow || safeNum(r.validatedScore) > safeNum(highestIvcRow.validatedScore)) highestIvcRow = r;
    }

    const withVar = data.filter(
      (r) =>
        hasVar(r) &&
        Number(r.selfScore) !== 0 &&
        Number(r.validatedScore) !== 0
    );
    let smallestVarRow = null;
    let biggestVarRow = null;
    for (const r of withVar) {
      if (!smallestVarRow || Number(r.variancePct) < Number(smallestVarRow.variancePct)) smallestVarRow = r;
      if (!biggestVarRow || Number(r.variancePct) > Number(biggestVarRow.variancePct)) biggestVarRow = r;
    }

    const outlierRate = totalCompanies ? ((totalFlagged / totalCompanies) * 100).toFixed(2) : '0.00';

    return {
      totalCompanies,
      totalFlagged,
      avgSelfScore,
      avgValidatedScore,
      avgVariance,
      medianVariance,
      highestSatCompany: highestSatRow?.company || '—',
      highestSat: highestSatRow ? safeNum(highestSatRow.selfScore).toFixed(2) : '0.00',
      highestIvcCompany: highestIvcRow?.company || '—',
      highestIvc: highestIvcRow ? safeNum(highestIvcRow.validatedScore).toFixed(2) : '0.00',
      smallestVarCompany: smallestVarRow?.company || '—',
      smallestVar: smallestVarRow ? Number(smallestVarRow.variancePct).toFixed(2) : '0.00',
      biggestVarCompany: biggestVarRow?.company || '—',
      biggestVar: biggestVarRow ? Number(biggestVarRow.variancePct).toFixed(2) : '0.00',
      outlierRate,
    };
  }, [data, varianceThreshold]);

  // console.log('SAT Variance Summary:', summary);


  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Box p={4}>
      <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4, xl: 5}} spacing={4} mb={4}>
        <Box p={4} bg="gray.50" borderWidth="1px" borderRadius="md">
          <Heading size="sm">Total Companies</Heading>
          <Box fontSize="lg" fontWeight="bold">{summary.totalCompanies}</Box>
        </Box>
        <Box p={4} bg="gray.50" borderWidth="1px" borderRadius="md">
          <Heading size="sm">Flagged Companies</Heading>
          <Box fontSize="lg" fontWeight="bold">{summary.totalFlagged}</Box>
        </Box>
        <Box p={4} bg="gray.50" borderWidth="1px" borderRadius="md">
          <Heading size="sm">Avg Self Score</Heading>
          <Box fontSize="lg" fontWeight="bold">{summary.avgSelfScore}%</Box>
        </Box>
        <Box p={4} bg="gray.50" borderWidth="1px" borderRadius="md">
          <Heading size="sm">Avg Validated Score</Heading>
          <Box fontSize="lg" fontWeight="bold">{summary.avgValidatedScore}%</Box>
        </Box>
        <Box p={4} bg="gray.50" borderWidth="1px" borderRadius="md">
          <Heading size="sm">Avg Variance</Heading>
          <Box fontSize="lg" fontWeight="bold">{summary.avgVariance}%</Box>
        </Box>
        <Box p={4} bg="gray.50" borderWidth="1px" borderRadius="md">
          <Heading size="sm">Highest SAT</Heading>
          <Box fontSize="lg" fontWeight="bold">{summary.highestSat}%</Box>
          <Box fontSize="sm">{summary.highestSatCompany}</Box>
        </Box>
        <Box p={4} bg="gray.50" borderWidth="1px" borderRadius="md">
          <Heading size="sm">Highest IVC</Heading>
          <Box fontSize="lg" fontWeight="bold">{summary.highestIvc}%</Box>
          <Box fontSize="sm">{summary.highestIvcCompany}</Box>
        </Box>
        <Box p={4} bg="gray.50" borderWidth="1px" borderRadius="md">
          <Heading size="sm">Smallest Variance</Heading>
          <Box fontSize="lg" fontWeight="bold">{summary.smallestVar}%</Box>
          <Box fontSize="sm">{summary.smallestVarCompany}</Box>
        </Box>
        <Box p={4} bg="gray.50" borderWidth="1px" borderRadius="md">
          <Heading size="sm">Biggest Variance</Heading>
          <Box fontSize="lg" fontWeight="bold">{summary.biggestVar}%</Box>
          <Box fontSize="sm">{summary.biggestVarCompany}</Box>
        </Box>
        <Box p={4} bg="gray.50" borderWidth="1px" borderRadius="md">
          <Heading size="sm">Outlier Rate</Heading>
          <Box fontSize="lg" fontWeight="bold">{summary.outlierRate}%</Box>
        </Box>
      </SimpleGrid>
      <Heading size="md" mb={4}>SAT Variance</Heading>
      <HStack spacing={6} mb={4} align="center">
        <FormControl display="flex" alignItems="center" width="auto">
          <FormLabel m={0} mr={3}>Outlier threshold (%)</FormLabel>
          <NumberInput size="sm" maxW="100px" step={0.1} min={0} max={100} value={varianceThreshold}
            onChange={(valueString, valueNumber) => setVarianceThreshold(Number.isFinite(valueNumber) ? valueNumber : 0)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl display="flex" alignItems="center" width="auto">
          <FormLabel m={0} mr={3}>Show only flagged</FormLabel>
          <Switch isChecked={showOnlyFlagged} onChange={(e) => setShowOnlyFlagged(e.target.checked)} />
        </FormControl>
        <FormControl display="flex" alignItems="center" width="auto">
          <FormLabel m={0} mr={3}>Filter by company</FormLabel>
          <Input
            size="sm"
            maxW="200px"
            placeholder="Enter company name"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          />
        </FormControl>
        <Button
          size="sm"
          colorScheme="green"
          onClick={handleExportAll}
          isDisabled={data.length === 0}
        >
          Export all
        </Button>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={handleExportFlagged}
          isDisabled={!data.some((r) => typeof r.variancePct === 'number' && r.variancePct > varianceThreshold)}
        >
          Export flagged only
        </Button>
      </HStack>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={() => handleSort('company')}>
              <Flex align="center">
                Company Name
                {sortConfig.key === 'company' && (
                  <Icon as={sortConfig.direction === 'asc' ? ChevronUpIcon : ChevronDownIcon} ml={2} />
                )}
              </Flex>
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('tier')}>
              <Flex align="center">
                Tier
                {sortConfig.key === 'tier' && (
                  <Icon as={sortConfig.direction === 'asc' ? ChevronUpIcon : ChevronDownIcon} ml={2} />
                )}
              </Flex>
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('selfScore')}>
              <Flex align="center">
                Self Assessed SAT Score
                {sortConfig.key === 'selfScore' && (
                  <Icon as={sortConfig.direction === 'asc' ? ChevronUpIcon : ChevronDownIcon} ml={2} />
                )}
              </Flex>
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('validatedScore')}>
              <Flex align="center">
                Validated SAT Score
                {sortConfig.key === 'validatedScore' && (
                  <Icon as={sortConfig.direction === 'asc' ? ChevronUpIcon : ChevronDownIcon} ml={2} />
                )}
              </Flex>
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('variancePct')}>
              <Flex align="center">
                Variance (%)
                {sortConfig.key === 'variancePct' && (
                  <Icon as={sortConfig.direction === 'asc' ? ChevronUpIcon : ChevronDownIcon} ml={2} />
                )}
              </Flex>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.map((row) => (
            <Tr
              key={row.company}
              bg={Number(row.selfScore) === 0 && Number(row.validatedScore) === 0 ? 'gray.100' : undefined}
            >
              <Td>
                <HStack spacing={2}>
                  <span>{row.company}</span>
                  {Number(row.selfScore) === 0 && Number(row.validatedScore) === 0 && (
                    <Tooltip label="No SAT & IVC score">
                      <Badge colorScheme="yellow" variant="subtle">!</Badge>
                    </Tooltip>
                  )}
                  {typeof row.variancePct === 'number' && row.variancePct > varianceThreshold && (
                    <Tooltip label={`High variance: ${row.variancePct.toFixed(2)}%`}>
                      <Badge colorScheme="red" variant="subtle">Outlier</Badge>
                    </Tooltip>
                  )}
                </HStack>
              </Td>
              <Td>{row.tier}</Td>
              <Td>{row.selfScore.toFixed(2)}%</Td>
              <Td>{row.validatedScore.toFixed(2)}%</Td>
              <Td>{typeof row.variancePct === 'number' ? `${row.variancePct.toFixed(2)}%` : '—'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box mt={10}>
        <Heading size="sm" mb={4}>Self Assessment Vs. Validated Scores</Heading>
        <Bar
          data={{
            labels: data.map((item) => item.company),
            datasets: [
              {
                label: 'Self Assessed SAT Score',
                data: data.map((item) => item.selfScore),
                backgroundColor: '#3182ce',
              },
              {
                label: 'Validated SAT Score',
                data: data.map((item) => item.validatedScore),
                backgroundColor: '#2f855a',
              },
              {
                type: 'line',
                label: 'Average SAT (%)',
                data: data.map(() => Number(summary.avgSelfScore) || 0),
                borderDash: [6, 6],
                borderColor: '#3182ce',
                borderWidth: 2,
                pointRadius: 0,
              },
              {
                type: 'line',
                label: 'Average IVC (%)',
                data: data.map(() => Number(summary.avgValidatedScore) || 0),
                borderDash: [4, 4],
                borderColor: '#2f855a',
                borderWidth: 3,
                pointRadius: 0,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.parsed.y}%`
                }
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
              },
            },
          }}
        />
      </Box>
      <Box mt={10}>
        <Heading size="sm" mb={4}>Variance</Heading>
        <Bar
          data={{
            labels: data.map((item) => item.company),
            datasets: [
              {
                label: 'SAT Score Variance (%)',
                data: data.map((item) => (typeof item.variancePct === 'number' ? item.variancePct.toFixed(2) : 0)),
                backgroundColor: '#dd6b20',
              },
              {
                type: 'line',
                label: 'Average Variance (%)',
                data: data.map(() => Number(summary.avgVariance) || 0),
                borderDash: [6, 6],
                pointRadius: 0,
              },
            ],
          }}
          options={{
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => `Variance: ${context.parsed.x}%`,
                },
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                max: 100,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};


SATVariance.propTypes = {
  cycle: PropTypes.object
};

export default SATVariance;
