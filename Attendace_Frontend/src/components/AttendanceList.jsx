import React, { useEffect, useState } from 'react';
import { format, getDaysInMonth, addMonths, subMonths, addDays } from 'date-fns';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AttendanceList = ({ users = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersTime, setAllUsersTime] = useState();
  const userID = Cookies.get('userId');
  const [dailyTimes, setDailyTimes] = useState(null); console.log(dailyTimes);
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  const userName = Cookies.get('username') || '';

  useEffect(() => {
    async function fetchAllData() {
      try {
        const response = await fetch(`http://localhost:5000/time/${userID}/dailyTime`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const dataArray = Object.values(data);

        const dailyTimes = dataArray.map(item => ({
          date: item.date,
          totalTime: item.totalTime
        }));

        setDailyTimes(dailyTimes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if (userID) {
      fetchAllData();
    }
  }, [userID, token]);

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

  useEffect(() => {
    fetch('http://localhost:5000/time/dailyTime/allUsers')
      .then(response => response.json())
      .then(data => {
        setAllUsersTime(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleMonthChange = (e) => {
    const selectedMonth = parseInt(e.target.value);
    setSelectedDate((prevDate) => new Date(prevDate.getFullYear(), selectedMonth));
  };

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value);
    setSelectedDate((prevDate) => new Date(selectedYear, prevDate.getMonth()));
  };

  const handleForward = () => {
    setSelectedDate(prevDate => addMonths(prevDate, 1));
  };

  const handleBackward = () => {
    setSelectedDate(prevDate => subMonths(prevDate, 1));
  };

  const renderHeader = () => {
    return (
      <div className='flex gap-8 relative items-center border rounded-md border-gray-200 mb-5 p-2'>
        <h1 className='font-semibold text-xl opacity-85 border-4 border-gray-200 rounded-full p-2 bg-green-200'>Attendance list</h1>
        <select value={selectedDate.getMonth()} onChange={handleMonthChange} className='font-bold text-xl opacity-85'>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {format(new Date(0, i), 'MMMM')}
            </option>
          ))}
        </select>
        <select value={selectedDate.getFullYear()} onChange={handleYearChange} className='font-bold text-xl opacity-85'>
          {Array.from({ length: 10 }, (_, i) => {
            const year = new Date().getFullYear() - 5 + i;
            return (
              <option key={i} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <div className='right-[15%] absolute'>
          <button onClick={handleBackward} className='mr-10 text-2xl opacity-70'><FaChevronLeft /></button>
          <button onClick={handleForward} className='text-2xl opacity-70'><FaChevronRight /></button>
        </div>
        <div className='cursor-pointer absolute right-3 text-xl border-2 rounded-lg px-3 py-1 border-gray-200'>
          <FontAwesomeIcon icon={faFileExport} className='text-cyan-600 mr-2' />
          <span>export</span>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const startDate = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), 1);
    // const endDate = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), daysInMonth);
    const visibleUsers = allUsers.slice(0, 15);
    const cellWidth = '10rem';

    return (
      <div className='overflow-scroll h-48'>
        <table className='table-fixed justify-center items-center'>
          <thead className='sticky top-0 bg-white z-10'>
            <tr className='border-b-2 border-gray-100'>
              <th className='text-left opacity-80 w-3/12'>Employees Name</th>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th className='opacity-80 w-1/12' key={i} style={{ width: cellWidth }}>{format(addDays(startDate, i), 'd')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(role === 'admin' || role === 'hr') && visibleUsers.map((user, index) => (
              <tr key={index} className='border-b-2 py-4 border-gray-100'>
                <td className='font-medium'>{user.Username}</td>
                {Array.from({ length: 15 }, (_, i) => (
                  <td key={i} className='py-4' style={{ width: cellWidth }}></td>
                ))}
              </tr>
            ))}
              {(role === 'user' && dailyTimes) && (
                <tr className='border-b-2 border-gray-100'>
                  <td className='font-medium'>{userName}</td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const currentDate = addDays(startDate, i);
                    const formattedDate = format(currentDate, 'yyyy-MM-dd');

                    const dailyTime = dailyTimes.find(day => day.date === formattedDate);

                    let totalHours = '';
                    let totalMinutes = '';
                    if (dailyTime) {
                      totalHours = Math.floor(dailyTime.totalTime / (1000 * 60 * 60));
                      totalMinutes = Math.floor((dailyTime.totalTime % (1000 * 60 * 60)) / (1000 * 60));
                    }
                    return (
                      <td key={i} className='' style={{ width: cellWidth }}>
                        {dailyTime && (
                          <div>
                            {totalHours}.{totalMinutes}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              )}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <div className='p-6 mt-3 bg-white '>
      {renderHeader()}
      {renderCalendar()}
    </div>
  );
};

export default AttendanceList;
