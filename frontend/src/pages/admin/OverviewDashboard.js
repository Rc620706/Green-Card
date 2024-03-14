import React from 'react';
// Importing the charts
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart} from '@mui/x-charts/LineChart'

export default function OverviewDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1em', overflow: 'auto' }}>
      {/* Container for the first row of charts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', width: '100%' }}>
        {/* Bar Chart */}
        <div style={{ width: '50%' }}>
          <h4>BarChart for User Logins</h4>
          <BarChart
            series={[
              { data: [35, 44, 24, 34] },
              { data: [51, 6, 49, 30] },
              { data: [15, 25, 30, 50] },
              { data: [60, 50, 15, 25] },
            ]}
            height={290}
            xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </div>
        {/* Pie Chart */}
        <div style={{ width: '50%' }}>
          <h4>PieChart for User Logins</h4>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: 'series A' },
                  { id: 1, value: 15, label: 'series B' },
                  { id: 2, value: 20, label: 'series C' },
                ],
              },
            ]}
            width={400}
            height={200}
          />
        </div>
      </div>

      {/* Container for the second row of charts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', width: '100%', marginTop: '2em' }}>
        {/* First Line Chart */}
        <div style={{ width: '50%' }}>
          <h4>LineChart for Monthly Activity</h4>
          <LineChart
            series={[
              { data: [30, 40, 45, 50, 49, 60, 70, 91] },
            ]}
            // Other LineChart properties such as height, xAxis, margin, etc.
          />
        </div>
        {/* Second Line Chart */}
        <div style={{ width: '50%' }}>
          <h4>LineChart for Annual Revenue</h4>
          <LineChart
            series={[
              { data: [80, 82, 85, 88, 92, 95, 98, 100] },
            ]}
            // Other LineChart properties such as height, xAxis, margin, etc.
          />
        </div>
      </div>
    </div>
  );
}