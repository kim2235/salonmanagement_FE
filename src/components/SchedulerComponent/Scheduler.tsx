import React, {useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from "../EventModalComponent/EventModal";
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import {Client} from "../../types/Client";
import '@fullcalendar/common/main.css';
import clientList from "../../testData/clientList.json";

export interface CalendarEvent {
    id: string;
    title: string;
    clientID?: string;
    start: Date | string;
    end: Date | string;
    backgroundColor?: string;
    selectedBackgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    isCanceled?: boolean;
}

interface SchedulerProps {
    onReservationSelect: (newReservation: any) => void;
    eventsPlot?: CalendarEvent[];
}

const Scheduler: React.FC<SchedulerProps> = ({ onReservationSelect, eventsPlot }) => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date, end: Date } | null>(null);
    const [tentativeEvent, setTentativeEvent] = useState<CalendarEvent | null>(null);
    const [clientListing, setClientListing] = useState<Client[] | null>([]);

    useEffect(() => {
        // Fallback to an empty array if eventsPlot is undefined
        setEvents(eventsPlot || []);

    }, []);

    const findRecordById = (id: string) => {
        return clientListing?.find(record => record.id === id);
    };

    // Handle when an event is clicked (for editing)
    const handleEventClick = (clickInfo: EventClickArg) => {
        const clickedEvent = {
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            start: clickInfo.event.start ? clickInfo.event.start.toISOString() : '',
            end: clickInfo.event.end ? clickInfo.event.end.toISOString() : '',
            clientID: clickInfo.event.extendedProps.clientID  ? clickInfo.event.extendedProps.clientID  : '',
            backgroundColor: clickInfo.event.extendedProps.selectedBackgroundColor  ? clickInfo.event.extendedProps.selectedBackgroundColor  : '',
        };
        setClientListing(clientList);
        setSelectedEvent(clickedEvent); // Set the selected event for editing
        setIsModalOpen(true); // Open the modal for editing
        setTentativeEvent(null); // Ensure there's no tentative event when editing
    };

    // Handle when a date range is selected (for creating)
    const handleDateSelect = (selectInfo: DateSelectArg) => {
        const newTentativeEvent: CalendarEvent = {
            id: 'tentative',
            title: 'New Event',
            start: selectInfo.start,
            end: selectInfo.end,
        };

        setClientListing(clientList);
        setSelectedDateRange({ start: selectInfo.start, end: selectInfo.end });
        setTentativeEvent(newTentativeEvent); // Show the tentative event on the calendar
        setIsModalOpen(true); // Open the modal for creating a new event
    };

    // Handle event creation or editing submission
    const handleEventSubmit = (title: string, color: string, client: string) => {
        const selectedClient = findRecordById(client);
        if (selectedEvent) {
            // If we're editing an existing event
            const updatedEvents = events.map(event =>
                event.id === selectedEvent.id
                    ? { ...event, title }
                    : event
            );
            setEvents(updatedEvents);
        } else if (tentativeEvent) {
            // If we're creating a new event, convert the tentative event into a real event
            const newEvent: CalendarEvent = {
                ...tentativeEvent,
                id: Date.now().toString(), // Generate a unique ID
                title: title + " " + selectedClient?.firstName + " " + selectedClient?.lastName,
                clientID: client,
                backgroundColor: color,
                selectedBackgroundColor: color,
            };
            setEvents([...events, newEvent]); // Add the new event to the list
        }

        // Reset states after event submission
        setIsModalOpen(false);
        setSelectedDateRange(null);
        setTentativeEvent(null); // Clear the tentative event
        setSelectedEvent(null);
    };

    // Handle modal close (reset any tentative event)
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedDateRange(null); // Clear selected date range
        setSelectedEvent(null); // Clear selected event
        setTentativeEvent(null); // Remove tentative event if modal is closed without submission
        console.log(events)
    };

    // Determine if the modal is for edit or create
    const modalMode = selectedEvent ? "edit" : "create";
    const handleRemoveEvent = (id: string) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === id ? { ...event, isCanceled: true } : event // Mark event as canceled
            )
        );
        console.log(`Event with ID ${id} marked as canceled.`);
    };
    return (
        <>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
                initialView="timeGridWeek"
                events={[...events, ...(tentativeEvent ? [tentativeEvent] : [])]} // Include tentative event if present
                eventClick={handleEventClick}
                select={handleDateSelect}
                slotDuration="00:30:00"
                slotLabelInterval="00:30:00"
                allDaySlot={false}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                height="auto"
                editable={true}
                selectable={true}
                selectMirror={true}
                eventContent={(arg) => {
                    // Check if the event is canceled and apply strikethrough
                    const isCanceled = arg.event.extendedProps.isCanceled;
                    return {
                        html: `<div style="text-decoration: ${isCanceled ? 'line-through' : 'none'};">
                       ${arg.event.title}
                   </div>`,
                    };
                }}
            />
            <EventModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleEventSubmit}
                onRemove={handleRemoveEvent}
                event={selectedEvent || tentativeEvent}
                client={clientListing}
                mode={modalMode} // Pass mode to the modal
            />
        </>
    );
};

export default Scheduler;

