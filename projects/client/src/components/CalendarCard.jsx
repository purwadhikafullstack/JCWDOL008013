import FullCalendar from '@fullcalendar/react'
import dayGridMonth from '@fullcalendar/daygrid'

const CalendarCard = (props) => {
    return (
        <FullCalendar
            height={600}
            plugins={[dayGridMonth]}
            initialView='dayGridMonth'
            headerToolbar={{
                right: 'prevYear,prev,next,nextYear'
            }}
            events={props.data.events}
        />
    )
}

export default CalendarCard