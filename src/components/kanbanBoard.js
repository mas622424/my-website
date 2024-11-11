import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TicketCard from './TicketCard';
import Filter from './Filter';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanBoard.css';

const KanbanBoard = () => {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupBy, setGroupBy] = useState('status');
    const [sortBy, setSortBy] = useState('title');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false); // State for popup visibility

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
                setTickets(response.data.tickets);
                setUsers(response.data.users);
            } catch (err) {
                setError('Failed to fetch tickets. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const groupTickets = () => {
        const grouped = {};
        tickets.forEach(ticket => {
            let key;
            if (groupBy === 'status') key = ticket.status;
            else if (groupBy === 'user') {
                const user = users.find(user => user.id === ticket.userId);
                key = user ? user.name : 'Unknown User';
            } else if (groupBy === 'priority') key = getPriorityLabel(ticket.priority);
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(ticket);
        });
        return Object.entries(grouped).map(([key, tickets]) => ({ key, tickets }));
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 4: return 'Urgent';
            case 3: return 'High';
            case 2: return 'Medium';
            case 1: return 'Low';
            case 0: return 'No Priority';
            default: return 'Unknown';
        }
    };

    const sortedTickets = (tickets) => {
        return tickets.sort((a, b) => {
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            else if (sortBy === 'priority') return b.priority - a.priority;
            return 0;
        });
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const updatedTickets = Array.from(tickets);
        const [movedTicket] = updatedTickets.splice(source.index, 1);
        updatedTickets.splice(destination.index, 0, movedTicket);
        setTickets(updatedTickets);
    };

    const groupedTickets = groupTickets();
    const sortedGroupedTickets = groupedTickets.map(group => ({
        ...group,
        tickets: sortedTickets(group.tickets)
    }));

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="kanban-board">
                <button onClick={togglePopup} className="details-button">Details</button>

                {showPopup && (
                    <div className="popup-overlay" onClick={togglePopup}>
                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                            <button onClick={togglePopup} className="close-button">Close</button>
                            <Filter setGroupBy={setGroupBy} setSortBy={setSortBy} />
                        </div>
                    </div>
                )}

                {loading && <div className="loading-message">Loading tickets...</div>}
                {error && <div className="error-message">{error}</div>}
                <div className="ticket-columns">
                    {sortedGroupedTickets.map(group => (
                        <Droppable key={group.key} droppableId={group.key}>
                            {(provided) => (
                                <div
                                    className="ticket-column"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}>
                                    <h2>{group.key}</h2>
                                    {group.tickets.map((ticket, index) => (
                                        <Draggable key={ticket.id} draggableId={String(ticket.id)} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <TicketCard ticket={ticket} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
