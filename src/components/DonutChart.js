import React from 'react';
import { useState, useEffect, useCallback } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = (props) => {

    const {project, categories} = props;

    const [data, setData] = useState(
        {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: [],
                    hoverBackgroundColor: [],
                },
            ],
        }
    );

    const createData = useCallback(() => {
        if (!categories || categories.length === 0) {
            return {
                labels: [],
                datasets: [
                    {
                        data: [],
                        backgroundColor: [],
                        hoverBackgroundColor: [],
                    },
                ],
            };
        }

        const categoryCounts = {};
        categories.forEach((category) => {
            categoryCounts[category.name] = 0;
        });
        categoryCounts.None = 0;

        project.tasks.forEach((task) => {
            if (task.task_category_name && categoryCounts.hasOwnProperty(task.task_category_name)) {
                categoryCounts[task.task_category_name]++;
            }
        });
        
        var data = {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: [],
                    hoverBackgroundColor: [],
                },
            ],
        };

        categories.forEach(category => {
            data.labels.push(category.name);
            data.datasets[0].data.push(categoryCounts[category.name]);
            data.datasets[0].backgroundColor.push(category.color);
            data.datasets[0].hoverBackgroundColor.push(category.color);
        });

        data.labels.push("None");
        data.datasets[0].data.push(categoryCounts.None);
        data.datasets[0].backgroundColor.push("#bab5b5");
        data.datasets[0].hoverBackgroundColor.push("#bab5b5");

        return data;
    }, [categories, project.tasks]);

    useEffect(() => {
        setData(createData());
    }, [createData]);

    return (<Doughnut data={data} options={{responsive: true}}/>);
};

export default DonutChart;
