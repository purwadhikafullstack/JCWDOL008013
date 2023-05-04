import React, { Component } from 'react';
import moment from 'moment';
import MomentCalendarFactory from 'moment-calendar-2/src/api';
import leftPad from 'left-pad';


class CalendarTable extends Component {

    constructor(props) {
        super(props)
    
        window.moment = moment;
        // const today = new Date();

        // const dateOfMonth = today.getDate();
        // const monthOfYear = today.getMonth() + 1; // 0 based
        // const year        = today.getFullYear();
        // const other = {
        //     day: dateOfMonth,
        //     month: monthOfYear,
        //     year: year
        // }
        // const formattedDate = [
        //     leftPad(other.year, 4, 0),
        //     leftPad(other.month, 2, 0),
        //     leftPad(other.day, 2, 0)
        // ].join("-")

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

