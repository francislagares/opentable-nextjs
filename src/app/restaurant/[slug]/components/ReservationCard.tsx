'use client';

import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import DatePicker from 'react-datepicker';

import { convertToDisplayTime, Time } from '@/app/utils/convertToDisplayTime';
import { partySize as partySizes, schedules } from '@/data';
import useAvailabilities from '@/hooks/useAvailabilities';

interface Props {
  openTime: string;
  closeTime: string;
  slug: string;
}

const ReservationCard = ({ openTime, closeTime, slug }: Props) => {
  const { data, loading, error, fetchAvailabilities } = useAvailabilities();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState('2');
  const [day, setDay] = useState(new Date().toISOString().split('T')[0]);

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split('T')[0]);
      return setSelectedDate(date);
    }

    return setSelectedDate(null);
  };

  const handleClick = () => {
    fetchAvailabilities({
      slug,
      day,
      time,
      partySize,
    });
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
    <div className='fixed w-[22%] bg-white rounded p-3 shadow'>
      <div className='text-center border-b pb-2 font-bold'>
        <h4 className='mr-7 text-lg'>Make a Reservation</h4>
      </div>
      <div className='my-3 flex flex-col'>
        <label htmlFor=''>Party size</label>
        <select
          name=''
          className='py-3 border-b font-light'
          id=''
          value={partySize}
          onChange={e => setPartySize(e.target.value)}
        >
          {partySizes.map(size => (
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
          <select
            name=''
            id=''
            className='py-3 border-b font-light'
            value={time}
            onChange={e => setTime(e.target.value)}
          >
            {filterTimeByRestaurantOpenWindow().map((schedule, index) => (
              <option key={index} value={schedule.time}>
                {schedule.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='mt-5'>
        <button
          className='bg-red-600 rounded w-full px-4 text-white font-bold h-16'
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? <CircularProgress color='inherit' /> : 'Find a Time'}
        </button>
      </div>
      {data && data.length ? (
        <div className='mt-4'>
          <p className='text-reg'>Select a Time</p>
          <div className='flex mt-2'>
            {data.map((schedule, index) => {
              return schedule.available ? (
                <Link
                  key={index}
                  href={`/reserve/${slug}?date=${day}T${schedule.time}&partySize=${partySize}`}
                  className='bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3'
                >
                  <p className='text-sm font-bold'>
                    {convertToDisplayTime(schedule.time as Time)}
                  </p>
                </Link>
              ) : (
                <p className='bg-gray-300 p-2 w-24 mb-3 rounded mr-3'></p>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ReservationCard;
