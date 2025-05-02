import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Sidebar from '../Components(Reusable)/Sidebar';
import axios from 'axios'; 
import './Analytics.css';

const Analytics = () => {
  const [missedChats, setMissedChats] = useState([]);
  const [avgReplyTime, setAvgReplyTime] = useState(0);
  const [resolvedPercent, setResolvedPercent] = useState(0);
  const [totalChats, setTotalChats] = useState(0);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get('http://localhost:9001/Analytics/getanalytics', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
  
      const data = response.data;
  
      console.log('Analytics Data:', data);
  
      if (data.data.weeklyData && Array.isArray(data.data.weeklyData)) {
        const weeks = data.data.weeklyData.map((week, i) => ({
          name: `Week ${i + 1}`,
          chats: week.missedChats,
        }));
        console.log('Missed Chats:', weeks);
        setMissedChats(weeks);
      }
      
     const avgReplyTime = data.data.averageResolutionTimeInHours;
      setAvgReplyTime(avgReplyTime); 
      setTotalChats(data.data.totalTickets);  
      setResolvedPercent((data.data.resolvedTickets / data.data.totalTickets) * 100); 
  
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };
  
  

  return (
    <div>
      <Sidebar />
      <div className="analytics-container">
  <h2 className="main-heading">Analytics</h2>

  <div>
    <div className="Graph-header">Missed Chats</div>
    <ResponsiveContainer width="90%" height={400} className="charts">
  <LineChart data={missedChats}>
    <CartesianGrid stroke="#ccc" horizontal={true} vertical={false} />
    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
    <YAxis tick={{ fontSize: 12 }} />
    <Tooltip
      contentStyle={{
        fontSize: '12px',
        background: 'black',
        color: 'white',
        borderRadius: '12%',
      }}
      formatter={(value) => [`Chats`, value]}
    />
    <Line
      type="monotone"
      dataKey="chats"
      stroke="#00D084"
      strokeWidth={5}
      dot={{ stroke: '#000', strokeWidth: 2, fill: '#fff' }}
      activeDot={{ r: 8 }}
    />
  </LineChart>
</ResponsiveContainer>
  </div>

  <h3 className="headings">Average Reply time</h3>
  <div className="Average-reply">
    <p className="Average-reply-content">
      For highest customer satisfaction rates, aim to reply within 15 seconds or less.
    </p>
    <span>{avgReplyTime} hrs</span>  
  </div>

  <div className="Resolved-tickets">
    <div>
      <h3 className="headings">Resolved Tickets</h3>
      <p>
        The callback system helps to attract more customers and increase satisfaction.
      </p>
    </div>
    <div style={{ width: '16%', height: '16%', marginTop: '90px', alignItems: "flex-end", position: "relative", left: "-40px" }}>
      <CircularProgressbar
        value={resolvedPercent}
        text={`${Math.round(resolvedPercent)}%`}
        styles={buildStyles({
          pathColor: '#00D084',
          trailColor: '#eee',
          textColor: '#000',
          textSize: '19px',
        })}
        strokeWidth={15}
      />
    </div>
  </div>

  <h3 className="headings" style={{ color: 'black', fontWeight: '400' }}>Total Chats</h3>
  <div className="Total-chats">
    <p>
      This metric shows the total number of chats for all Channels for the selected period.
    </p>
    <span>{totalChats} Chats</span>  
  </div>
</div>

    </div>
  );
};

export default Analytics;
