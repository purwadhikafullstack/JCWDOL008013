import FullCalendar from '@fullcalendar/react'
import dayGridMonth from '@fullcalendar/daygrid'

const CalendarCard = (props) => {
    // Get room price
    let price = props.data.price

    // Get dates list in years
    let getDaysArray = (start, end) => {
        for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
            arr.push(new Date(dt));
        }
        return arr;
    };
    let dateList = getDaysArray(new Date(), new Date("2025-12-31"));
    let dateFormat = dateList.map((val) => val.toISOString().split("T")[0]);

    // Unavailability data
    let unavailabilityData = props.data.unavailability
    let unavailabilityEvent = unavailabilityData.map((val) => {
        return { ...val, title: 'unavailable', color: 'red' }
    });

    // Special price data
    let specialPriceData = props.data.specialPrice;
    let specialPriceEvent = specialPriceData.map((val) => {
        if (val.nominal === null) {
            let title = price + (price * val.percent / 100);
            return { ...val, title: `Rp ${title.toLocaleString('id')}`, color: 'orange' }
        } else if (val.percent === null) {
            let title = price + val.nominal;
            return { ...val, title: `Rp ${title.toLocaleString('id')}`, color: 'orange' }
        }
    })

    // Generate calendar events
    let eventCombine = [...unavailabilityEvent, ...specialPriceEvent];
    let event = [];
    let endDate = new Date().toISOString().split("T")[0];

    for (let i = 0; i < dateFormat.length; i++) {
        let day = dateFormat[i];
        let filteredEvent = eventCombine.find(e => e.start === day);
        if (filteredEvent) {
            let title = filteredEvent.title;
            let start = filteredEvent.start;
            let end = filteredEvent.end;
            let color = filteredEvent.color;
            event.push({ title, start, end, color })
            endDate = filteredEvent.end;
        } else if (day >= endDate) {
            event.push({ title: `Rp ${price.toLocaleString('id')}`, start: day, end: day })
        }
    }

    return (
        <FullCalendar
            height={600}
            plugins={[dayGridMonth]}
            initialView='dayGridMonth'
            headerToolbar={{
                right: 'prevYear,prev,next,nextYear'
            }}
            events={event}
        />
    )
}

export default CalendarCard