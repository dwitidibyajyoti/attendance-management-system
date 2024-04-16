import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import HorlidaysCalendar from './HolidaysCalender';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Holidays = () => {
  const [leaveDays, setLeaveDays] = useState([]);
  
  const refreshPage = () => {
    window.location.reload();
  };
  useEffect(() => {
    fetch('http://localhost:5000/leave/')
      .then((response) => response.json())
      .then((data) => {
        setLeaveDays(data.map((item) => ({ ...item, date: new Date(item.date) })));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLeaveDay = (date) => {
    console.log(date);
    if (!date) {
      console.error('Date is null or undefined');
      return;
    }

    const leaveDay = leaveDays.find((day) => day.date.getTime() === date.getTime());
    if (leaveDay) {
      const confirmed = window.confirm('Are you sure you want to delete?');
      if (!confirmed) {
        return;
      }

      setLeaveDays(leaveDays.filter((day) => day.date.getTime() !== date.getTime()));

      fetch(`http://localhost:5000/leave/${date.getTime()}`, {
        method: 'DELETE',
      })
        .then(() => {
          setTimeout(() => {
            console.log('Leave day removed successfully');
            refreshPage();
          }, 1500);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className='bg-white h-screen w-screen relative'>
      <HorlidaysCalendar />
      <div className="w-full absolute mt-1 overflow-y-auto h-60">
        <table className="border border-b-[.1rem] w-full table-fixed">
          <thead>
            <tr className='bg-slate-100 text-gray-700'>
              <th className="py-1">Created by</th>
              <th className="py-1">Date</th>
              <th className="py-1">Details</th>
              <th className="py-1">Delete</th>
            </tr>
          </thead>
          <tbody className='border border-b-[.1rem]'>
            {leaveDays.map((day, index) => (
              <tr key={index} className='border border-b-[.1rem]'>
                <td className="text-center py-1 opacity-95">{day.username}</td>
                <td className="text-center py-1 opacity-95">{day.date.toDateString()}</td>
                <td className="text-center py-1 opacity-95">{day.details}</td>
                <td className="text-center py-1 opacity-95">
                  <FontAwesomeIcon icon={faTrashAlt} onClick={() => handleLeaveDay(day.date)} className="ml-2 w-4 text-red-400 hover:text-red-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Holidays;