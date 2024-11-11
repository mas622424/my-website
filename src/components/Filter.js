import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ setGroupBy, setSortBy }) => {
    const [groupBy, setGroupByState] = useState('status');
    const [sortBy, setSortByState] = useState('priority');

    const handleGroupByChange = (e) => {
        setGroupByState(e.target.value);
        setGroupBy(e.target.value);
    };

    const handleSortByChange = (e) => {
        setSortByState(e.target.value);
        setSortBy(e.target.value);
    };

    return (
        <div className="filter">
            <div className="filter-group">
                <label htmlFor="groupBy">Grouping:</label>
                <select id="groupBy" value={groupBy} onChange={handleGroupByChange}>
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                </select>
            </div>
            <div className="filter-group">
                <label htmlFor="sortBy">Ordering:</label>
                <select id="sortBy" value={sortBy} onChange={handleSortByChange}>
                    <option value="title">Title</option>
                    <option value="priority">Priority</option>
                </select>
            </div>
        </div>
    );
};

export default Filter;
