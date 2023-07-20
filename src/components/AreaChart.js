import React from 'react';
import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: '7 Day Progress',
        },
    },
};

const AreaChart = (props) => {

    const { user } = props;
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState(
        {
            labels: [],
            datasets: [
                {
                    fill: true,
                    label: 'Tasks Completed',
                    data: [],
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        }
    );

    useEffect(() => {
        setLoading(true);
        axios
            .get(process.env.REACT_APP_API_URI + 'stats/tasks/weekly/' + user.uid)
            .then((response) => {
                const data = {
                    labels: [],
                    datasets: [
                        {
                            fill: true,
                            label: 'Tasks Completed',
                            data: [],
                            borderColor: 'rgb(240,141,139)',
                            backgroundColor: 'rgb(240,141,139, 0.5)',
                        },
                    ],
                };
                response.data.forEach(day => {
                    data.labels.push(day.date.slice(5));
                    data.datasets[0].data.push(day.completed_tasks);
                });
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setLoading(false);
            })
    }, [user.uid]);

    return (
        <div>
            {
                loading ?
                    <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size={'3rem'} />
                    </div>
                :
                    <Line options={options} data={data} />
            }
        </div>
    );
}

export default AreaChart;