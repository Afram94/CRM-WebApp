// Components/CustomAgendaEvent.tsx
const CustomAgendaEvent = ({ event }: any) => {
  // Use inline styles for dynamic coloring
  const borderStyle = { borderLeft: `4px solid ${event.color}` };

  return (
    <div className="bg-gray-100">
      <div className="flex justify-between items-center p-2" style={borderStyle}>
        <div className="pl-2 ">
          <div className="text-sm font-medium text-gray-800">{event.title}</div>
          <div className="text-xs text-gray-500">
            {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAgendaEvent;
