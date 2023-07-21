import React from 'react';
import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
            grace: '5%',
        }
    },
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Project Progress',
        }
    },
};

const BarChart = (props) => {
    const { user } = props;
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState(
        {
            labels: [],
            datasets: [
                {
                    label: 'Total Tasks',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Completed',
                    data: [],
                    backgroundColor: 'rgba(226,146,142, 0.5)',
                },
            ],
        }
    );

    useEffect(() => {
        setLoading(true);
        axios
            .get(process.env.REACT_APP_API_URI + 'stats/projects/tasks/' + user.uid)
            .then((response) => {
                const data = {
                    labels: [],
                    datasets: [
                        {
                            label: 'Total Tasks',
                            data: [],
                            backgroundColor: 'rgba(56, 116, 203, 0.5)',
                        },
                        {
                            label: 'Completed',
                            data: [],
                            backgroundColor: 'rgb(240,141,139, 0.5)',
                        },
                    ],
                };

                response.data.forEach(project => {
                    data.labels.push(project.title.length > 15 ? project.title.substring(0, 15) + '...' : project.title);
                    data.datasets[0].data.push(project.total_tasks);
                    data.datasets[1].data.push(project.completed_tasks);
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
                    <Bar options={options} data={data} />
            }
        </div>
    );
};

export default BarChart;
