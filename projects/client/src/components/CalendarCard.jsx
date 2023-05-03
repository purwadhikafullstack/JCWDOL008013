import { Card, CardBody } from "@chakra-ui/react"
import FullCalendar from '@fullcalendar/react'
import dayGridMonth from '@fullcalendar/daygrid'

const CalendarCard = (props) => {
    return (
        <Card>
            <CardBody>
                <FullCalendar
                    height={600}
                    plugins={[dayGridMonth]}
                    initialView='dayGridMonth'
                    buttonText={{ today: 'Today' }}
                    headerToolbar={{
                        right: 'today prevYear,prev,next,nextYear'
                    }}
                    events={props.data.events}
                />
            </CardBody>
        </Card>
    )
}

export default CalendarCard