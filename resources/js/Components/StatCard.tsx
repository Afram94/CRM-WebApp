import React from 'react';

const StatCard = ({ title, value, bgColor, textColor } : any) => (
    <div className={`rounded p-4 shadow ${bgColor}`}>
        <h4 className={`text-lg flex justify-center font-bold ${textColor}`}>{title}</h4>
        <p className={`text-xl flex justify-center ${textColor}`}>{value}</p>
    </div>
);

export default StatCard;
