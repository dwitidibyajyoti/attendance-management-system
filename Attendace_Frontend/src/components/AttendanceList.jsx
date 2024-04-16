import React, { useEffect, useState } from 'react';
import { format, getDaysInMonth } from 'date-fns';
import Cookies from 'js-cookie';

  const AttendanceList = ({ users = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersTime , setAllUsersTime] = useState();
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/allusers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        setAllUsers(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [token]);

  fetch('http://localhost:5000/time/dailyTime/allUsers')
    .then(response => response.json())
    .then(data => {
        setAllUsersTime(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

  const handleMonthChange = (e) => {
    const selectedMonth = parseInt(e.target.value);
    setSelectedDate((prevDate) => new Date(prevDate.setMonth(selectedMonth)));
  };

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value);
    setSelectedDate((prevDate) => new Date(prevDate.setFullYear(selectedYear)));
  };

  const renderHeader = () => {
    return (
      <div className='flex gap-8'>
        <h1 className=''>Attendance List</h1>
        <select value={selectedDate.getMonth()} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {format(new Date(0, i), 'MMMM')}
            </option>
          ))}
        </select>
        <select value={selectedDate.getFullYear()} onChange={handleYearChange}>
          {Array.from({ length: 10 }, (_, i) => {
            const year = new Date().getFullYear() - 5 + i;
            return (
              <option key={i} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    return (
      <table>
        <thead>
          <tr>
            <th>Employees Name</th>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.Username}</td>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <td key={i} className='px-4 py-2 border'>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  return (
    <div className='w-fit h-fit p-3'>
      {renderHeader()}
      {renderCalendar()}
    </div>
  );
};

export default AttendanceList;
