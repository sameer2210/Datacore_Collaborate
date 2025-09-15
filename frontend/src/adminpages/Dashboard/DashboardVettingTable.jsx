import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { reportEndpoints } from '../../api/endpoints/report.endpoints';
import verticalArrows from '../../assets/verticalArrows.svg';
import useFetch from '../../utils/hooks/useFetch';

const DashboardVettingTable = () => {
  const {
    data: vettedReports,
    loading: loadingVettedReports,
    error: vettedReportsErr,
  } = useFetch(reportEndpoints.getReports, {
    status: 'sendForVerification',
  });
  const [sortOrder, setSortOrder] = useState('asc');
  const handleSort = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortedReports = [...(vettedReports?.reports || [])].sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
  return (
    <div className="vetting_table-container">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          minWidth: '520px',
        }}
      >
        <Grid container>
          <Grid item xs={3} className="vetting_table-heading">
            Report No.
          </Grid>
          <Grid item xs={3} className="vetting_table-heading">
            Report Name
          </Grid>
          <Grid
            item
            xs={3}
            className="vetting_table-heading"
            sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>Date of Submission</span>

            <img
              src={verticalArrows}
              height={12}
              width={12}
              alt="Sort"
              style={{ cursor: 'pointer' }}
              onClick={handleSort}
            />
          </Grid>
          <Grid
            item
            xs={3}
            className="vetting_table-heading"
            sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>Status</span>
            <img
              src={verticalArrows}
              height={12}
              width={12}
              alt="Sort"
              style={{ cursor: 'pointer' }}
            />
          </Grid>
        </Grid>

        {sortedReports?.map(item => {
          return (
            <Link
              // target="_blank"
              key={item?.id}
              style={{ textDecoration: 'none', color: 'black' }}
              to={
                item?.status === 'rejected' ? `rejected/${item?.id}` : `/score-card/${item?.id}`
                // item?.status === "rejected"
                // ? `/score-card/${item?.id}`
                // : `/score-card/${item?.id}`
              }
            >
              <Grid
                key={item.id}
                container
                sx={{
                  border: '1px solid #EEEEEE',
                  borderRadius: '4px',
                  width: '100%',
                }}
              >
                <Grid item xs={3} className="vetting_table-cell">
                  {item?.reportNo}
                </Grid>
                <Grid item xs={3} className="vetting_table-cell">
                  {item?.name}
                </Grid>
                <Grid item xs={3} className="vetting_table-cell">
                  {new Date(item.updatedAt).toISOString().split('T')[0]}
                  {/* 12/03/2024 */}
                </Grid>
                <Grid
                  item
                  xs={3}
                  className="vetting_table-cell"
                  sx={{
                    textTransform: 'capitalize',
                    color: item.status === 'rejected' ? '#FF3A3A' : '#019875',
                  }}
                >
                  {item?.status === 'sendForVerification' ? 'Sent for Vetting' : 'Rejected'}
                </Grid>
              </Grid>
            </Link>
          );
        })}
      </Box>
    </div>
  );
};

export default DashboardVettingTable;
