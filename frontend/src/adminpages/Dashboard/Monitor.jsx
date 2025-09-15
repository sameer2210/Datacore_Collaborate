/* eslint-disable no-unused-vars */
import { Box, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { reportEndpoints } from '../../api/endpoints/report.endpoints';
import { deleteReport } from '../../api/reportApis.js';
import EmptyState from '../../components/common/EmptyState';
import SkeletonCard from '../../components/common/SkeletonCard';
import useFetch from '../../utils/hooks/useFetch';
import CreateReport from '../owner/CreateReport';
import './dashboardStyles.css';
import DashboardVettingTable from './DashboardVettingTable';
import ReportCard from './ReportCard';
import ReportForVerification from './ReportForVerification';

const Monitor = () => {
  const dashBoardOption = useRef(null);
  const [createReport, setCreateReport] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [draftVersion, setDraftVersion] = useState(0);

  const {
    data: readyReports,
    loading: loadingReadyReports,
    error: readyReportsErr,
    refetch: refetchReadyReports,
  } = useFetch(reportEndpoints.getReports, {
    status: 'ready',
  });

  const {
    data: draftsData,
    loading: draftsLoading,
    error: draftsError,
    refetch: refetchDrafts,
  } = useFetch(reportEndpoints.getReports, {
    status: 'draft',
    version: draftVersion,
  });

  useEffect(() => {
    localStorage.removeItem('resetEmail');
    localStorage.removeItem('resetToken');
  }, []);

  useEffect(() => {
    if (draftsData?.reports) {
      setDrafts(draftsData.reports);
    }
  }, [draftsData]);

  const handleDeleteDraft = async id => {
    try {
      await deleteReport(id);
      setDrafts(prevDrafts => prevDrafts.filter(draft => draft.id !== id));
      setDraftVersion(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting draft:', error);
      refetchDrafts();
    }
  };

  const handleDeleteReadyReport = async id => {
    try {
      await deleteReport(id);
      refetchReadyReports();
    } catch (error) {
      console.error('Error deleting ready report:', error);
      refetchReadyReports();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {createReport ? (
        <CreateReport closeView={() => setCreateReport(false)} />
      ) : (
        <>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              p: 3,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ width: '200px' }}></Box>
                <div style={{ width: '1px' }}></div>
                <h2 className="dashboard-report_heading">Drafts</h2>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'stretch',
                }}
                ref={dashBoardOption}
              >
                <Box
                  sx={{
                    borderRadius: '10px',
                    border: '1px dashed #369D9C',
                    background: '#FFF',
                    minWidth: '200px',
                    height: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '.5rem',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#F6FFF7',
                    },
                  }}
                  onClick={() => setCreateReport(true)}
                >
                  <svg width={26} height={36} viewBox="0 0 31 40" fill="none">
                    <path
                      id="Vector"
                      d="M9.28571 30.2778H17.5714M9.28571 22.0556H17.5714M9.28571 13.8333H11.3571M17.5714 1.5H7.62857C5.30836 1.5 4.14824 1.5 3.26204 1.94809C2.4825 2.34222 1.84873 2.97114 1.45155 3.74471C1 4.62412 1 5.77535 1 8.07778V31.9222C1 34.2247 1 35.376 1.45155 36.2553C1.84873 37.0288 2.4825 37.6578 3.26204 38.0519C4.14824 38.5 5.30836 38.5 7.62857 38.5H17.5714M17.5714 1.5L30 13.8333M17.5714 1.5V10.5444C17.5714 11.6957 17.5714 12.2713 17.7972 12.711C17.9959 13.0978 18.3126 13.4122 18.7024 13.6093C19.1455 13.8333 19.7255 13.8333 20.8857 13.8333H30M30 13.8333V18.9722"
                      stroke="url(#paint0_linear_932_9820)"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_932_9820"
                        x1={1}
                        y1="1.5"
                        x2="35.1201"
                        y2="7.0558"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#369D9C" />
                        <stop offset={1} stopColor="#28814D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      background: 'linear-gradient(102deg, #369D9C 0%, #28814D 100%)',
                      backgroundClip: 'text',
                      '-webkitBackgroundClip': 'text',
                      '-webkitTextFillColor': 'transparent',
                    }}
                  >
                   Add New User
                  </Typography>
                </Box>

                <div
                  style={{
                    borderRight: '1px solid #DBDBDB',
                  }}
                ></div>

                <div className="drafts-container">
                  {draftsLoading ? (
                    // Show skeleton cards while loading
                    Array.from({ length: 3 }).map((_, index) => (
                      <SkeletonCard key={`draft-skeleton-${index}`} />
                    ))
                  ) : draftsError ? (
                    // Show error state
                    <EmptyState
                      title="Error loading drafts"
                      description="There was a problem loading your draft reports. Please try again."
                      actionText="Retry"
                      onAction={refetchDrafts}
                    />
                  ) : drafts.length === 0 ? (
                    // Show empty state when no drafts
                    <EmptyState
                      title="No drafts yet"
                      description="Create your first report to get started."
                      actionText="Create Report"
                      onAction={() => setCreateReport(true)}
                    />
                  ) : (
                    // Show actual draft cards
                    drafts.map((item, index) => (
                      <ReportCard key={`draft-${item.id}`} {...item} onDelete={handleDeleteDraft} />
                    ))
                  )}
                </div>
              </Box>
            </Box>

            <Box>
              {/* <h2 className="dashboard-report_heading">
                Your SI Reports which are ready for vetting.
              </h2> */}

              {/* <Box sx={{ overflowX: 'auto' }}>
                <Grid container spacing={2} sx={{ minWidth: '600px' }}>
                  {readyReports?.reports?.map((report) => {
                    return (
                      <Grid key={report?.id} item xs={4} sx={{ minWidth: '200px' }}>
                        <ReportForVerification
                          {...report}
                          onDelete={handleDeleteReadyReport}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box> */}
              <div className="drafts-container">
                {loadingReadyReports ? (
                  // Show skeleton cards while loading
                  Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonCard key={`ready-skeleton-${index}`} />
                  ))
                ) : readyReportsErr ? (
                  // Show error state
                  <EmptyState
                    title="Error loading reports"
                    description="There was a problem loading your ready reports. Please try again."
                    actionText="Retry"
                    onAction={refetchReadyReports}
                  />
                ) : !readyReports?.reports || readyReports.reports.length === 0 ? (
                  // Show empty state when no ready reports
                  <EmptyState
                    title="No reports ready for vetting"
                    description="Reports that are ready for vetting will appear here."
                  />
                ) : (
                  // Show actual ready reports
                  readyReports.reports.map(report => (
                    <ReportForVerification
                      key={report?.id}
                      {...report}
                      onDelete={handleDeleteReadyReport}
                    />
                  ))
                )}
              </div>
            </Box>

            <Box
              sx={{
                width: '100%',
                backgroundColor: '#fff',
                border: '1px solid #E4E4E4',
                borderRadius: '8px',
                padding: '1.3rem 1rem',
              }}
            >
              <h2 className="dashboard-report_heading">Your SI Reports Sent for Vetting</h2>
              <DashboardVettingTable />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Monitor;
