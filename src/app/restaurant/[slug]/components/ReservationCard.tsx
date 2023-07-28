'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';

import { partySize, schedules } from '@/data';

interface Props {
  openTime: string;
  closeTime: string;
}

const ReservationCard = ({ openTime, closeTime }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      return setSelectedDate(date);
    }

    return setSelectedDate(null);
  };

  const filterTimeByRestaurantOpenWindow = () => {
    const timesInWindow: typeof schedules = [];

    let isWithinWindow = false;

    schedules.forEach(schedule => {
      if (!isWithinWindow && schedule.time === openTime) {
        isWithinWindow = true;
      }

      if (isWithinWindow) {
        timesInWindow.push(schedule);
      }

      if (schedule.time === closeTime) {
        isWithinWindow = false;
      }
    });

    return timesInWindow;
  };

  return (
    <div className='fixed w-[15%] bg-white rounded p-3 shadow'>
      <div className='text-center border-b pb-2 font-bold'>
        <h4 className='mr-7 text-lg'>Make a Reservation</h4>
      </div>
      <div className='my-3 flex flex-col'>
        <label htmlFor=''>Party size</label>
        <select name='' className='py-3 border-b font-light' id=''>
          {partySize.map(size => (
            <option key={size.label} value={size.label}>
              {size.value}
            </option>
          ))}
        </select>
      </div>
      <div className='flex justify-between'>
        <div className='flex flex-col w-[48%]'>
          <label htmlFor=''>Date</label>
          <DatePicker
            onChange={handleChangeDate}
            selected={selectedDate}
            className='py-3 border-b font-light text-reg w-24'
            dateFormat='MMMM d'
            wrapperClassName='w-[48%]'
          />
        </div>
        <div className='flex flex-col w-[48%]'>
          <label htmlFor=''>Time</label>
          <select name='' id='' className='py-3 border-b font-light'>
            {filterTimeByRestaurantOpenWindow().map((schedule, index) => (
              <option key={index} value={schedule.time}>
                {schedule.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='mt-5'>
        <button className='bg-red-600 rounded w-full px-4 text-white font-bold h-16'>
          Find a Time
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;
