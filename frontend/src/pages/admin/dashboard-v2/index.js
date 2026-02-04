/** **
 * MFI Dashboard Index Page
 * This component sets up the admin dashboard layout for MFI,
 * including a collapsible right-hand sidebar and dynamically loaded panel views.
 */

import React, {useState, useEffect, Suspense, useMemo} from 'react';
import {request} from 'common';
import {
  Box,
  Flex,
  IconButton,
  VStack,
  Button,
  useColorModeValue,
  Text,
  Select,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import {
  ViewIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';
// import {FaTable, FaChartBar, FaBalanceScale, FaList, FaTools, FaCheck} from 'react-icons/fa';
import {FaChartBar, FaList, FaTools} from 'react-icons/fa';

const MFIIndex = React.lazy(() => import('./panels/MFIIndex'));
// const SATScores = React.lazy(() => import('./panels/SATScores'));
// const ProductTestingScores = React.lazy(() => import('./panels/ProductTestingScores'));
// const IEGScores = React.lazy(() => import('./panels/IEGScores'));
const SATVariance = React.lazy(() => import('./panels/SATVariance'));
const FourPGRanking = React.lazy(() => import('./panels/FourPGRanking'));
const Settings = React.lazy(() => import('./panels/Settings'));

const panelMap = (cycle) => ({
  'MFI Index': <MFIIndex key={`mfiindex-${cycle?.id || 'none'}`} cycle={cycle} />,
  // 'SAT Scores': <SATScores key={`satscores-${cycle?.id || 'none'}`} cycle={cycle} />,
  // 'Product Testing Scores': <ProductTestingScores key={`pt-${cycle?.id || 'none'}`} cycle={cycle} />,
  // 'IEG Scores': <IEGScores key={`ieg-${cycle?.id || 'none'}`} cycle={cycle} />,
  'SAT Variance': <SATVariance key={`satvariance-${cycle?.id || 'none'}`} cycle={cycle} />,
  '4PG Ranking': <FourPGRanking key={`fourpg-${cycle?.id || 'none'}`} cycle={cycle} />,
  'Settings': <Settings key={`settings-${cycle?.id || 'none'}`} cycle={cycle} />,
});

const sidebarItems = [
  {label: 'MFI Index', icon: FaChartBar},
  // {label: 'SAT Scores', icon: FaTable},
  // {label: 'Product Testing Scores', icon: FaCheck},
  // {label: 'IEG Scores', icon: FaBalanceScale},
  {label: 'SAT Variance', icon: ViewIcon},
  {label: '4PG Ranking', icon: FaList},
  {label: 'Settings', icon: FaTools},
];

/**
 * MFIDashboard Component
 * Renders the main dashboard layout with a dynamic sidebar and content area.
 *
 * @returns {JSX.Element} The rendered dashboard layout with lazy-loaded panel components.
 */
export default function MFIDashboard() {
  const [activePanel, setActivePanel] = useState('MFI Index');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [cycle, setCycle] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [loadingCycles, setLoadingCycles] = useState(true);

  useEffect(() => {
    const fetchCycles = async () => {
      setLoadingCycles(true);
      try {
        const res = await request(true).get('/admin/cycles');
        const sorted = res.data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        setCycles(sorted);
        const activeCycle = sorted.find((c) => c.active);
        if (activeCycle) setCycle(activeCycle);
        else if (sorted.length > 0) setCycle(sorted[0]);
      } catch (err) {
        console.error('Failed to load cycles:', err);
      } finally {
        setLoadingCycles(false);
      }
    };
    fetchCycles();
  }, []);

  const panels = useMemo(() => panelMap(cycle), [cycle]);

  return (
    <Flex height="100vh">
      <Box flex="1" p={4} overflow="auto">
        <Flex justify="flex-end" mb={4}>
          <HStack>
            <Select
              width="200px"
              placeholder={loadingCycles ? 'Loading cycles…' : 'Select cycle'}
              value={cycle?.name}
              onChange={(e) => {
                const selected = cycles.find((c) => c.name === e.target.value);
                setCycle(selected);
              }}
            >
              {cycles.map((c, idx) => (
                <option key={idx} value={c.name}>
                  {c.name}
                </option>
              ))}
            </Select>
            {loadingCycles && <Spinner size="sm" ml={2} />}
          </HStack>
        </Flex>
        <Suspense fallback={<Text>Loading...</Text>}>
          {panels[activePanel]}
        </Suspense>
      </Box>
      <Box
        width={sidebarExpanded ? '230px' : '70px'}
        bg={useColorModeValue('gray.100', 'gray.900')}
        p={4}
        transition="width 0.3s"
      >
        <VStack align="start" spacing={4}>
          <IconButton
            icon={sidebarExpanded ? <ViewOffIcon /> : <ViewIcon />}
            aria-label="Toggle Sidebar"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            variant="ghost"
            alignSelf="start"
          />
          {sidebarItems.map(({label, icon: Icon}) => (
            <Button
              key={label}
              leftIcon={<Icon />}
              onClick={() => setActivePanel(label)}
              variant="ghost"
              justifyContent={sidebarExpanded ? 'flex-start' : 'center'}
              width="100%"
              fontWeight={activePanel === label ? 'bold' : 'normal'}
            >
              {sidebarExpanded && label}
            </Button>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
}
