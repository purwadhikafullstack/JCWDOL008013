import FullCalendar from '@fullcalendar/react'
import dayGridMonth from '@fullcalendar/daygrid'

const CalendarCard = (props) => {
    const calendarEvent = [...props.data.unavailability, ...props.data.specialPrice]
    return (
        <FullCalendar
            height={600}
            plugins={[dayGridMonth]}
            initialView='dayGridMonth'
            headerToolbar={{
                right: 'prevYear,prev,next,nextYear'
            }}
            events={calendarEvent}
        />
    )
}

export default CalendarCard