import React from 'react';
import './TicketCard.css';

const TicketCard = ({ ticket }) => {
    return (
        <div className={`ticket-card priority-${ticket.priority}`}>
            <h3>{ticket.title}</h3>
            <p>{ticket.tag.join(', ')}</p> <p>Status: {ticket.status}</p>
            <p>Priority: {getPriorityLabel(ticket.priority)}</p>
        </div>
    );
};

const getPriorityLabel = (priority) => {
    switch (priority) {
        case 4: return 'Urgent';
        case 3: return 'High';
        case 2: return 'Medium';
        case 1: return 'Low';
        case 0: return 'No Priority';
        default: return 'Unknown Priority';
    }
};

export default TicketCard;
