import React, { Component } from 'react';
import moment from 'moment';
import MomentCalendarFactory from 'moment-calendar-2/src/api';
import leftPad from 'left-pad';


class CalendarTable extends Component {

    constructor(props) {
        super(props)
    
        window.moment = moment;

        this.state = {
            date: this.props.date,price : []
        }
    
        this.calendar = MomentCalendarFactory.getInstance();
    }
    
    componentWillReceiveProps(newProps){
        this.setState({
            date: newProps.date,
            price: newProps.data
        });
    }
    
    render() {
        this.calendar.setCurrentDate(this.state.date);
        const weeks = this.calendar.getWeeksTable(true);
        weeks[0][0] = "Minggu"
        weeks[0][1] = "Senin"
        weeks[0][2] = "Selasa"
        weeks[0][3] = "Rabu"
        weeks[0][4] = "Kamis"
        weeks[0][5] = "Jumat"
        weeks[0][6] = "Sabtu"

        return <div className="calendar">
            {weeks.map( (days, i) => {
            return <div className="week" key={i}>
                {days.map( (day, di) =>{
                return <div className="day" key={di}>
                    {isNaN(day)?day:day!=""?(
                    <React.Fragment>
                        {day}
                        <br />
                        {this.state.price[day-1]||"Not Available"}
                    </React.Fragment>
                    ):(
                    <React.Fragment>
                        {day}
                        <br />
                        -
                    </React.Fragment>
                    )||"\u00a0"} 
                </div>
                })}
            </div>
            })}
        </div>
        }
    }

export default CalendarTable;

