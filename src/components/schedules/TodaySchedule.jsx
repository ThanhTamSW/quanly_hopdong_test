const [data, setData] = useState(null);

useEffect(() => {
  scheduleApi.getMyToday().then(res => setData(res.data));
}, []);

<div>
  <StatCard title="Tổng ca dạy" value={data.summary.total} />
  <StatCard title="Thu nhập" value={data.summary.earnings} />
  
  {data.schedules.map(schedule => (
    <ScheduleCard 
      schedule={schedule}
      onCheckIn={() => handleCheckIn(schedule._id)}
      onCheckOut={() => handleCheckOut(schedule._id)}
    />
  ))}
</div>